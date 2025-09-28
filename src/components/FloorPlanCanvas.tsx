import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FloorPlanData {
  floorPlan: {
    dimensions: { width: number; height: number };
    totalSquareFootage?: number;
    rooms: Array<{
      id: string;
      name: string;
      bounds: { x: number; y: number; width: number; height: number };
      type: string;
      squareFootage?: number;
    }>;
    walls: Array<{
      id: string;
      start: { x: number; y: number };
      end: { x: number; y: number };
      thickness: number;
    }>;
    doors: Array<{
      id: string;
      position: { x: number; y: number };
      wallId: string;
      width: number;
      swing: string;
      type?: string;
    }>;
    windows: Array<{
      id: string;
      position: { x: number; y: number };
      wallId: string;
      width: number;
      dimensions?: string;
    }>;
    hallways?: Array<{
      id: string;
      name: string;
      bounds: { x: number; y: number; width: number; height: number };
      type: string;
    }>;
  };
  description: string;
}

interface FloorPlanCanvasProps {
  floorPlan: FloorPlanData | null;
  gridVisible: boolean;
  zoom: number;
}

const FloorPlanCanvas = ({ floorPlan, gridVisible, zoom }: FloorPlanCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if visible
    if (gridVisible) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw floor plan if available
    if (floorPlan) {
      drawFloorPlan(ctx, floorPlan.floorPlan);
    }
  }, [floorPlan, gridVisible, zoom]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawFloorPlan = (ctx: CanvasRenderingContext2D, plan: FloorPlanData['floorPlan']) => {
    const scale = 20; // 1 grid unit = 20 pixels

    // Draw hallways first (if they exist)
    if (plan.hallways) {
      plan.hallways.forEach((hallway) => {
        const x = hallway.bounds.x * scale;
        const y = hallway.bounds.y * scale;
        const width = hallway.bounds.width * scale;
        const height = hallway.bounds.height * scale;

        // Hallway background (lighter color)
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(x, y, width, height);

        // Hallway border
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([]);

        // Hallway label
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(hallway.name, x + width / 2, y + height / 2);
      });
    }

    // Draw rooms
    plan.rooms.forEach((room) => {
      const x = room.bounds.x * scale;
      const y = room.bounds.y * scale;
      const width = room.bounds.width * scale;
      const height = room.bounds.height * scale;

      // Room background
      ctx.fillStyle = getRoomColor(room.type);
      ctx.fillRect(x, y, width, height);

      // Room border
      ctx.strokeStyle = room.type === 'entry' ? '#dc2626' : '#64748b';
      ctx.lineWidth = room.type === 'entry' ? 3 : 2;
      ctx.strokeRect(x, y, width, height);

      // Room label with dimensions
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      const lines = room.name.split(' ');
      const roomNamePart = lines.slice(0, -1).join(' ');
      const dimensionPart = lines[lines.length - 1];
      
      // Draw room name
      ctx.fillText(roomNamePart, x + width / 2, y + height / 2 - 8);
      
      // Draw dimensions in smaller font
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(dimensionPart, x + width / 2, y + height / 2 + 8);
      
      // Show square footage if available
      if (room.squareFootage) {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${room.squareFootage} sq ft`, x + width / 2, y + height / 2 + 20);
      }
    });

    // Draw walls
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    plan.walls.forEach((wall) => {
      ctx.beginPath();
      ctx.moveTo(wall.start.x * scale, wall.start.y * scale);
      ctx.lineTo(wall.end.x * scale, wall.end.y * scale);
      ctx.stroke();
    });

    // Draw doors
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    plan.doors.forEach((door) => {
      const x = door.position.x * scale;
      const y = door.position.y * scale;
      const width = door.width * scale;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();
      
      // Door arc
      ctx.beginPath();
      ctx.arc(x, y, width, 0, Math.PI / 2);
      ctx.stroke();
    });

    // Draw windows
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 6;
    plan.windows.forEach((window) => {
      const x = window.position.x * scale;
      const y = window.position.y * scale;
      const width = window.width * scale;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();
    });
  };

  const getRoomColor = (type: string): string => {
    const colors: Record<string, string> = {
      living: '#fef3c7',
      bedroom: '#dbeafe',
      kitchen: '#fed7d7',
      bathroom: '#e0f2fe',
      office: '#f3e8ff',
      dining: '#fde68a',
      entry: '#fef2f2',
      circulation: '#f1f5f9',
      default: '#f8fafc'
    };
    return colors[type] || colors.default;
  };

  if (!floorPlan) {
    return (
      <div className="flex-1 relative overflow-hidden">
        <div 
          className={cn(
            "w-full h-full relative",
            gridVisible && "grid-pattern"
          )}
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="w-96 h-64 border-dashed border-2 border-muted-foreground/30">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="h-12 w-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <p className="text-lg font-medium mb-2">AI Floor Plan Canvas</p>
                  <p className="text-sm">
                    Use the AI generator to create your floor plan
                    <br />
                    or start drawing manually with the tools
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div 
        className="w-full h-full relative"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Floor plan info */}
        <div className="absolute top-4 right-4 space-y-2">
          <Badge variant="secondary" className="bg-background/90">
            {floorPlan.floorPlan.rooms.length} rooms
          </Badge>
          {floorPlan.floorPlan.totalSquareFootage && (
            <Badge variant="outline" className="bg-background/90">
              {floorPlan.floorPlan.totalSquareFootage} sq ft total
            </Badge>
          )}
          {floorPlan.description && (
            <Badge variant="outline" className="bg-background/90 max-w-[200px] text-xs">
              {floorPlan.description.length > 50 
                ? `${floorPlan.description.substring(0, 50)}...` 
                : floorPlan.description}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanCanvas;