import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Store, Settings, Palette, Clock } from 'lucide-react';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  cuisine: z.string().optional(),
  contactEmail: z.string().email('Valid contact email required'),
  ownerId: z.string().min(1, 'Owner ID required'),
  
  // AI customization
  tone: z.string().optional(),
  welcomeMessage: z.string().optional(),
  aiPersonality: z.string().optional(),
  
  // Business settings
  timezone: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const cuisineTypes = [
  'American', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 
  'Indian', 'Thai', 'Chinese', 'French', 'Japanese', 'Other'
];

const toneOptions = [
  { value: 'friendly', label: 'Friendly & Casual' },
  { value: 'professional', label: 'Professional & Polished' },
  { value: 'enthusiastic', label: 'Enthusiastic & Energetic' },
  { value: 'warm', label: 'Warm & Welcoming' },
  { value: 'sophisticated', label: 'Sophisticated & Elegant' }
];

export default function RestaurantOnboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  
  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      tone: 'friendly',
      timezone: 'America/New_York',
      paymentMethods: ['credit_card', 'debit_card'],
      ownerId: `owner_${Date.now()}`, // In real app, this would come from auth
    }
  });

  const onboardMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await fetch('/api/restaurants/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to onboard restaurant');
      return response.json();
    },
    onSuccess: (restaurant) => {
      setLocation(`/dashboard/${restaurant.slug}`);
    },
  });

  const onSubmit = (data: OnboardingData) => {
    onboardMutation.mutate(data);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepTitles = [
    'Basic Information',
    'Business Details', 
    'AI Personality',
    'Review & Launch'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Mimi Waitress
          </h1>
          <p className="text-gray-600">
            Let's get your restaurant set up with AI-powered ordering
          </p>
        </div>

        <div className="mb-8">
          <Progress value={(step / 4) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {stepTitles.map((title, index) => (
              <span key={index} className={step > index ? 'text-blue-600 font-medium' : ''}>
                {title}
              </span>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === 1 && <Store className="h-5 w-5" />}
                  {step === 2 && <Settings className="h-5 w-5" />}
                  {step === 3 && <Palette className="h-5 w-5" />}
                  {step === 4 && <CheckCircle className="h-5 w-5" />}
                  {stepTitles[step - 1]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Restaurant Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of your restaurant..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cuisine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuisine Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cuisine type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cuisineTypes.map((cuisine) => (
                                <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                                  {cuisine}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@restaurant.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@restaurant.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Assistant Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toneOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="welcomeMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Welcome Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Leave blank for auto-generated message..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aiPersonality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Personality Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific personality traits or knowledge for your AI assistant..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        🎉 Almost Ready!
                      </h3>
                      <p className="text-blue-800 text-sm">
                        Your restaurant will be set up with AI ordering, voice capabilities, 
                        and blockchain token rewards. You can customize everything after launch.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Restaurant:</span>
                        <p className="text-gray-600">{form.watch('name')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cuisine:</span>
                        <p className="text-gray-600">{form.watch('cuisine') || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium">AI Tone:</span>
                        <p className="text-gray-600">
                          {toneOptions.find(t => t.value === form.watch('tone'))?.label}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>
                        <p className="text-gray-600">{form.watch('contactEmail')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  
                  {step < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={onboardMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {onboardMutation.isPending ? 'Setting up...' : 'Launch Restaurant'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        {onboardMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              Failed to onboard restaurant. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}