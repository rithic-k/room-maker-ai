import { useState } from "react";
import { 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Grid3X3, 
  Square, 
  Circle, 
  Minus, 
  Plus,
  Move,
  Type,
  Layers,
  Zap,
  Settings,
  Share2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: "draw" | "edit" | "ai";
}

const tools: Tool[] = [
  { id: "move", name: "Move", icon: Move, category: "edit" },
  { id: "wall", name: "Wall", icon: Minus, category: "draw" },
  { id: "door", name: "Door", icon: Square, category: "draw" },
  { id: "window", name: "Window", icon: Circle, category: "draw" },
  { id: "room", name: "Room", icon: Square, category: "draw" },
  { id: "text", name: "Text", icon: Type, category: "edit" },
];

const Editor = () => {
  const [selectedTool, setSelectedTool] = useState("move");
  const [gridVisible, setGridVisible] = useState(true);
  const [zoom, setZoom] = useState(100);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAIGenerate = () => {
    // AI generation functionality will be implemented with Supabase
    console.log("AI Generate clicked");
  };

  const handleAIOptimize = () => {
    // AI optimization functionality will be implemented with Supabase
    console.log("AI Optimize clicked");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Toolbar */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                {projectId ? `Project ${projectId}` : "New Project"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Tools */}
        <aside className="w-64 border-r bg-card p-4">
          <div className="space-y-6">
            {/* AI Tools */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">AI Assistant</h3>
              <div className="space-y-2">
                <Button 
                  onClick={handleAIGenerate}
                  className="w-full justify-start bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Layout
                </Button>
                <Button 
                  onClick={handleAIOptimize}
                  className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Optimize Layout
                </Button>
              </div>
            </div>

            <Separator />

            {/* Drawing Tools */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-12 flex-col space-y-1",
                        selectedTool === tool.id && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Layers */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Layers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span className="text-sm">Walls</span>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span className="text-sm">Furniture</span>
                  </div>
                  <Badge variant="outline">0</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span className="text-sm">Labels</span>
                  </div>
                  <Badge variant="outline">1</Badge>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="border-b bg-card px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGridVisible(!gridVisible)}
                  className={gridVisible ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[60px] text-center text-sm">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(400, zoom + 25))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Badge variant="outline">Ready to draw</Badge>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <div 
              className={cn(
                "w-full h-full relative",
                gridVisible && "grid-pattern"
              )}
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {/* Canvas content area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="w-96 h-64 border-dashed border-2 border-muted-foreground/30">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Grid3X3 className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Start Drawing</p>
                      <p className="text-sm">
                        Use the tools on the left to create your floor plan
                        <br />
                        or click "Generate Layout" for AI assistance
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="border-t bg-card px-4 py-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Tool: {tools.find(t => t.id === selectedTool)?.name}</span>
                <span>•</span>
                <span>Grid: {gridVisible ? "On" : "Off"}</span>
                <span>•</span>
                <span>Zoom: {zoom}%</span>
              </div>
              <div className="text-xs">
                by Team Blueprint™
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;