
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-ems-400">EZ Narratives - NFIRS Reports and EMS Narratives</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered documentation tool for NFIRS reports and EMS narratives. Save time and improve accuracy with our advanced narrative generation system.
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} EZ Narratives. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-ems-100">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-ems-400 transition-colors">Features</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-ems-400 transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-ems-400 transition-colors">FAQ</a></li>
              <li><a href="/subscribe" className="text-gray-400 hover:text-ems-400 transition-colors">Subscribe</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-ems-100">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/login" className="text-gray-400 hover:text-ems-400 transition-colors">Login</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-ems-400 transition-colors">Dashboard</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-ems-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-ems-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
