import { useState } from "react";
import { Plus, Grid3X3, Calendar, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  rooms: number;
  type: "residential" | "commercial" | "office";
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Modern Family Home",
    description: "3-bedroom house with open-plan living",
    thumbnail: "/placeholder.svg",
    created_at: "2024-01-15",
    updated_at: "2024-01-20",
    rooms: 8,
    type: "residential"
  },
  {
    id: "2", 
    title: "Office Space Layout",
    description: "Open office with meeting rooms",
    thumbnail: "/placeholder.svg",
    created_at: "2024-01-10",
    updated_at: "2024-01-18",
    rooms: 12,
    type: "office"
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredProjects = mockProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    navigate("/editor");
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Grid3X3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Blueprint</h1>
                <p className="text-sm text-muted-foreground">by Team Blueprint™</p>
              </div>
            </div>
            <Button 
              onClick={handleCreateProject}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">All Projects</Badge>
            <Badge variant="outline">Recent</Badge>
            <Badge variant="outline">Shared</Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card 
            className="cursor-pointer border-dashed border-2 hover:border-primary transition-colors blueprint-shadow-lg"
            onClick={handleCreateProject}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Plus className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Start from Scratch</h3>
              <p className="text-muted-foreground text-sm">Create a new floor plan with AI assistance</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow blueprint-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-secondary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Upload Sketch</h3>
              <p className="text-muted-foreground text-sm">AI will convert your sketch to a floor plan</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow blueprint-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Grid3X3 className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Use Template</h3>
              <p className="text-muted-foreground text-sm">Start with pre-designed floor plan templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Grid3X3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground">Create your first floor plan project to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow blueprint-shadow"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                      <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {project.type}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {project.rooms} rooms
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;