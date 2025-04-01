
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Mock login - this would typically be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@ems.com') {
        // Admin override logic as specified
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin dashboard"
        });
        navigate('/dashboard');
      } else {
        // For the demo, allow any email/password to log in
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-ems-600 dark:text-ems-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="button-gradient w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <span>Don't have an account? </span>
              <a href="/subscribe" className="text-ems-600 dark:text-ems-400 hover:underline">
                Subscribe now
              </a>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
              Admin access: admin@ems.com
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
