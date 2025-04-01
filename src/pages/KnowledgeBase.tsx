
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft, Upload } from 'lucide-react';

const KnowledgeBase = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              Knowledge Base
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
            <CardTitle>Upload Resources</CardTitle>
            <CardDescription>
              Upload EMS protocols, guidelines, and samples for the AI to reference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <Upload className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Drag & Drop Files Here</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Or click to browse your files
              </p>
              <Button className="mt-4">
                Upload Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Resources</CardTitle>
            <CardDescription>
              Access your uploaded protocols and guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Book className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No resources uploaded yet</p>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                Upload EMS protocols and guidelines to enhance AI-generated narratives
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default KnowledgeBase;
