
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, History, Book, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              EMS Narratives
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
                    <FileText className="h-4 w-4 mr-2" />
                    Narratives
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
                    <Book className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Dashboard
            </h2>

            <Tabs defaultValue="narratives" className="mb-8">
              <TabsList>
                <TabsTrigger value="narratives">My Narratives</TabsTrigger>
                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="narratives">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Generate New Narrative</CardTitle>
                      </div>
                      <CardDescription>
                        Create a new EMS narrative using our AI system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="button-gradient flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Narrative
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Recent Narratives</CardTitle>
                        <Button variant="link" size="sm">View All</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
                        <p>No narratives created yet</p>
                        <p className="text-sm mt-2">Your generated narratives will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-40" />
                        <p>No recent activity</p>
                        <p className="text-sm mt-2">Your recent actions will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-ems-600 dark:text-ems-400 font-bold">•</span>
                      <span>Use the AI generator for detailed, accurate narratives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ems-600 dark:text-ems-400 font-bold">•</span>
                      <span>Review all AI-generated content before submission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ems-600 dark:text-ems-400 font-bold">•</span>
                      <span>Access previous narratives from the history section</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Plan:</span>
                    <span className="text-ems-600 dark:text-ems-400 font-semibold">Premium</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Status:</span>
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Next billing:</span>
                    <span>June 15, 2025</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
