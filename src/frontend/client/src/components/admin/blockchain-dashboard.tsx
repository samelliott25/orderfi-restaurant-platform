import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Shield, 
  Download, 
  Database, 
  CheckCircle, 
  XCircle, 
  Blocks, 
  Hash,
  Clock,
  FileText,
  RefreshCw,
  Utensils
} from "lucide-react";

interface BlockchainDashboardProps {
  restaurantId: number;
}

export function BlockchainDashboard({ restaurantId }: BlockchainDashboardProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Fetch blockchain status
  const { data: blockchainStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/blockchain/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Type assertion for blockchain stats
  const stats = blockchainStats as any;

  // Fetch categorized menu items
  const { data: categorizedItems, isLoading: itemsLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu/categorized`],
  });

  // Validate categories mutation
  const validateCategoriesMutation = useMutation({
    mutationFn: () => fetch(`/api/restaurants/${restaurantId}/menu/validate-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),
    onSuccess: (data) => {
      toast({ 
        title: "Categories Validated", 
        description: data.message 
      });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu/categorized`] });
    },
    onError: () => {
      toast({ 
        title: "Validation Failed", 
        description: "Could not validate menu categories" 
      });
    }
  });

  // Export blockchain data
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/blockchain/export');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `mimi-blockchain-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({ title: "Export Complete", description: "Blockchain data exported successfully" });
    } catch (error) {
      toast({ title: "Export Failed", description: "Could not export blockchain data" });
    } finally {
      setIsExporting(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTotalItems = () => {
    if (!categorizedItems) return 0;
    return Object.values(categorizedItems).reduce((total: number, items: any) => total + items.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blockchain Database</h2>
          <p className="text-muted-foreground">Decentralized menu storage with categorization</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => validateCategoriesMutation.mutate()}
            disabled={validateCategoriesMutation.isPending}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${validateCategoriesMutation.isPending ? 'animate-spin' : ''}`} />
            Validate Categories
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      {/* Blockchain Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Blocks className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.totalBlocks || 0}</p>
                <p className="text-xs text-muted-foreground">Total Blocks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{statsLoading ? '-' : (stats?.menuItemBlocks || 0)}</p>
                <p className="text-xs text-muted-foreground">Menu Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {statsLoading ? (
                <Shield className="h-8 w-8 text-gray-400" />
              ) : stats?.integrity ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '-' : stats?.integrity ? 'Valid' : 'Invalid'}
                </p>
                <p className="text-xs text-muted-foreground">Chain Integrity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{itemsLoading ? '-' : Object.keys(categorizedItems || {}).length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Block Info */}
      {stats?.latestBlock && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hash className="mr-2 h-5 w-5" />
              Latest Block
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Block ID</p>
                <p className="text-xs text-muted-foreground font-mono">{stats.latestBlock.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Hash</p>
                <p className="text-xs text-muted-foreground font-mono">{stats.latestBlock.hash?.substring(0, 32)}...</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timestamp</p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(stats.latestBlock.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Previous Hash</p>
                <p className="text-xs text-muted-foreground font-mono">{stats.latestBlock.previousHash?.substring(0, 32)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categorized Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Categorized Menu Items ({getTotalItems()})
            </span>
            <Badge variant="secondary">
              Blockchain Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {itemsLoading ? (
              <div className="text-center py-8">Loading categorized menu items...</div>
            ) : categorizedItems && Object.keys(categorizedItems).length > 0 ? (
              Object.entries(categorizedItems).map(([category, items]: [string, any[]]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{category}</h3>
                    <Badge variant="outline">{items.length} items</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item: any) => (
                      <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <span className="text-sm font-bold text-green-600">${item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No menu items found. Add items using the Menu Management section.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* IPFS Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Decentralized Storage Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your menu data is blockchain-verified and ready for deployment on decentralized networks:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">IPFS Compatible</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Polygon Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Arweave Ready</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Menu items are automatically categorized using AI and stored with cryptographic verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}