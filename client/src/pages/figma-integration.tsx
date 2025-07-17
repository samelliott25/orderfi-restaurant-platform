import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import StandardLayout from '@/components/StandardLayout';
import { OrderFiCard, OrderFiButton, OrderFiHeading } from '@/components/ui/design-system';
import { apiRequest } from '@/lib/queryClient';
import { 
  Download, 
  FileText, 
  Palette, 
  Code, 
  Image, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Figma 
} from 'lucide-react';

interface FigmaFile {
  name: string;
  lastModified: string;
  version: string;
  thumbnailUrl?: string;
  components: Record<string, any>;
}

interface DesignSystem {
  components: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    properties: Record<string, any>;
    variants?: any[];
  }>;
  styles: Array<{
    key: string;
    name: string;
    styleType: string;
    description: string;
    props: Record<string, any>;
  }>;
  tokens: Array<{
    name: string;
    type: string;
    value: string;
    mode?: string;
    description?: string;
  }>;
}

export default function FigmaIntegration() {
  const [figmaToken, setFigmaToken] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [currentFile, setCurrentFile] = useState<FigmaFile | null>(null);
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);
  const [generatedCSS, setGeneratedCSS] = useState('');
  const [generatedInterfaces, setGeneratedInterfaces] = useState('');

  // Get file info
  const { data: fileInfo, isLoading: loadingFile } = useQuery({
    queryKey: ['figma-file', fileKey],
    queryFn: async () => {
      const response = await fetch(`/api/figma/files/${fileKey}`, {
        headers: {
          'X-Figma-Token': figmaToken
        }
      });
      if (!response.ok) throw new Error('Failed to fetch file info');
      return response.json();
    },
    enabled: !!(figmaToken && fileKey)
  });

  // Sync design system
  const syncMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/figma/sync', {
        method: 'POST',
        body: JSON.stringify({ fileKey, token: figmaToken })
      });
    },
    onSuccess: (data) => {
      setDesignSystem(data.designSystem);
      setGeneratedCSS(data.generatedCSS);
      setGeneratedInterfaces(data.generatedInterfaces);
    }
  });

  const handleSync = () => {
    if (!figmaToken || !fileKey) {
      alert('Please enter both Figma token and file key');
      return;
    }
    syncMutation.mutate();
  };

  const downloadCSS = () => {
    const blob = new Blob([generatedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orderfi-figma-tokens.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadInterfaces = () => {
    const blob = new Blob([generatedInterfaces], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orderfi-figma-interfaces.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StandardLayout title="Figma Integration" subtitle="Sync Design System from Figma">
      <div className="space-y-6">
        {/* Setup Card */}
        <OrderFiCard title="Figma Setup" subtitle="Connect your Figma design system">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="token">Figma Personal Access Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={figmaToken}
                  onChange={(e) => setFigmaToken(e.target.value)}
                  placeholder="figd_..."
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Generate at Figma → Settings → Personal Access Tokens
                </p>
              </div>
              <div>
                <Label htmlFor="fileKey">Figma File Key</Label>
                <Input
                  id="fileKey"
                  value={fileKey}
                  onChange={(e) => setFileKey(e.target.value)}
                  placeholder="Extract from Figma URL"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  From URL: figma.com/file/[FILE_KEY]/...
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <OrderFiButton 
                onClick={handleSync}
                disabled={syncMutation.isPending || !figmaToken || !fileKey}
                gradient
              >
                {syncMutation.isPending ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Figma className="h-4 w-4 mr-2" />
                    Sync Design System
                  </>
                )}
              </OrderFiButton>
              
              {fileInfo && (
                <Button variant="outline" asChild>
                  <a href={`https://figma.com/file/${fileKey}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Figma
                  </a>
                </Button>
              )}
            </div>

            {syncMutation.isError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {syncMutation.error?.message || 'Failed to sync with Figma'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </OrderFiCard>

        {/* File Info */}
        {fileInfo && (
          <OrderFiCard title="File Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <p className="text-sm text-muted-foreground">{fileInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Modified</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(fileInfo.lastModified).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Version</Label>
                <p className="text-sm text-muted-foreground">{fileInfo.version}</p>
              </div>
            </div>
          </OrderFiCard>
        )}

        {/* Design System Results */}
        {designSystem && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orderfi-orange">
                      {designSystem.components.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      UI components found
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Styles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orderfi-pink">
                      {designSystem.styles.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Color & text styles
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orderfi-orange">
                      {designSystem.tokens.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Design tokens
                    </p>
                  </CardContent>
                </Card>
              </div>

              {syncMutation.isSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully synced design system from Figma! 
                    Generated CSS tokens and TypeScript interfaces are ready for download.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designSystem.components.map((component) => (
                  <Card key={component.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{component.name}</CardTitle>
                      <Badge variant="outline">{component.type}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {component.description || 'No description'}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {component.variants ? 
                          `${component.variants.length} variants` : 
                          'Single component'
                        }
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="styles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designSystem.styles.map((style) => (
                  <Card key={style.key}>
                    <CardHeader>
                      <CardTitle className="text-sm">{style.name}</CardTitle>
                      <Badge variant="outline">{style.styleType}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {style.description || 'No description'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designSystem.tokens.map((token, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">{token.name}</CardTitle>
                      <Badge variant="outline">{token.type}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {token.value}
                        </div>
                        {token.mode && (
                          <Badge variant="secondary">Mode: {token.mode}</Badge>
                        )}
                        {token.description && (
                          <p className="text-sm text-muted-foreground">
                            {token.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CSS Design Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Auto-generated CSS variables from Figma tokens
                      </p>
                      <Button onClick={downloadCSS} variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download CSS
                      </Button>
                      <ScrollArea className="h-32 w-full rounded border p-2">
                        <pre className="text-xs">{generatedCSS}</pre>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">TypeScript Interfaces</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Component prop interfaces for type safety
                      </p>
                      <Button onClick={downloadInterfaces} variant="outline" className="w-full">
                        <Code className="h-4 w-4 mr-2" />
                        Download TypeScript
                      </Button>
                      <ScrollArea className="h-32 w-full rounded border p-2">
                        <pre className="text-xs">{generatedInterfaces}</pre>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </StandardLayout>
  );
}