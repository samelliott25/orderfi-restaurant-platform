import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Sidebar } from '@/components/Sidebar';
import { Brain, CheckCircle, XCircle, Zap, MessageSquare, Camera, Target, Loader2 } from 'lucide-react';

export default function GrokTest() {
  const [featureDescription, setFeatureDescription] = useState('');
  const [competitorData, setCompetitorData] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  // Test Grok connection
  const { data: connectionStatus, isLoading: isTestingConnection } = useQuery({
    queryKey: ['/api/grok/test-connection'],
    queryFn: () => apiRequest('/api/grok/test-connection'),
  });

  // Feature taste analysis mutation
  const featureTasteMutation = useMutation({
    mutationFn: (data: { featureDescription: string }) => 
      apiRequest('/api/grok/feature-taste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grok/feature-taste'] });
    },
  });

  // Competitive analysis mutation
  const competitiveAnalysisMutation = useMutation({
    mutationFn: (data: { competitorData: string }) => 
      apiRequest('/api/grok/competitive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grok/competitive-analysis'] });
    },
  });

  // Restaurant strategy mutation
  const restaurantStrategyMutation = useMutation({
    mutationFn: (data: { businessContext: string }) => 
      apiRequest('/api/grok/restaurant-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grok/restaurant-strategy'] });
    },
  });

  // Menu analysis mutation
  const menuAnalysisMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiRequest('/api/grok/menu-analysis', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grok/menu-analysis'] });
    },
  });

  const handleFeatureTaste = () => {
    if (!featureDescription.trim()) return;
    featureTasteMutation.mutate({ featureDescription });
  };

  const handleCompetitiveAnalysis = () => {
    if (!competitorData.trim()) return;
    competitiveAnalysisMutation.mutate({ competitorData });
  };

  const handleRestaurantStrategy = () => {
    if (!businessContext.trim()) return;
    restaurantStrategyMutation.mutate({ businessContext });
  };

  const handleMenuAnalysis = () => {
    if (!selectedFile) return;
    menuAnalysisMutation.mutate(selectedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6 ml-0 md:ml-64">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Grok AI Integration
              </h1>
              <p className="text-sm text-gray-600">
                Test ADA's enhanced AI capabilities with Grok-4
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${connectionStatus?.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isTestingConnection ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : connectionStatus?.connected ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 mr-1" />
              )}
              {isTestingConnection ? 'Testing...' : connectionStatus?.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Taste Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-500" />
                <span>Feature Taste Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe a restaurant feature to analyze (e.g., 'AI-powered menu recommendations based on customer preferences')"
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleFeatureTaste}
                disabled={!featureDescription.trim() || featureTasteMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {featureTasteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Feature
                  </>
                )}
              </Button>
              
              {featureTasteMutation.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Rating: {featureTasteMutation.data.rating}/10</span>
                    <Badge variant="outline">
                      Confidence: {Math.round(featureTasteMutation.data.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{featureTasteMutation.data.insights}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span>Competitive Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter competitor data or market information to analyze"
                value={competitorData}
                onChange={(e) => setCompetitorData(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCompetitiveAnalysis}
                disabled={!competitorData.trim() || competitiveAnalysisMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {competitiveAnalysisMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Competitors
                  </>
                )}
              </Button>
              
              {competitiveAnalysisMutation.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Strategic Insights:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{competitiveAnalysisMutation.data.analysis}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurant Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-500" />
                <span>Restaurant Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your restaurant's business context, challenges, or goals"
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleRestaurantStrategy}
                disabled={!businessContext.trim() || restaurantStrategyMutation.isPending}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                {restaurantStrategyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Generate Strategy
                  </>
                )}
              </Button>
              
              {restaurantStrategyMutation.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Strategic Recommendations:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{restaurantStrategyMutation.data.strategy}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menu Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-purple-500" />
                <span>Menu Image Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="menu-upload"
                />
                <label htmlFor="menu-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Upload menu image for analysis'}
                  </p>
                </label>
              </div>
              
              <Button 
                onClick={handleMenuAnalysis}
                disabled={!selectedFile || menuAnalysisMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {menuAnalysisMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Analyze Menu
                  </>
                )}
              </Button>
              
              {menuAnalysisMutation.data && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Menu Analysis:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{menuAnalysisMutation.data.analysis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}