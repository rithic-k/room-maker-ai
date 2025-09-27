import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FloorPlanData {
  floorPlan: {
    dimensions: { width: number; height: number };
    rooms: Array<{
      id: string;
      name: string;
      bounds: { x: number; y: number; width: number; height: number };
      type: string;
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
    }>;
    windows: Array<{
      id: string;
      position: { x: number; y: number };
      wallId: string;
      width: number;
    }>;
  };
  description: string;
}

interface AIFloorPlanGeneratorProps {
  onFloorPlanGenerated: (floorPlan: FloorPlanData) => void;
}

const AIFloorPlanGenerator = ({ onFloorPlanGenerated }: AIFloorPlanGeneratorProps) => {
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description of your floor plan");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-floor-plan', {
        body: {
          description: description.trim(),
          dimensions: dimensions.trim() || undefined,
          requirements: requirements.trim() || undefined,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate floor plan');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Generated floor plan:', data);
      onFloorPlanGenerated(data);
      toast.success("Floor plan generated successfully!");
      
      // Clear the form
      setDescription("");
      setDimensions("");
      setRequirements("");
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate floor plan");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>AI Floor Plan Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your floor plan... e.g., 'A modern 3-bedroom house with open kitchen and living area, master suite with walk-in closet, and home office'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Separator />

        <div>
          <Label htmlFor="dimensions">Dimensions (Optional)</Label>
          <Input
            id="dimensions"
            placeholder="e.g., '40x30 feet' or '1200 sq ft'"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="requirements">Special Requirements (Optional)</Label>
          <Textarea
            id="requirements"
            placeholder="e.g., 'Wheelchair accessible', 'Lots of natural light', 'Open concept', 'Separate dining room'"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !description.trim()}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Floor Plan...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Floor Plan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIFloorPlanGenerator;