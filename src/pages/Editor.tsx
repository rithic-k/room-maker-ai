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
import AIFloorPlanGenerator from "@/components/AIFloorPlanGenerator";
import FloorPlanCanvas from "@/components/FloorPlanCanvas";

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
  const [floorPlan, setFloorPlan] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAIGenerate = () => {
    setShowAIGenerator(!showAIGenerator);
  };

  const handleAIOptimize = () => {
    // AI optimization functionality will be implemented with Supabase
    console.log("AI Optimize clicked");
  };

  const handleFloorPlanGenerated = (generatedFloorPlan: any) => {
    setFloorPlan(generatedFloorPlan);
    setShowAIGenerator(false);
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
        <aside className={cn(
          "border-r bg-card transition-all duration-300",
          showAIGenerator ? "w-96" : "w-64"
        )}>
          <div className="p-4 h-full flex flex-col space-y-6">
            {/* AI Tools */}
            {showAIGenerator ? (
              <AIFloorPlanGenerator onFloorPlanGenerated={handleFloorPlanGenerated} />
            ) : (
              <div>
                <h3 className="font-semibold mb-3 text-foreground">AI Assistant</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={handleAIGenerate}
                    className="w-full justify-start bg-secondary hover:bg-secondary/80 text-secondary-foreground"
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
            )}

            {!showAIGenerator && (
              <>
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
                      <Badge variant="secondary">
                        {floorPlan?.floorPlan?.walls?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <span className="text-sm">Rooms</span>
                      </div>
                      <Badge variant="outline">
                        {floorPlan?.floorPlan?.rooms?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <span className="text-sm">Openings</span>
                      </div>
                      <Badge variant="outline">
                        {(floorPlan?.floorPlan?.doors?.length || 0) + (floorPlan?.floorPlan?.windows?.length || 0)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
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
          <FloorPlanCanvas 
            floorPlan={floorPlan}
            gridVisible={gridVisible}
            zoom={zoom}
          />

          {/* Bottom Status Bar */}
          <div className="border-t bg-card px-4 py-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Tool: {tools.find(t => t.id === selectedTool)?.name}</span>
                <span>•</span>
                <span>Grid: {gridVisible ? "On" : "Off"}</span>
                <span>•</span>
                <span>Zoom: {zoom}%</span>
                {floorPlan && (
                  <>
                    <span>•</span>
                    <span>AI Generated</span>
                  </>
                )}
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