
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, MenuIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchFeedback } from '@/components/ui/ios-feedback';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img 
            src="/lovable-uploads/608365e0-5539-4f94-898a-8bbe69a08614.png" 
            alt="NarrativeIQ Logo" 
            className="h-12 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400">Features</a>
          <a href="#testimonials" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400">Testimonials</a>
          <a href="#faq" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400">FAQ</a>
          <a href="/login" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400">Login</a>
          
          <TouchFeedback onClick={toggleDarkMode} feedbackColor="#6366f1" className="ml-2">
            <Button variant="outline" size="icon">
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TouchFeedback>
          
          <a href="/subscribe">
            <TouchFeedback feedbackColor="#4f46e5">
              <Button className="button-gradient">Subscribe Now</Button>
            </TouchFeedback>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <TouchFeedback onClick={toggleDarkMode} feedbackColor="#6366f1">
            <Button variant="outline" size="icon">
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
          </TouchFeedback>
          
          <TouchFeedback onClick={toggleMobileMenu} feedbackColor="#4f46e5">
            <Button variant="ghost" size="icon">
              {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </TouchFeedback>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-4 px-6 flex flex-col space-y-4">
          <a href="#features" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400 py-2">Features</a>
          <a href="#testimonials" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400 py-2">Testimonials</a>
          <a href="#faq" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400 py-2">FAQ</a>
          <a href="/login" className="text-gray-700 dark:text-gray-200 hover:text-ems-600 dark:hover:text-ems-400 py-2">Login</a>
          <a href="/subscribe">
            <Button className="button-gradient w-full">Subscribe Now</Button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
