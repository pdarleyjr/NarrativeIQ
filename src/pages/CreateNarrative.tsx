
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NarrativeForm from '@/components/NarrativeForm';

const CreateNarrative = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              Create Narrative
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>New Narrative</CardTitle>
            <CardDescription>
              Enter patient information and incident details to generate a comprehensive EMS narrative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NarrativeForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateNarrative;
