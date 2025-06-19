import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  MessageCircle, 
  ChefHat, 
  Utensils, 
  Coffee, 
  CheckCircle, 
  Settings,
  Timer,
  Bell,
  Edit3,
  Save,
  Plus,
  Trash2
} from "lucide-react";

interface ServiceStep {
  id: string;
  name: string;
  description: string;
  triggerType: 'immediate' | 'timer' | 'event';
  triggerValue?: number; // minutes for timer
  message: string;
  enabled: boolean;
  order: number;
}

interface ChatbotPersonality {
  tone: string;
  greetingStyle: string;
  upsellApproach: string;
  problemResolution: string;
  farewellStyle: string;
}

export default function AdminAITrainingPage() {
  const [serviceSteps, setServiceSteps] = useState<ServiceStep[]>([
    {
      id: '1',
      name: 'Welcome & Greeting',
      description: 'Initial customer interaction when they arrive',
      triggerType: 'immediate',
      message: "Welcome to our restaurant! I'm Mimi, your AI waitress. I'm here to help make your dining experience fantastic. Would you like to see our menu or hear about today's specials?",
      enabled: true,
      order: 1
    },
    {
      id: '2',
      name: 'Menu Guidance',
      description: 'Help customers navigate menu options',
      triggerType: 'event',
      message: "I'd be happy to help you choose! Based on what you're in the mood for, I can recommend some popular dishes. Are you looking for something light, hearty, or maybe something with a particular flavor profile?",
      enabled: true,
      order: 2
    },
    {
      id: '3',
      name: 'Order Confirmation',
      description: 'Confirm order details and timing',
      triggerType: 'event',
      message: "Perfect! Let me confirm your order: [ORDER_DETAILS]. This should be ready in about [PREP_TIME] minutes. Can I get you anything to drink while you wait?",
      enabled: true,
      order: 3
    },
    {
      id: '4',
      name: 'Order Delivered Check',
      description: 'Immediate check after food delivery',
      triggerType: 'immediate',
      message: "Your food has been delivered! Everything look good? Please let me know if you need anything else - extra napkins, condiments, or refills.",
      enabled: true,
      order: 4
    },
    {
      id: '5',
      name: 'Quality Check',
      description: 'Check food quality and satisfaction',
      triggerType: 'timer',
      triggerValue: 5,
      message: "Hi! I wanted to check back - how is everything tasting? Is your food cooked to your liking? Can I get you any drink refills or additional sides?",
      enabled: true,
      order: 5
    },
    {
      id: '6',
      name: 'Midway Check',
      description: 'Check if customers need anything else',
      triggerType: 'timer',
      triggerValue: 10,
      message: "Hope you're enjoying your meal! Is there anything else I can bring you? Maybe some dessert to think about, or would you like to hear about our coffee selection?",
      enabled: true,
      order: 6
    },
    {
      id: '7',
      name: 'Dessert & Final Items',
      description: 'Offer dessert and final service items',
      triggerType: 'timer',
      triggerValue: 20,
      message: "Room for dessert? We have some amazing options that pair perfectly with coffee. Or if you're ready, I can prepare your check whenever you'd like.",
      enabled: true,
      order: 7
    },
    {
      id: '8',
      name: 'Farewell & Feedback',
      description: 'Thank customers and request feedback',
      triggerType: 'event',
      message: "Thank you so much for dining with us! I hope you had a wonderful experience. We'd love to hear your feedback - it helps us serve you better next time. Have a great day!",
      enabled: true,
      order: 8
    }
  ]);

  const [personality, setPersonality] = useState<ChatbotPersonality>({
    tone: 'Friendly and professional with a warm, welcoming personality',
    greetingStyle: 'Enthusiastic but not overwhelming, makes customers feel valued',
    upsellApproach: 'Gentle suggestions based on customer preferences, not pushy',
    problemResolution: 'Apologetic, solution-focused, escalates to human staff when needed',
    farewellStyle: 'Grateful and inviting for future visits'
  });

  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editingPersonality, setEditingPersonality] = useState(false);

  const handleStepUpdate = (stepId: string, field: keyof ServiceStep, value: any) => {
    setServiceSteps(steps => 
      steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    );
  };

  const handlePersonalityUpdate = (field: keyof ChatbotPersonality, value: string) => {
    setPersonality(prev => ({ ...prev, [field]: value }));
  };

  const addNewStep = () => {
    const newStep: ServiceStep = {
      id: Date.now().toString(),
      name: 'New Service Step',
      description: 'Describe what happens in this step',
      triggerType: 'timer',
      triggerValue: 5,
      message: 'Enter your message here...',
      enabled: true,
      order: serviceSteps.length + 1
    };
    setServiceSteps([...serviceSteps, newStep]);
    setEditingStep(newStep.id);
  };

  const deleteStep = (stepId: string) => {
    setServiceSteps(steps => steps.filter(step => step.id !== stepId));
  };

  const getTriggerIcon = (type: ServiceStep['triggerType']) => {
    switch (type) {
      case 'immediate': return <Bell className="h-4 w-4" />;
      case 'timer': return <Timer className="h-4 w-4" />;
      case 'event': return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTriggerText = (step: ServiceStep) => {
    switch (step.triggerType) {
      case 'immediate': return 'Immediate';
      case 'timer': return `After ${step.triggerValue} minutes`;
      case 'event': return 'On customer action';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#8b795e' }}>
              AI Agent Training
            </h1>
            <p className="text-sm" style={{ color: '#8b795e' }}>
              Configure how your AI waitress interacts with customers throughout their dining experience
            </p>
          </div>
          <Button 
            onClick={() => alert('Settings saved!')}
            className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="service-flow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="service-flow">Service Flow</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="service-flow" className="space-y-6">
            <Card style={{ backgroundColor: '#ffe6b0', borderColor: '#8b795e' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#8b795e' }}>
                  <Utensils className="h-5 w-5" />
                  Table Service Sequence
                </CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Configure the step-by-step interaction flow from greeting to farewell
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: '#8b795e' }}>
                    Service Steps ({serviceSteps.filter(s => s.enabled).length} active)
                  </h3>
                  <Button 
                    onClick={addNewStep}
                    variant="outline" 
                    size="sm"
                    style={{ borderColor: '#8b795e', color: '#8b795e' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {serviceSteps.map((step, index) => (
                    <Card key={step.id} className="border-2" style={{ 
                      borderColor: step.enabled ? '#8b795e' : '#a0927d',
                      backgroundColor: '#ffe6b0'
                    }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white" 
                                 style={{ backgroundColor: step.enabled ? '#8b795e' : '#9ca3af' }}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {editingStep === step.id ? (
                                  <Input
                                    value={step.name}
                                    onChange={(e) => handleStepUpdate(step.id, 'name', e.target.value)}
                                    className="font-semibold"
                                  />
                                ) : (
                                  <h4 className="font-semibold" style={{ color: '#8b795e' }}>
                                    {step.name}
                                  </h4>
                                )}
                                <Badge variant={step.enabled ? "default" : "secondary"} className="flex items-center gap-1">
                                  {getTriggerIcon(step.triggerType)}
                                  {getTriggerText(step)}
                                </Badge>
                              </div>
                              {editingStep === step.id ? (
                                <Input
                                  value={step.description}
                                  onChange={(e) => handleStepUpdate(step.id, 'description', e.target.value)}
                                  className="text-sm mt-1"
                                />
                              ) : (
                                <p className="text-sm" style={{ color: '#8b795e' }}>
                                  {step.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={step.enabled}
                              onCheckedChange={(checked) => handleStepUpdate(step.id, 'enabled', checked)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStep(step.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {editingStep === step.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Trigger Type</Label>
                                <select 
                                  value={step.triggerType}
                                  onChange={(e) => handleStepUpdate(step.id, 'triggerType', e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                >
                                  <option value="immediate">Immediate</option>
                                  <option value="timer">Timer</option>
                                  <option value="event">Event</option>
                                </select>
                              </div>
                              {step.triggerType === 'timer' && (
                                <div>
                                  <Label>Minutes After Previous Step</Label>
                                  <Input
                                    type="number"
                                    value={step.triggerValue || 5}
                                    onChange={(e) => handleStepUpdate(step.id, 'triggerValue', parseInt(e.target.value))}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <Label>Message</Label>
                              <Textarea
                                value={step.message}
                                onChange={(e) => handleStepUpdate(step.id, 'message', e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            <Button 
                              onClick={() => setEditingStep(null)}
                              size="sm"
                              className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e5cf97' }}>
                              <p className="text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                                "{step.message}"
                              </p>
                            </div>
                            {step.triggerType === 'timer' && (
                              <div className="flex items-center gap-2 text-sm" style={{ color: '#8b795e' }}>
                                <Clock className="h-4 w-4" />
                                Triggers {step.triggerValue} minutes after previous step
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <Card style={{ backgroundColor: '#ffe6b0', borderColor: '#8b795e' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2" style={{ color: '#8b795e' }}>
                      <MessageCircle className="h-5 w-5" />
                      Chatbot Personality
                    </CardTitle>
                    <CardDescription style={{ color: '#8b795e' }}>
                      Define how your AI waitress communicates and interacts with customers
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPersonality(!editingPersonality)}
                    style={{ borderColor: '#8b795e', color: '#8b795e' }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {editingPersonality ? 'View' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <Label className="text-base font-semibold" style={{ color: '#8b795e' }}>
                      Overall Tone
                    </Label>
                    {editingPersonality ? (
                      <Textarea
                        value={personality.tone}
                        onChange={(e) => handlePersonalityUpdate('tone', e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                        {personality.tone}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold" style={{ color: '#8b795e' }}>
                      Greeting Style
                    </Label>
                    {editingPersonality ? (
                      <Textarea
                        value={personality.greetingStyle}
                        onChange={(e) => handlePersonalityUpdate('greetingStyle', e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                        {personality.greetingStyle}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold" style={{ color: '#8b795e' }}>
                      Upselling Approach
                    </Label>
                    {editingPersonality ? (
                      <Textarea
                        value={personality.upsellApproach}
                        onChange={(e) => handlePersonalityUpdate('upsellApproach', e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                        {personality.upsellApproach}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold" style={{ color: '#8b795e' }}>
                      Problem Resolution
                    </Label>
                    {editingPersonality ? (
                      <Textarea
                        value={personality.problemResolution}
                        onChange={(e) => handlePersonalityUpdate('problemResolution', e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                        {personality.problemResolution}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold" style={{ color: '#8b795e' }}>
                      Farewell Style
                    </Label>
                    {editingPersonality ? (
                      <Textarea
                        value={personality.farewellStyle}
                        onChange={(e) => handlePersonalityUpdate('farewellStyle', e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                        {personality.farewellStyle}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card style={{ backgroundColor: '#ffe6b0', borderColor: '#8b795e' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#8b795e' }}>
                  <Settings className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Fine-tune AI behavior and response patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto mb-4" style={{ color: '#8b795e' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#8b795e' }}>
                    Advanced Configuration
                  </h3>
                  <p className="text-sm" style={{ color: '#8b795e' }}>
                    Advanced AI training features coming soon. This will include response variability, 
                    contextual awareness settings, and integration with voice recognition systems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}