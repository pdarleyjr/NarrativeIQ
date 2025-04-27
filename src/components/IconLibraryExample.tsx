import React from 'react';
import { 
  DocumentTextIcon, 
  PlusCircleIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  SearchIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';

interface IconProps {
  className?: string;
}

export const IconLibraryExample: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">EZ Narratives Icon Library</h2>
      <p className="mb-4">This component demonstrates how to use Heroicons in the application.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <IconCard 
          name="Document" 
          description="Use for narratives and reports"
          icon={<DocumentTextIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Plus Circle" 
          description="Use for adding new items"
          icon={<PlusCircleIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Home" 
          description="Use for navigation to home"
          icon={<HomeIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="User" 
          description="Use for user profiles"
          icon={<UserIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Settings" 
          description="Use for configuration"
          icon={<CogIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Chart" 
          description="Use for analytics"
          icon={<ChartBarIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Notification" 
          description="Use for alerts"
          icon={<BellIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Search" 
          description="Use for search functionality"
          icon={<SearchIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Menu" 
          description="Use for mobile menu"
          icon={<MenuIcon className="h-12 w-12 text-indigo-600" />} 
        />
        <IconCard 
          name="Close" 
          description="Use for closing dialogs"
          icon={<XIcon className="h-12 w-12 text-indigo-600" />} 
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usage Example:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`import { DocumentTextIcon } from '@heroicons/react/outline';

export function MyComponent() {
  return (
    <div>
      <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
      <span>Document</span>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
};

interface IconCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const IconCard: React.FC<IconCardProps> = ({ name, description, icon }) => {
  return (
    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
      {icon}
      <h3 className="mt-2 font-medium">{name}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </div>
  );
};

export default IconLibraryExample;