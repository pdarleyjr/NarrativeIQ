
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ViewNarrative = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              View Narrative
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/create-narrative')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Narratives
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Narrative #{id}</CardTitle>
            <CardDescription>
              Viewing a single narrative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">
              {/* This would load the narrative content from an API or state management */}
              This is where the narrative content would be displayed.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ViewNarrative;
