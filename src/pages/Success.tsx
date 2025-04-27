
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="glass-card border-0 shadow-xl w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Subscription Successful!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for subscribing to the EMS Narrative Generator. You now have full access to all features.
        </p>
        
        <div className="space-y-4">
          <Button 
            className="button-gradient w-full" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          You'll be automatically redirected to the dashboard in a few seconds.
        </p>
      </Card>
    </div>
  );
};

export default Success;
