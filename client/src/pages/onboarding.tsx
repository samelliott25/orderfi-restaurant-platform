import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Camera, 
  Wand2, 
  QrCode, 
  Play, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  CreditCard,
  Eye,
  ChefHat,
  FileText,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  modifiers?: string[];
}

interface OnboardingData {
  venueName: string;
  menuText: string;
  menuImage?: File;
  parsedItems: ParsedMenuItem[];
  categories: string[];
  isTestMode: boolean;
  previewQR?: string;
}

export default function OnboardingPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [data, setData] = useState<OnboardingData>({
    venueName: "",
    menuText: "",
    parsedItems: [],
    categories: [],
    isTestMode: true
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto-save draft as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.venueName) {
        localStorage.setItem('orderfi_onboarding_draft', JSON.stringify(data));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [data]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('orderfi_onboarding_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setData(parsed);
      } catch (e) {
        console.log('No valid draft found');
      }
    }
  }, []);

  // Menu parsing mutation
  const parseMenuMutation = useMutation({
    mutationFn: async (input: { text?: string; image?: File }) => {
      const formData = new FormData();
      if (input.text) formData.append('text', input.text);
      if (input.image) formData.append('image', input.image);
      
      return apiRequest('/api/parse-menu', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (result) => {
      setData(prev => ({
        ...prev,
        parsedItems: result.items || [],
        categories: result.categories || []
      }));
      setStep(3);
      setProgress(60);
      toast({
        title: "Menu parsed successfully!",
        description: `Found ${result.items?.length || 0} items in ${result.categories?.length || 0} categories`
      });
    },
    onError: (error) => {
      toast({
        title: "Menu parsing failed",
        description: "Please try again or enter items manually",
        variant: "destructive"
      });
    }
  });

  // Restaurant creation mutation
  const createRestaurantMutation = useMutation({
    mutationFn: async (restaurantData: any) => {
      return apiRequest('/api/restaurants', {
        method: 'POST',
        body: JSON.stringify(restaurantData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Restaurant created!",
        description: "Your OrderFi setup is complete"
      });
      setLocation('/dashboard');
    }
  });

  const handleVenueNameSubmit = () => {
    if (!data.venueName.trim()) {
      toast({
        title: "Please enter your venue name",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
    setProgress(40);
  };

  const handleTextParse = () => {
    if (!data.menuText.trim()) {
      toast({
        title: "Please enter your menu text",
        variant: "destructive"
      });
      return;
    }
    parseMenuMutation.mutate({ text: data.menuText });
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setData(prev => ({ ...prev, menuImage: file }));
    parseMenuMutation.mutate({ image: file });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleImageUpload(files[0]);
    }
  };

  const generatePreviewQR = () => {
    const qrData = `${window.location.origin}/preview/${data.venueName.toLowerCase().replace(/\s+/g, '-')}`;
    setData(prev => ({ ...prev, previewQR: qrData }));
    setStep(4);
    setProgress(80);
  };

  const finishOnboarding = () => {
    const restaurantData = {
      name: data.venueName,
      menuItems: data.parsedItems,
      categories: data.categories,
      isTestMode: data.isTestMode
    };
    
    createRestaurantMutation.mutate(restaurantData);
    setProgress(100);
  };

  const skipToPlayMode = () => {
    // Create demo restaurant for testing
    const demoData = {
      name: "Demo Restaurant",
      menuItems: [
        { name: "Classic Burger", price: 18.50, category: "Mains", description: "Beef patty with lettuce, tomato, cheese" },
        { name: "Margherita Pizza", price: 22.00, category: "Mains", description: "Fresh tomato, mozzarella, basil" },
        { name: "Caesar Salad", price: 16.00, category: "Salads", description: "Crisp romaine, parmesan, croutons" }
      ],
      categories: ["Mains", "Salads"],
      isTestMode: true
    };
    
    createRestaurantMutation.mutate(demoData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal mb-2 rock-salt-font">Welcome to OrderFi</h1>
          <p className="text-lg text-muted-foreground">Set up your restaurant in under 10 minutes</p>
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {step} of 4</p>
          </div>
        </div>

        {/* Skip to Demo Button */}
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            onClick={skipToPlayMode}
            className="rock-salt-font"
          >
            <Play className="w-4 h-4 mr-2" />
            Skip to Demo Mode
          </Button>
        </div>

        {/* Step 1: Venue Name */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="rock-salt-font flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                What's your venue called?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="venue-name">Restaurant Name</Label>
                <Input
                  id="venue-name"
                  value={data.venueName}
                  onChange={(e) => setData(prev => ({ ...prev, venueName: e.target.value }))}
                  placeholder="e.g., Tony's Italian Kitchen"
                  className="text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleVenueNameSubmit()}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleVenueNameSubmit}
                  className="flex-1 rock-salt-font"
                  disabled={!data.venueName.trim()}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Menu Upload */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="rock-salt-font flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Upload your menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg mb-2">Drop your menu image here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={parseMenuMutation.isPending}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="menu-text">Paste your menu text</Label>
                      <Textarea
                        id="menu-text"
                        value={data.menuText}
                        onChange={(e) => setData(prev => ({ ...prev, menuText: e.target.value }))}
                        placeholder="Paste your menu here... e.g.,&#10;&#10;MAINS&#10;Classic Burger - $18.50&#10;Beef patty with lettuce, tomato, cheese&#10;&#10;Margherita Pizza - $22.00&#10;Fresh tomato, mozzarella, basil"
                        className="min-h-[200px]"
                      />
                    </div>
                    <Button 
                      onClick={handleTextParse}
                      disabled={!data.menuText.trim() || parseMenuMutation.isPending}
                      className="rock-salt-font"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {parseMenuMutation.isPending ? 'Parsing...' : 'Parse Menu'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Menu Review */}
        {step === 3 && (
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="rock-salt-font flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Review your menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {data.categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 rock-salt-font">{category}</h3>
                      <div className="grid gap-3">
                        {data.parsedItems
                          .filter(item => item.category === category)
                          .map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="rock-salt-font"
                  >
                    Edit Menu
                  </Button>
                  <Button 
                    onClick={generatePreviewQR}
                    className="flex-1 rock-salt-font"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: QR Preview */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="rock-salt-font flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Scan to preview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-white p-6 rounded-lg inline-block">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <p className="text-lg mb-2">Scan this QR code to see how your menu looks to customers</p>
                  <p className="text-sm text-muted-foreground">
                    Open your phone camera and point it at the QR code
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setStep(3)}
                    variant="outline"
                    className="rock-salt-font"
                  >
                    Back to Menu
                  </Button>
                  <Button 
                    onClick={finishOnboarding}
                    className="flex-1 rock-salt-font"
                    disabled={createRestaurantMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {createRestaurantMutation.isPending ? 'Creating...' : 'Start Taking Orders'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}