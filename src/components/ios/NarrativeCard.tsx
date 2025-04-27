import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { triggerHapticFeedback } from '@/utils/platformUtils';

interface NarrativeCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string | Date;
  tags?: string[];
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const NarrativeCard: React.FC<NarrativeCardProps> = ({
  id,
  title,
  excerpt,
  date,
  tags = [],
  imageUrl,
  onClick,
  className
}) => {
  const formattedDate = typeof date === 'string' ? date : format(date, 'MMM d, yyyy');
  
  const handleClick = () => {
    triggerHapticFeedback();
    if (onClick) onClick();
  };

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl overflow-hidden",
        "border border-gray-100 dark:border-gray-700",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: Math.random() * 0.2
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* Card Header with Image */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-ems-50 to-ems-100 dark:from-ems-900 dark:to-ems-800">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-ems-500 dark:text-ems-400 opacity-50" />
            </div>
          )}
        </div>
        
        {/* iOS-style floating tag pill */}
        {tags && tags.length > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-ems-600 dark:text-ems-400 shadow-sm">
              {tags[0]}
            </div>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {excerpt}
        </p>
        
        {/* iOS-style metadata footer */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 space-x-3">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
            <span>{formattedDate}</span>
          </div>
          
          {tags && tags.length > 1 && (
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1 opacity-70" />
              <span>{tags.length} tags</span>
            </div>
          )}
        </div>
      </div>
      
      {/* iOS-style subtle inner shadow at the top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-black/5 to-transparent" />
    </motion.div>
  );
};