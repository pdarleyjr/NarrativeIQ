
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const features = [
    "Unlimited narrative generation",
    "AI-powered documentation",
    "Protocol compliance",
    "Cloud access on all devices",
    "Priority support"
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // This would typically initiate a Stripe checkout session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription initiated",
        description: "Redirecting to payment..."
      });
      
      // For demo purposes, redirect to success page after a delay
      setTimeout(() => {
        navigate('/success');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate subscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Subscribe to EMS Narrative Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Improve your documentation skills and save time on reports
          </p>
        </div>
        
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <span className="text-ems-600 dark:text-ems-400">$10</span> / month
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Unlimited access, cancel anytime
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="button-gradient w-full" 
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe Now"}
            </Button>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              By subscribing, you agree to our 
              <a href="#" className="text-ems-600 dark:text-ems-400 hover:underline mx-1">Terms</a> 
              and
              <a href="#" className="text-ems-600 dark:text-ems-400 hover:underline mx-1">Privacy Policy</a>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? 
          <a href="/login" className="text-ems-600 dark:text-ems-400 hover:underline ml-1">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
