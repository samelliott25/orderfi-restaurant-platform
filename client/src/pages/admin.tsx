import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi } from "@/lib/api";
import { MenuManagement } from "@/components/menu-management";
import { Bot, Store, Settings, Eye, Save, MessageSquare, Utensils, HelpCircle, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const RESTAURANT_ID = 1; // Default restaurant for demo

export default function AdminPage() {
  const { toast } = useToast();
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    cuisineType: "",
    tone: "",
    welcomeMessage: "",
  });

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  // Fetch restaurant data
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: [`/api/restaurants/${RESTAURANT_ID}`],
    onSuccess: (data: any) => {
      setRestaurantForm({
        name: data.name || "",
        description: data.description || "",
        cuisineType: data.cuisineType || "",
        tone: data.tone || "",
        welcomeMessage: data.welcomeMessage || "",
      });
    },
  });

  // Fetch FAQs
  const { data: faqs = [] } = useQuery({
    queryKey: [`/api/restaurants/${RESTAURANT_ID}/faqs`],
  });

  // Update restaurant mutation
  const updateRestaurantMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.updateRestaurant(RESTAURANT_ID, data),
    onSuccess: () => {
      toast({ title: "Restaurant settings saved successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}`] });
    },
    onError: () => {
      toast({ title: "Failed to save restaurant settings", variant: "destructive" });
    },
  });

  // Create FAQ mutation
  const createFaqMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.createFAQ(RESTAURANT_ID, data),
    onSuccess: () => {
      toast({ title: "FAQ added successfully!" });
      setNewFaq({ question: "", answer: "" });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}/faqs`] });
    },
    onError: () => {
      toast({ title: "Failed to add FAQ", variant: "destructive" });
    },
  });

  // Delete FAQ mutation
  const deleteFaqMutation = useMutation({
    mutationFn: (id: number) => restaurantApi.deleteFAQ(id),
    onSuccess: () => {
      toast({ title: "FAQ deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}/faqs`] });
    },
    onError: () => {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    },
  });

  const handleRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantMutation.mutate(restaurantForm);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      createFaqMutation.mutate(newFaq);
    }
  };

  if (restaurantLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="text-xl text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Loose Moose</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/customer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Restaurant Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Configure your AI-powered digital waiter</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 text-primary" />
                  Restaurant Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRestaurantSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        value={restaurantForm.name}
                        onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter restaurant name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cuisineType">Cuisine Type</Label>
                      <Select 
                        value={restaurantForm.cuisineType} 
                        onValueChange={(value) => setRestaurantForm(prev => ({ ...prev, cuisineType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="mediterranean">Mediterranean</SelectItem>
                          <SelectItem value="mexican">Mexican</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={restaurantForm.description}
                      onChange={(e) => setRestaurantForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your restaurant"
                    />
                  </div>
                  <Button type="submit" disabled={updateRestaurantMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Restaurant Info
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* AI Assistant Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 text-primary" />
                  AI Assistant Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tone">Assistant Tone</Label>
                    <Select 
                      value={restaurantForm.tone} 
                      onValueChange={(value) => setRestaurantForm(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly & Casual</SelectItem>
                        <SelectItem value="professional">Professional & Polite</SelectItem>
                        <SelectItem value="warm">Warm & Welcoming</SelectItem>
                        <SelectItem value="sophisticated">Sophisticated & Elegant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      rows={3}
                      value={restaurantForm.welcomeMessage}
                      onChange={(e) => setRestaurantForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                      placeholder="Enter the welcome message for customers"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Management */}
            <MenuManagement restaurantId={RESTAURANT_ID} />

            {/* FAQs Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <HelpCircle className="mr-2 text-primary" />
                    Frequently Asked Questions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFaq} className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Enter answer"
                      rows={2}
                    />
                  </div>
                  <Button type="submit" disabled={createFaqMutation.isPending}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                  </Button>
                </form>

                <div className="space-y-3">
                  {faqs.map((faq: any) => (
                    <div key={faq.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{faq.question}</p>
                          <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFaqMutation.mutate(faq.id)}
                          disabled={deleteFaqMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 text-primary" />
                  AI Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white text-sm" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm flex-1">
                      <p className="text-sm text-gray-800">
                        {restaurantForm.welcomeMessage || "Configure your welcome message above to see the preview."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/customer">
                      <Eye className="mr-2 h-4 w-4" />
                      Test AI Assistant
                    </Link>
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={handleRestaurantSubmit}
                    disabled={updateRestaurantMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
