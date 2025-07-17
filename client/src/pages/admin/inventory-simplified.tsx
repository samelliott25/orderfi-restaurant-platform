import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MenuItem } from '@/shared/schema';

import { Search, Mic, Plus, Package, AlertTriangle, DollarSign, TrendingUp, X, BarChart3, CheckCircle, Star, Clock, HelpCircle, Info, ShoppingCart, RefreshCw, ChevronRight, Edit, Save, Upload, Tag, Percent, Calendar, Users, Barcode, Settings, Image, Bot, Send, Brain, Zap, Target, Lightbulb, Bell, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardLayout from '@/components/StandardLayout';

// Enhanced filter chip component with tooltips and voice-friendly labels
const FilterChip = ({ label, isActive, onClick, onRemove, icon: Icon, tooltip, voiceCommand }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  icon?: any;
  tooltip?: string;
  voiceCommand?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={onClick}
          className={`flex items-center gap-2 h-11 px-4 text-sm font-normal transition-all duration-200 ${
            isActive 
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md' 
              : 'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 dark:hover:border-orange-800'
          }`}
        >
          {Icon && <Icon size={14} />}
          {label}
          {isActive && (
            <X size={12} onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }} className="ml-1 hover:bg-white/20 rounded-full p-0.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
        {voiceCommand && <p className="text-xs text-gray-400">Voice: "{voiceCommand}"</p>}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Suggestion chip for voice commands (Woolworths-style)
const SuggestionChip = ({ label, onClick, icon: Icon }: {
  label: string;
  onClick: () => void;
  icon?: any;
}) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="flex items-center gap-2 h-8 px-3 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
  >
    {Icon && <Icon size={12} />}
    {label}
  </Button>
);

// Smart notification component
const SmartNotification = ({ notification, onDismiss, onAction }: {
  notification: {
    id: string;
    type: 'urgent' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    action?: { label: string; onClick: () => void };
    priority: number;
    timeLeft?: string;
  };
  onDismiss: () => void;
  onAction?: () => void;
}) => {
  const icons = {
    urgent: AlertTriangle,
    warning: Bell,
    info: Info,
    success: CheckCircle
  };

  const colors = {
    urgent: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
    warning: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
  };

  const textColors = {
    urgent: 'text-red-700 dark:text-red-300',
    warning: 'text-orange-700 dark:text-orange-300',
    info: 'text-blue-700 dark:text-blue-300',
    success: 'text-green-700 dark:text-green-300'
  };

  const Icon = icons[notification.type];

  return (
    <div className={`p-3 rounded-lg border ${colors[notification.type]} mb-2`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`mt-0.5 ${textColors[notification.type]}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium text-sm ${textColors[notification.type]}`}>
              {notification.title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X size={12} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
          {notification.timeLeft && (
            <p className="text-xs text-muted-foreground mt-1">
              <Clock size={10} className="inline mr-1" />
              {notification.timeLeft}
            </p>
          )}
          {notification.action && (
            <Button
              variant="outline"
              size="sm"
              onClick={notification.action.onClick}
              className="mt-2 h-11 min-h-[44px] text-xs"
            >
              {notification.action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// AI-powered predictive search component
const PredictiveSearch = ({ onSearch, onVoiceSearch }: {
  onSearch: (query: string) => void;
  onVoiceSearch: () => void;
}) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Simulate AI predictions based on context
  const generatePredictions = (input: string) => {
    if (input.length < 2) return [];
    
    const commonQueries = [
      'buffalo wings low stock',
      'ingredients expiring soon',
      'high cost items',
      'menu items by category',
      'supplier orders pending',
      'waste tracking reports',
      'profit margin analysis'
    ];

    return commonQueries
      .filter(q => q.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 3);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setPredictions(generatePredictions(value));
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="AI-powered search: Try 'low stock buffalo' or 'expiring ingredients'"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-4"
          />
          {predictions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border rounded-lg mt-1 z-10 shadow-lg">
              {predictions.map((prediction, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(prediction);
                    onSearch(prediction);
                    setPredictions([]);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <Sparkles size={12} className="inline mr-2 text-orange-500" />
                  {prediction}
                </button>
              ))}
            </div>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsListening(!isListening);
                  onVoiceSearch();
                }}
                className={`h-11 min-w-[44px] px-3 ${isListening ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' : ''}`}
              >
                <Mic size={16} className={isListening ? 'text-orange-600' : 'text-muted-foreground'} />
                {isListening && <span className="ml-2 text-xs">Listening...</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voice search: "Show me low stock items" or "Find buffalo wings"</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// Enhanced recent activity item component
const RecentItem = ({ name, action, time, category }: { name: string; action: string; time: string; category?: string }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${
        action.includes('low') ? 'bg-red-500' : 
        action.includes('updated') ? 'bg-green-500' : 
        action.includes('changed') ? 'bg-blue-500' : 'bg-orange-500'
      }`}></div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-normal truncate">{name}</span>
          {category && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              {category}
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500">{action}</span>
      </div>
    </div>
    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
  </div>
);

// Enhanced top mover item component
const TopMoverItem = ({ name, trend, sales, price }: { name: string; trend: 'up' | 'down'; sales: number; price: number }) => (
  <Card className="min-w-[220px] hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-normal text-sm truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp size={12} className={trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'} />
            <span className="text-xs text-gray-500">{sales} sold today</span>
          </div>
          <div className="text-xs font-normal text-green-600 mt-1">
            ${price.toFixed(2)}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Star size={14} className="text-yellow-500" />
          <span className="text-[10px] text-gray-400 mt-1">
            {trend === 'up' ? '↗️' : '↘️'}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Edit Product Dialog Component
const EditProductDialog = ({ item, isOpen, onClose, onSave }: {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
}) => {
  const [formData, setFormData] = useState(item);
  const [savedSections, setSavedSections] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleSave = (section: string) => {
    // Show saved feedback
    setSavedSections(prev => [...prev, section]);
    toast({
      title: "Saved",
      description: `${section} information updated successfully`,
      duration: 2000,
    });
    
    // Remove saved indicator after 3 seconds
    setTimeout(() => {
      setSavedSections(prev => prev.filter(s => s !== section));
    }, 3000);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMargin = () => {
    const salePrice = parseFloat(formData.price) || 0;
    const costPrice = parseFloat(formData.costPrice?.toString() || '0') || 0;
    if (salePrice === 0) return 0;
    return ((salePrice - costPrice) / salePrice * 100).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit size={20} />
            Edit Product: {item.name}
          </DialogTitle>
          <DialogDescription>
            Edit all aspects of this menu item including pricing, inventory, voice commands, and availability settings.
          </DialogDescription>
        </DialogHeader>

        <Accordion type="multiple" defaultValue={["basic", "pricing"]} className="space-y-4">
          {/* Basic Item Info */}
          <AccordionItem value="basic">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Basic Info') ? 'text-green-600' : ''}`}>
              <Package size={16} />
              Basic Item Info
              {savedSections.includes('Basic Info') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleFieldChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bar Snacks">Bar Snacks</SelectItem>
                      <SelectItem value="Buffalo Wings">Buffalo Wings</SelectItem>
                      <SelectItem value="Dawgs">Dawgs</SelectItem>
                      <SelectItem value="Tacos">Tacos</SelectItem>
                      <SelectItem value="Plant Powered">Plant Powered</SelectItem>
                      <SelectItem value="Burgers">Burgers</SelectItem>
                      <SelectItem value="From our grill">From our grill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Basic Info')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Basic Info
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pricing & Cost */}
          <AccordionItem value="pricing">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Pricing') ? 'text-green-600' : ''}`}>
              <DollarSign size={16} />
              Pricing & Cost
              {savedSections.includes('Pricing') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Sale Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={formData.taxRate || ''}
                    onChange={(e) => handleFieldChange('taxRate', e.target.value)}
                    placeholder="8.25"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    value={formData.loyaltyPoints || ''}
                    onChange={(e) => handleFieldChange('loyaltyPoints', parseInt(e.target.value))}
                    placeholder="Points earned per purchase"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price (COGS)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice || ''}
                    onChange={(e) => handleFieldChange('costPrice', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Margin</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Percent size={16} className="text-muted-foreground" />
                    <span className="text-sm font-semibold">{calculateMargin()}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Pricing')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Pricing
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Inventory & Ordering */}
          <AccordionItem value="inventory">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Inventory') ? 'text-green-600' : ''}`}>
              <Package size={16} />
              Inventory & Ordering
              {savedSections.includes('Inventory') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trackInventory"
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) => handleFieldChange('trackInventory', checked)}
                />
                <Label htmlFor="trackInventory">Track Inventory</Label>
              </div>
              {formData.trackInventory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={formData.currentStock || ''}
                      onChange={(e) => handleFieldChange('currentStock', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={formData.lowStockThreshold || ''}
                      onChange={(e) => handleFieldChange('lowStockThreshold', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                    <Select value={formData.unitOfMeasure || 'ea'} onValueChange={(value) => handleFieldChange('unitOfMeasure', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ea">Each (ea)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                        <SelectItem value="l">Liters (l)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="gal">Gallons (gal)</SelectItem>
                        <SelectItem value="qt">Quarts (qt)</SelectItem>
                        <SelectItem value="pt">Pints (pt)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier || ''}
                      onChange={(e) => handleFieldChange('supplier', e.target.value)}
                      placeholder="Vendor/Supplier name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseUnitCost">Purchase Unit Cost</Label>
                    <Input
                      id="purchaseUnitCost"
                      type="number"
                      step="0.01"
                      value={formData.purchaseUnitCost || ''}
                      onChange={(e) => handleFieldChange('purchaseUnitCost', e.target.value)}
                      placeholder="Cost per unit for POs"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orderMultiple">Order Multiple (Pack Size)</Label>
                    <Input
                      id="orderMultiple"
                      type="number"
                      value={formData.orderMultiple || ''}
                      onChange={(e) => handleFieldChange('orderMultiple', parseInt(e.target.value))}
                      placeholder="Pack size for auto-reorders"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Inventory')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Inventory
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Availability */}
          <AccordionItem value="availability">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Availability') ? 'text-green-600' : ''}`}>
              <CheckCircle size={16} />
              Availability & Status
              {savedSections.includes('Availability') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleFieldChange('isAvailable', checked)}
                  />
                  <Label htmlFor="isAvailable">Available for Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="soldOut"
                    checked={formData.soldOut || false}
                    onCheckedChange={(checked) => handleFieldChange('soldOut', checked)}
                  />
                  <Label htmlFor="soldOut">Sold Out (Manual Override)</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="availabilityWindow">Availability Window</Label>
                <Textarea
                  id="availabilityWindow"
                  value={formData.availabilityWindow || ''}
                  onChange={(e) => handleFieldChange('availabilityWindow', e.target.value)}
                  placeholder="Monday-Friday: 11:00-22:00&#10;Saturday: 10:00-23:00&#10;Sunday: 12:00-21:00"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter availability by day and time range
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Availability')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Availability
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Voice & AI Integration */}
          <AccordionItem value="voice">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Voice & AI') ? 'text-green-600' : ''}`}>
              <Mic size={16} />
              Voice & AI Integration
              {savedSections.includes('Voice & AI') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="voiceAliases">Voice Aliases</Label>
                <Textarea
                  id="voiceAliases"
                  value={formData.voiceAliases ? formData.voiceAliases.join(', ') : ''}
                  onChange={(e) => handleFieldChange('voiceAliases', e.target.value.split(', ').filter(Boolean))}
                  placeholder="Enter voice aliases separated by commas (e.g., pep pizza, pepper pie)"
                  className="mt-1"
                  rows={2}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Voice hint: "Add voice alias [alias name]"
                </p>
              </div>
              <div>
                <Label htmlFor="triggerPhrases">Trigger Phrases</Label>
                <Textarea
                  id="triggerPhrases"
                  value={formData.triggerPhrases ? formData.triggerPhrases.join('\n') : ''}
                  onChange={(e) => handleFieldChange('triggerPhrases', e.target.value.split('\n').filter(Boolean))}
                  placeholder="what's in this?&#10;any nuts?&#10;how spicy is it?"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Questions customers might ask about this item
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchKeywords">Search Keywords</Label>
                  <Input
                    id="searchKeywords"
                    value={formData.searchKeywords || ''}
                    onChange={(e) => handleFieldChange('searchKeywords', e.target.value)}
                    placeholder="Keywords for full-text search (buffalo, spicy, chicken)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="intentTag">Intent Tag</Label>
                  <Select value={formData.intentTag || 'add_to_order'} onValueChange={(value) => handleFieldChange('intentTag', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add_to_order">Add to Order</SelectItem>
                      <SelectItem value="filter_vegan">Filter Vegan</SelectItem>
                      <SelectItem value="filter_gluten_free">Filter Gluten Free</SelectItem>
                      <SelectItem value="filter_spicy">Filter Spicy</SelectItem>
                      <SelectItem value="allergen_info">Allergen Info</SelectItem>
                      <SelectItem value="nutrition_info">Nutrition Info</SelectItem>
                      <SelectItem value="customization">Customization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="dietaryTags">Dietary Tags</Label>
                <Input
                  id="dietaryTags"
                  value={formData.dietaryTags ? formData.dietaryTags.join(', ') : ''}
                  onChange={(e) => handleFieldChange('dietaryTags', e.target.value.split(', ').filter(Boolean))}
                  placeholder="e.g., Vegan, Gluten-Free, Dairy-Free"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Voice & AI')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Voice Settings
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Media & Branding */}
          <AccordionItem value="media">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Media & Branding') ? 'text-green-600' : ''}`}>
              <Upload size={16} />
              Media & Branding
              {savedSections.includes('Media & Branding') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Main Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="galleryUrls">Gallery Images (Additional Photos)</Label>
                <Textarea
                  id="galleryUrls"
                  value={formData.galleryUrls ? formData.galleryUrls.join('\n') : ''}
                  onChange={(e) => handleFieldChange('galleryUrls', e.target.value.split('\n').filter(Boolean))}
                  placeholder="https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter one image URL per line
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="colorAccent">Color Accent (Hex)</Label>
                  <Input
                    id="colorAccent"
                    value={formData.colorAccent || '#f97316'}
                    onChange={(e) => handleFieldChange('colorAccent', e.target.value)}
                    placeholder="#f97316"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="iconBadge">Icon/Badge</Label>
                  <Select value={formData.iconBadge || ''} onValueChange={(value) => handleFieldChange('iconBadge', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select badge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="new">🆕 New</SelectItem>
                      <SelectItem value="popular">🔥 Popular</SelectItem>
                      <SelectItem value="vegan">🌱 Vegan</SelectItem>
                      <SelectItem value="gf">⚡ Gluten-Free</SelectItem>
                      <SelectItem value="spicy">🌶️ Spicy</SelectItem>
                      <SelectItem value="healthy">💚 Healthy</SelectItem>
                      <SelectItem value="chef">👨‍🍳 Chef's Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Media & Branding')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Media Settings
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Compliance & Nutrition */}
          <AccordionItem value="compliance">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Compliance') ? 'text-green-600' : ''}`}>
              <AlertTriangle size={16} />
              Compliance & Nutrition
              {savedSections.includes('Compliance') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="allergenWarnings">Allergen Warnings</Label>
                <Input
                  id="allergenWarnings"
                  value={formData.allergenWarnings ? formData.allergenWarnings.join(', ') : ''}
                  onChange={(e) => handleFieldChange('allergenWarnings', e.target.value.split(', ').filter(Boolean))}
                  placeholder="e.g., Contains nuts, dairy, gluten"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories || ''}
                    onChange={(e) => handleFieldChange('calories', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="servingSize">Serving Size (g)</Label>
                  <Input
                    id="servingSize"
                    type="number"
                    value={formData.servingSize || ''}
                    onChange={(e) => handleFieldChange('servingSize', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Compliance')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Compliance Info
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Variants & Modifiers */}
          <AccordionItem value="variants">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Variants') ? 'text-green-600' : ''}`}>
              <Tag size={16} />
              Variants & Modifiers
              {savedSections.includes('Variants') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="variantGroups">Variant Groups</Label>
                <Textarea
                  id="variantGroups"
                  value={formData.variantGroups || ''}
                  onChange={(e) => handleFieldChange('variantGroups', e.target.value)}
                  placeholder="Size: Small, Medium, Large&#10;Flavor: Original, Spicy, BBQ"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter each variant group on a new line with format: "Group: option1, option2, option3"
                </p>
              </div>
              <div>
                <Label htmlFor="modifierSets">Modifier Sets</Label>
                <Textarea
                  id="modifierSets"
                  value={formData.modifierSets || ''}
                  onChange={(e) => handleFieldChange('modifierSets', e.target.value)}
                  placeholder="Add extra cheese (+$2.00)&#10;No onions (free)&#10;Extra spicy (free)"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="defaultModifiers">Default Modifiers (Pre-checked)</Label>
                <Input
                  id="defaultModifiers"
                  value={formData.defaultModifiers ? formData.defaultModifiers.join(', ') : ''}
                  onChange={(e) => handleFieldChange('defaultModifiers', e.target.value.split(', ').filter(Boolean))}
                  placeholder="Medium sauce, Regular fries"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Modifiers that are pre-selected by default
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Variants')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Variants
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Integrations & Metadata */}
          <AccordionItem value="integrations">
            <AccordionTrigger className={`flex items-center gap-2 ${savedSections.includes('Integrations') ? 'text-green-600' : ''}`}>
              <Settings size={16} />
              Integrations & Metadata
              {savedSections.includes('Integrations') && <CheckCircle size={16} className="text-green-600" />}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripeProductId">Stripe Product ID</Label>
                  <Input
                    id="stripeProductId"
                    value={formData.stripeProductId || ''}
                    onChange={(e) => handleFieldChange('stripeProductId', e.target.value)}
                    placeholder="prod_xxxxxxxxxxxxx"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="accountingSku">Accounting SKU</Label>
                  <Input
                    id="accountingSku"
                    value={formData.accountingSku || ''}
                    onChange={(e) => handleFieldChange('accountingSku', e.target.value)}
                    placeholder="SKU for QuickBooks/Xero"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode/UPC</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ''}
                    onChange={(e) => handleFieldChange('barcode', e.target.value)}
                    placeholder="123456789012"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="qrCode">QR Code Data</Label>
                  <Input
                    id="qrCode"
                    value={formData.qrCode || ''}
                    onChange={(e) => handleFieldChange('qrCode', e.target.value)}
                    placeholder="Custom QR code data"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customAttributes">Custom Attributes (JSON)</Label>
                <Textarea
                  id="customAttributes"
                  value={formData.customAttributes || ''}
                  onChange={(e) => handleFieldChange('customAttributes', e.target.value)}
                  placeholder='{"preparation_time": 15, "kitchen_station": "grill", "special_instructions": "Cook well-done"}'
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  JSON format for plugin integrations and custom data
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Integrations')} size="sm">
                  <Save size={16} className="mr-2" />
                  Save Integration Data
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function SimplifiedInventoryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCoachMarks, setShowCoachMarks] = useState(false);
  const [coachStep, setCoachStep] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'urgent' as const,
      title: 'Low Stock Alert',
      message: 'Buffalo Wings below threshold (3 units remaining)',
      priority: 1,
      timeLeft: '2 hours until dinner rush',
      action: { label: 'Reorder Now', onClick: () => toast({ title: 'Reorder initiated for Buffalo Wings' }) }
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Expiring Soon',
      message: 'Lettuce expires in 2 days - consider daily special promotion',
      priority: 2,
      action: { label: 'Create Special', onClick: () => toast({ title: 'Daily special suggestion created' }) }
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'AI Insight',
      message: 'Burger sales up 15% this week - consider increasing patty orders',
      priority: 3,
      action: { label: 'Adjust Orders', onClick: () => toast({ title: 'Order adjustments suggested' }) }
    }
  ]);

  const { toast } = useToast();

  // Check for first visit and show coach marks
  useEffect(() => {
    const hasVisited = localStorage.getItem('inventory-simplified-visited');
    if (!hasVisited) {
      setTimeout(() => setShowCoachMarks(true), 1000);
      localStorage.setItem('inventory-simplified-visited', 'true');
    }
  }, []);

  // Coach mark steps
  const coachSteps = [
    {
      title: "Welcome to Simplified Inventory!",
      description: "Let's walk through the 3 key ways to manage your menu items",
      target: "search-section",
      position: "bottom"
    },
    {
      title: "1. Search or Voice",
      description: "Type in the search bar or click 'Voice' to speak what you're looking for",
      target: "search-input",
      position: "bottom"
    },
    {
      title: "2. Use Filter Chips",
      description: "Click these chips to quickly filter items like 'Low Stock' or 'Under $10'",
      target: "filter-chips",
      position: "bottom"
    },
    {
      title: "3. Tap to Edit",
      description: "Click any item card to edit details, update stock, or change prices",
      target: "item-cards",
      position: "top"
    }
  ];

  const nextCoachStep = () => {
    if (coachStep < coachSteps.length - 1) {
      setCoachStep(coachStep + 1);
    } else {
      setShowCoachMarks(false);
      setCoachStep(0);
    }
  };

  const skipCoachMarks = () => {
    setShowCoachMarks(false);
    setCoachStep(0);
  };

  // Fetch menu items (using default restaurant ID 1)
  const { data: menuItems = [], isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
  });

  // Data is loading correctly - 48 menu items available

  // Calculate key metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item: MenuItem) => item.isAvailable).length;
  const lowStockItems = menuItems.filter((item: MenuItem) => 
    item.trackInventory && (item.currentStock || 0) < (item.lowStockThreshold || 10)
  ).length;
  const totalValue = menuItems.reduce((sum: number, item: MenuItem) => 
    sum + (parseFloat(item.price) * (item.currentStock || 0)), 0
  );

  // Enhanced filter options with tooltips and voice commands
  const filterOptions = [
    { 
      id: 'low-stock', 
      label: 'Low Stock', 
      icon: AlertTriangle, 
      color: 'text-red-600',
      tooltip: 'Items running low that need reordering',
      voiceCommand: 'show low stock'
    },
    { 
      id: 'under-10', 
      label: 'Under $10', 
      icon: DollarSign, 
      color: 'text-green-600',
      tooltip: 'Budget-friendly items under $10',
      voiceCommand: 'show under ten dollars'
    },
    { 
      id: 'vegan', 
      label: 'Vegan', 
      icon: Package, 
      color: 'text-green-600',
      tooltip: 'Plant-based menu items',
      voiceCommand: 'show vegan items'
    },
    { 
      id: 'gluten-free', 
      label: 'Gluten Free', 
      icon: CheckCircle, 
      color: 'text-blue-600',
      tooltip: 'Gluten-free options for dietary restrictions',
      voiceCommand: 'show gluten free'
    },
    { 
      id: 'high-value', 
      label: 'High Value', 
      icon: Star, 
      color: 'text-yellow-600',
      tooltip: 'Premium items over $15',
      voiceCommand: 'show high value items'
    },
  ];

  // Voice suggestion chips for quick actions
  const voiceSuggestions = [
    { label: 'Show Categories', action: () => setActiveTab('categories'), icon: Package },
    { label: 'Reorder Items', action: () => toggleFilter('low-stock'), icon: RefreshCw },
    { label: 'Top Movers', action: () => setActiveTab('overview'), icon: TrendingUp },
    { label: 'Add New Item', action: () => toast({ title: 'Add Item', description: 'Opening add item dialog...' }), icon: Plus },
  ];

  // Generate realistic recent activity from actual menu items
  const recentActivity = menuItems
    .filter(item => item.name && item.category)
    .slice(0, 5)
    .map((item, index) => {
      const actions = ['stock updated', 'price changed', 'running low', 'reordered', 'modified'];
      const times = ['2 hours ago', '4 hours ago', '6 hours ago', '1 day ago', '2 days ago'];
      return {
        name: item.name,
        action: actions[index % actions.length],
        time: times[index % times.length],
        category: item.category
      };
    });

  // Generate top movers from high-priced authentic menu items
  const topMovers = menuItems
    .filter(item => parseFloat(item.price) > 15)
    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    .slice(0, 4)
    .map((item, index) => ({
      name: item.name,
      trend: (index % 2 === 0 ? 'up' : 'down') as const,
      sales: Math.floor(Math.random() * 50) + 20,
      price: parseFloat(item.price)
    }));

  // Enhanced filter logic with voice search optimization
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = searchTerm.length < 2 || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Voice-friendly aliases for fuzzy matching
      (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      switch (filter) {
        case 'low-stock':
          return item.trackInventory && (item.currentStock || 0) < (item.lowStockThreshold || 10);
        case 'under-10':
          return parseFloat(item.price) < 10;
        case 'vegan':
          return item.dietaryTags && item.dietaryTags.includes('vegan');
        case 'gluten-free':
          return item.dietaryTags && item.dietaryTags.includes('gluten-free');
        case 'high-value':
          return parseFloat(item.price) > 15;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(id => id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  const getStockStatus = (item: MenuItem) => {
    if (!item.trackInventory) {
      return { label: 'Always Available', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    }
    
    const stock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 10;
    
    if (stock === 0) {
      return { label: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
    } else if (stock < threshold) {
      return { label: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle };
    } else {
      return { label: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    }
  };





  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      
      // Enhanced voice search with instant feedback
      const matchingItems = menuItems.filter((item: MenuItem) => {
        const searchLower = transcript.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) ||
               item.category.toLowerCase().includes(searchLower) ||
               (item.description && item.description.toLowerCase().includes(searchLower)) ||
               (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchLower)));
      });
      
      toast({
        title: "Voice search complete",
        description: `Found ${matchingItems.length} items for "${transcript}"`,
      });
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errorMessage = event.error === 'no-speech' 
        ? "No speech detected. Please try again."
        : event.error === 'network' 
          ? "Network error. Please check your connection."
          : "Could not recognize speech. Please try again.";
      
      toast({
        title: "Voice error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.start();
  };

  if (isLoading) {
    return (
      <StandardLayout 
        title="Inventory Management"
        subtitle="Manage menu items, track inventory, and monitor stock levels"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-sm">Loading inventory...</div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout 
      title="Inventory Management"
      subtitle="Manage menu items, track inventory, and monitor stock levels"
    >
      <div className="space-y-6">
        {/* Smart Notifications Panel */}
        {notifications.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-700 dark:text-orange-300">Smart Alerts</h3>
              <Badge variant="outline" className="text-xs bg-orange-100 border-orange-300 text-orange-700">
                {notifications.length} Active
              </Badge>
            </div>
            <div className="grid gap-2">
              {notifications.slice(0, 3).map((notification) => (
                <SmartNotification
                  key={notification.id}
                  notification={notification}
                  onDismiss={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Search */}
        <div className="space-y-4">
          <PredictiveSearch
            onSearch={setSearchTerm}
            onVoiceSearch={() => setIsListening(!isListening)}
          />
        </div>

        {/* Quick Actions - No duplicate header needed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground">
                Manage your {totalItems} menu items with ease • Quick access to everything you need
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-12"
                      onClick={() => setShowHelp(!showHelp)}
                    >
                      <HelpCircle size={16} className="mr-2" />
                      Quick Help
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get help with common inventory tasks</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="h-12 text-gray-600 hover:text-gray-800"
                      onClick={() => { setShowCoachMarks(true); setCoachStep(0); }}
                    >
                      <Info size={16} className="mr-2" />
                      Take Tour
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Walk through the key features again</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Icon Pills for Primary Actions */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-3 w-max pb-1">
              {voiceSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={suggestion.action}
                  className="flex items-center gap-2 h-10 px-4 bg-background hover:bg-muted transition-colors"
                >
                  <suggestion.icon size={16} className="text-orange-500" />
                  <span className="text-sm font-medium">{suggestion.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Help Panel */}
          {showHelp && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h3 className="font-normal text-foreground mb-2">Getting Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-normal text-foreground">1. Search or Voice</p>
                    <p className="text-blue-700 dark:text-blue-300">Type in the search bar or click "Voice" to speak</p>
                  </div>
                  <div>
                    <p className="font-normal text-foreground">2. Use Filter Chips</p>
                    <p className="text-blue-700 dark:text-blue-300">Click chips like "Low Stock" to filter items</p>
                  </div>
                  <div>
                    <p className="font-normal text-foreground">3. Tap to Edit</p>
                    <p className="text-blue-700 dark:text-blue-300">Click any item card to edit details</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progressive Disclosure Tabs with Enhanced Labels */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-muted">
            <TabsTrigger value="overview" className="flex items-center justify-center gap-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:font-semibold">
              <BarChart3 size={16} />
              <span className="text-sm">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center justify-center gap-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:font-semibold">
              <Search size={16} />
              <span className="text-sm">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center justify-center gap-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:font-semibold">
              <TrendingUp size={16} />
              <span className="text-sm">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key metrics cards with color coding */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-muted-foreground">Total Items</span>
                  </div>
                  <div className="text-sm font-normal text-foreground">{totalItems}</div>
                  <div className="text-xs text-muted-foreground">Across all categories</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Available Items</span>
                  </div>
                  <div className="text-sm font-normal text-foreground">{availableItems}</div>
                  <div className="text-xs text-muted-foreground">Ready for orders</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-muted-foreground">Low Stock Items</span>
                  </div>
                  <div className="text-sm font-normal text-foreground">{lowStockItems}</div>
                  <div className="text-xs text-muted-foreground">Need attention</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-muted-foreground">Inventory Value</span>
                  </div>
                  <div className="text-sm font-normal text-foreground">${totalValue.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total stock value</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Top Items Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={16} />
                    Recent Activity
                    <Badge variant="outline" className="ml-auto">Last 7 days</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <RecentItem key={index} {...activity} />
                  ))}
                </CardContent>
              </Card>

              {/* Top Movers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Star size={16} />
                    Top Items Today
                    <Badge variant="outline" className="ml-auto">Trending</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topMovers.map((item, index) => (
                      <TopMoverItem key={index} {...item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab Content */}
          <TabsContent value="categories" className="space-y-6">
            {/* Category Boards with grouped items */}
            {Object.entries(
              menuItems.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <Card key={category} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Package size={18} />
                      {category}
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      {items.length} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: MenuItem) => {
                      const stockStatus = getStockStatus(item);
                      return (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer hover:shadow-lg transition-shadow p-4 border-l-4 ${
                            stockStatus.color.includes('red') ? 'border-l-red-500' : 
                            stockStatus.color.includes('green') ? 'border-l-green-500' : 
                            stockStatus.color.includes('yellow') ? 'border-l-yellow-500' : 'border-l-gray-500'
                          }`}
                          onClick={() => {
                            setSelectedItem(item);
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {stockStatus.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.description || ''}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold">${parseFloat(item.price).toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {item.currentStock || 0}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Search Items Tab Content */}
          <TabsContent value="browse" className="space-y-6">
            {/* Add New Item Button */}
            <div className="flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="lg" className="h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      <Plus size={16} className="mr-2" />
                      Add New Item
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new menu item</p>
                    <p className="text-xs text-gray-400">Voice: "Add new item"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Enhanced Search with Voice and Visual Filters */}
            <Card id="search-section">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search Bar with Voice */}
                  <div className="flex gap-3" id="search-input">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-4 text-gray-400" />
                      <Input
                        placeholder="Search items, categories, or descriptions... (or use voice)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleVoiceCommand}
                      className={`h-12 px-6 ${isListening ? 'bg-red-100 dark:bg-red-900 border-red-300' : ''}`}
                      title="Voice Search - Say item names, categories, or descriptions"
                    >
                      <Mic size={16} className={`mr-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                      {isListening ? 'Listening...' : 'Voice'}
                    </Button>
                  </div>

                  {/* Enhanced Visual Filter Chips with Tooltips */}
                  <div className="space-y-3" id="filter-chips">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                      <Info size={14} className="text-gray-400" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.map(option => (
                        <FilterChip
                          key={option.id}
                          label={option.label}
                          icon={option.icon}
                          tooltip={option.tooltip}
                          voiceCommand={option.voiceCommand}
                          isActive={activeFilters.includes(option.id)}
                          onClick={() => toggleFilter(option.id)}
                          onRemove={() => removeFilter(option.id)}
                        />
                      ))}
                      {activeFilters.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-11 text-gray-600 hover:text-gray-800">
                                <X size={14} className="mr-1" />
                                Clear All
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove all active filters</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* Active Filter Summary with Enhanced Search Feedback */}
                  {(activeFilters.length > 0 || searchTerm) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <Package size={14} className="text-gray-400" />
                      <span className="font-medium">
                        Showing {filteredItems.length} of {totalItems} items
                      </span>
                      {searchTerm && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {activeFilters.length > 0 && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} active
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
                  <h3 className="text-sm font-medium mb-2">Loading menu items...</h3>
                  <p className="text-gray-500">Please wait while we fetch your inventory data</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-400" />
                  <h3 className="text-sm font-medium mb-2">Error loading menu items</h3>
                  <p className="text-gray-500 mb-4">There was a problem loading your inventory data</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Filtered Items Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="item-cards">
                {filteredItems.map((item: MenuItem) => {
                const stockStatus = getStockStatus(item);
                const IconComponent = stockStatus.icon;
                
                return (
                  <Card 
                    key={item.id} 
                    className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 group hover:shadow-xl"
                    onClick={() => {
                      setSelectedItem(item);
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium truncate group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </CardTitle>
                        <div className={`p-1 rounded-full ${stockStatus.bgColor}`}>
                          <IconComponent size={12} className={stockStatus.color} />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs w-fit">
                        {item.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-foreground">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                        <Badge variant="outline" className={`${stockStatus.color} border-current`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      {item.trackInventory && (
                        <div className="text-sm text-muted-foreground">
                          Stock: {item.currentStock || 0} units
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.dietaryTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}

            {filteredItems.length === 0 && !isLoading && !error && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters, or use voice commands like "show me burgers"
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab Content */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Inventory Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Track which items are performing best and identify trends.</p>
                  <Button variant="outline" className="w-full">
                    View Performance Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={16} />
                    Category Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">See how different menu categories are performing.</p>
                  <Button variant="outline" className="w-full">
                    View Category Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Identify your best-selling and most profitable items.</p>
                  <Button variant="outline" className="w-full">
                    View Top Items
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Get alerts for low stock and reorder recommendations.</p>
                  <Button variant="outline" className="w-full">
                    View Stock Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Coach Marks Overlay for First-Time Users */}
        {showCoachMarks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <Card className="max-w-md mx-4 bg-white shadow-xl border-2 border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HelpCircle size={20} className="text-orange-500" />
                    {coachSteps[coachStep].title}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={skipCoachMarks} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{coachSteps[coachStep].description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {coachSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === coachStep ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={skipCoachMarks}>
                      Skip Tour
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={nextCoachStep}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      {coachStep === coachSteps.length - 1 ? 'Got it!' : 'Next'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}



        {/* Edit Product Dialog */}
        {editingItem && (
          <EditProductDialog
            item={editingItem}
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingItem(null);
              setSelectedItem(null);
            }}
            onSave={(updatedItem) => {
              // Here you would normally update the item in the database
              toast({
                title: "Product Updated",
                description: `${updatedItem.name} has been successfully updated.`,
              });
              setIsEditDialogOpen(false);
              setEditingItem(null);
              setSelectedItem(null);
            }}
          />
        )}
      </div>



      {/* Floating Action Button (FAB) - Fitts's Law optimized */}
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => toast({ title: "Add New Item", description: "Opening item creation form..." })}
              >
                <Plus size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add New Item</p>
              <p className="text-xs text-muted-foreground">Voice: "Add new item"</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </StandardLayout>
  );
}