import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TouchFeedback, FeedbackCircle } from '@/components/ui/ios-feedback';
import { triggerHapticFeedback } from '@/utils/platformUtils';
import { NavigationBar } from '@/components/ios/NavigationBar';
import { DocumentTextIcon, PlusCircleIcon } from '@/components/icons';

const Hero: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ctaIndex, setCTAIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animateBlur, setAnimateBlur] = useState(false);

  const ctaOptions = [
    "Subscribe Now",
    "Generate NFIRS Reports",
    "Create EMS Narratives",
    "Save Documentation Time"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      
      parallaxRef.current.style.backgroundPosition = `${x}px ${y}px`;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Rotate CTA text every 5 seconds
    const interval = setInterval(() => {
      setCTAIndex((prev) => (prev + 1) % ctaOptions.length);
    }, 5000);
    
    // Start blur animation after a small delay
    setTimeout(() => {
      setAnimateBlur(true);
    }, 500);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleButtonClick = () => {
    triggerHapticFeedback();
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar
        title="EZ Narratives"
        largeTitle={true}
      />
      
      <div
        ref={parallaxRef}
        className="flex-1 flex items-center relative parallax-bg overflow-hidden"
      >
        {/* Animated circles in the background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-ems-400/30 dark:bg-ems-400/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 -right-20 w-60 h-60 bg-purple-400/20 dark:bg-purple-600/20 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-40 h-40 bg-ems-600/20 dark:bg-ems-600/10 rounded-full filter blur-2xl"
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div 
              className={cn(
                "inline-block mb-6 px-6 py-2 bg-ems-600/10 dark:bg-ems-500/20 rounded-full backdrop-blur-sm",
                "transform transition-all duration-700",
                animateBlur ? "scale-100 opacity-100" : "scale-95 opacity-0"
              )}
            >
              <span className="text-ems-900 dark:text-ems-300 font-medium">AI-enhanced Fire & EMS reports</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-ems-800 dark:text-ems-300 animate-fadeIn">
              <DocumentTextIcon className="h-12 w-12 text-indigo-600 inline-block mr-2" />
              EZ Narratives - NFIRS Reports and EMS Narratives
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-900 dark:text-gray-200 max-w-2xl mx-auto animate-fadeIn font-medium">
              Create compliant, structured Fire and EMS reports instantly with our AI-powered generator. From NFIRS reports to PCR narratives, save time and improve accuracy.
            </p>
            
            <div className="mb-8 animate-fadeIn">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                <span className="text-ems-800 dark:text-ems-400">$10</span>/month, cancel anytime
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
                Unlimited narratives, 24/7 access
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn">
              <a href="/subscribe" className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-ems-600/20 to-purple-600/20 rounded-xl filter blur-md animate-pulse-slow"></div>
                <TouchFeedback onClick={handleButtonClick} feedbackColor="#4f46e5">
                  <Button 
                    className="button-gradient text-lg px-8 py-6 rounded-xl shadow-lg shadow-ems-600/20 dark:shadow-ems-500/20 relative z-10"
                    aria-label="Subscribe to our service"
                    aria-describedby="subscription-desc"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    {ctaOptions[ctaIndex]}
                  </Button>
                </TouchFeedback>
                <span id="subscription-desc" className="sr-only">Start your subscription to the Fire and EMS Narrative Generator</span>
              </a>
              <a href="/login">
                <TouchFeedback onClick={handleButtonClick} feedbackColor="#6366f1">
                  <Button 
                    variant="outline" 
                    className="text-lg px-8 py-6 rounded-xl"
                    aria-label="Log in to your account"
                  >
                    Log In
                  </Button>
                </TouchFeedback>
              </a>
            </div>
            
            <div className="mt-8 text-sm text-gray-700 dark:text-gray-400 flex justify-center space-x-6 font-medium">
              <a href="#" className="underline hover:text-ems-500 dark:hover:text-ems-400">
                Privacy Policy
              </a>
              <a href="#" className="underline hover:text-ems-500 dark:hover:text-ems-400">
                Terms of Service
              </a>
              <a href="#" className="underline hover:text-ems-500 dark:hover:text-ems-400">
                Contact Support
              </a>
            </div>
          </div>
        </div>
        
        {/* Touch feedback circle */}
        <FeedbackCircle 
          visible={showFeedback} 
          x={mousePosition.x} 
          y={mousePosition.y} 
          color="#4f46e5" 
        />
      </div>
    </div>
  );
};

export default Hero;

function cn(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}
