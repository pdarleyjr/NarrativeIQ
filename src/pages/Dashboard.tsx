
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Book, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/DashboardCard';
import SavedNarrativesList from '@/components/SavedNarrativesList';
import NarrativeSettingsPanel from '@/components/NarrativeSettingsPanel';

// Mock admin check - would use actual auth in a real app
const isAdmin = (email: string) => {
  return email === 'admin@ems.com';
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user - would use actual auth in a real app
  const user = {
    firstName: 'John',
    email: 'john@example.com'
  };
  
  const adminAccess = isAdmin(user.email);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              EMS Narratives Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {user.firstName} 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Access all your EMS narrative tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DashboardCard
            title="Create Narrative"
            description="Generate a new EMS narrative report"
            icon={FileText}
            onClick={() => navigate('/create-narrative')}
            buttonText="Create New"
          />
          
          <DashboardCard
            title="Knowledge Base"
            description="Upload and access EMS protocols and guidelines"
            icon={Book}
            onClick={() => navigate('/knowledge-base')}
            buttonText="Manage Resources"
          />
          
          {adminAccess && (
            <DashboardCard
              title="Admin Tools"
              description="Access advanced system settings and analytics"
              icon={Shield}
              onClick={() => alert('Admin functionality coming soon')}
              buttonText="Access Admin"
            />
          )}
          
          <DashboardCard
            title="Account Settings"
            description="Manage your profile and subscription"
            icon={Settings}
            onClick={() => navigate('/settings')}
            buttonText="Manage Account"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SavedNarrativesList />
          <NarrativeSettingsPanel />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
