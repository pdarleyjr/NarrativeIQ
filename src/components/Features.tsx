
import React from 'react';
import { 
  FileText, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Brain, 
  CloudLightning, 
  Database, 
  Lock,
  Flame,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchFeedback } from '@/components/ui/ios-feedback';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  return (
    <TouchFeedback feedbackColor="#6366f1">
      <div 
        className={cn(
          "glass-card p-6 flex flex-col items-start transition-all hover:translate-y-[-5px] duration-300",
          "animate-fadeIn opacity-0"
        )}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="p-3 bg-ems-100 dark:bg-ems-800/40 rounded-lg mb-4 text-ems-600 dark:text-ems-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </TouchFeedback>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Narratives",
      description: "Generate detailed, accurate EMS & Fire narratives using advanced AI technology.",
      icon: <Brain size={24} />
    },
    {
      title: "Time-Saving",
      description: "Reduce documentation time by up to 70% with automated narrative generation.",
      icon: <Clock size={24} />
    },
    {
      title: "HIPAA Compliant",
      description: "All data is processed securely in compliance with healthcare standards.",
      icon: <ShieldCheck size={24} />
    },
    {
      title: "Protocol Following",
      description: "Ensures all narratives follow required Fire & EMS protocols and guidelines.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "NFIRS Reports",
      description: "Generate compliant National Fire Incident Reporting System documentation.",
      icon: <Flame size={24} />
    },
    {
      title: "EMS PCR Narratives",
      description: "Create professional Patient Care Report narratives with consistent terminology.",
      icon: <FileCheck size={24} />
    },
    {
      title: "Cloud Access",
      description: "Access your narratives from any device, anywhere with cloud storage.",
      icon: <CloudLightning size={24} />
    },
    {
      title: "Narrative Templates",
      description: "Choose from various templates for different fire and medical scenarios.",
      icon: <FileText size={24} />
    },
    {
      title: "Data Integration",
      description: "Easily integrate with other Fire & EMS software systems and databases.",
      icon: <Database size={24} />
    },
    {
      title: "Secure Authentication",
      description: "Admin access and multi-factor authentication for enhanced security.",
      icon: <Lock size={24} />
    }
  ];

  return (
    <section id="features" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our Fire & EMS Narrative Generator uses advanced AI to create accurate, compliant reports in seconds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
