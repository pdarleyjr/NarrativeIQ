
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface NarrativeItem {
  title: string;
  date: string;
}

const SavedNarrativesList = () => {
  // Mock data - would be fetched from API in a real app
  const savedNarratives: NarrativeItem[] = [
    { title: 'MVC – Chest Pain', date: 'Mar 28, 2025' },
    { title: 'Diabetic Emergency – Refusal', date: 'Mar 25, 2025' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Narratives</CardTitle>
        <CardDescription>
          Review and export your previously generated reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedNarratives.length > 0 ? (
          <ul className="space-y-3">
            {savedNarratives.map((item, i) => (
              <li key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>No narratives saved yet</p>
            <p className="text-sm mt-2">Generated narratives will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedNarrativesList;
