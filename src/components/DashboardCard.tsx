
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  buttonText?: string;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  buttonText = "Open" 
}: DashboardCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <Icon className="h-6 w-6 text-ems-600 dark:text-ems-400" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={onClick} 
          className="w-full button-gradient mt-2"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
