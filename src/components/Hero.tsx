
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      
      parallaxRef.current.style.backgroundPosition = `${x}px ${y}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={parallaxRef} 
      className="min-h-[90vh] flex items-center relative parallax-bg overflow-hidden"
    >
      {/* Animated circles in the background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-ems-400/30 dark:bg-ems-400/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 -right-20 w-60 h-60 bg-purple-400/20 dark:bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-ems-600/20 dark:bg-ems-600/10 rounded-full filter blur-2xl animate-float"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-ems-600/10 dark:bg-ems-500/20 rounded-full backdrop-blur-sm">
            <span className="text-ems-700 dark:text-ems-300 font-medium">AI-powered EMS reports</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white animate-fadeIn">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ems-600 to-purple-600 dark:from-ems-400 dark:to-purple-400">
              EMS Narrative Generator
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200 max-w-2xl mx-auto animate-fadeIn">
            Create compliant, structured EMS reports instantly with our AI-powered generator. Save time and improve accuracy.
          </p>
          
          <div className="mb-8 animate-fadeIn">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-ems-600 dark:text-ems-400">$10</span>/month, cancel anytime
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Unlimited narratives, 24/7 access
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn">
            <a href="/subscribe">
              <Button className="button-gradient text-lg px-8 py-6 rounded-xl shadow-lg shadow-ems-600/20 dark:shadow-ems-500/20">
                Subscribe Now
              </Button>
            </a>
            <a href="/login">
              <Button variant="outline" className="text-lg px-8 py-6 rounded-xl">
                Log In
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
