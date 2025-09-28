import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, dimensions, requirements } = await req.json();
    
    if (!description) {
      return new Response(
        JSON.stringify({ error: "Description is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI floor plan generator. Generate a detailed 2D floor plan with specific entry spaces and dimensions.

CRITICAL REQUIREMENTS:
1. ALWAYS include an entry space (foyer, entryway, entrance hall, mudroom, or vestibule)
2. Show specific dimensions for each room in the name (e.g., "Living Room (16' x 12')")
3. Include connecting hallways and circulation paths
4. Consider traffic flow from entry to all spaces
5. Use realistic room proportions and sizes

Response format (JSON only, no markdown):
{
  "floorPlan": {
    "dimensions": { "width": number, "height": number },
    "totalSquareFootage": number,
    "rooms": [
      {
        "id": "entry1",
        "name": "Foyer (8' x 6')",
        "bounds": { "x": number, "y": number, "width": number, "height": number },
        "type": "entry",
        "squareFootage": number
      },
      {
        "id": "living1", 
        "name": "Living Room (16' x 14')",
        "bounds": { "x": number, "y": number, "width": number, "height": number },
        "type": "living",
        "squareFootage": number
      }
    ],
    "walls": [
      {
        "id": "wall1",
        "start": { "x": number, "y": number },
        "end": { "x": number, "y": number },
        "thickness": 0.5
      }
    ],
    "doors": [
      {
        "id": "door1",
        "position": { "x": number, "y": number },
        "wallId": "wall1",
        "width": 0.8,
        "swing": "inward",
        "type": "entry" | "interior"
      }
    ],
    "windows": [
      {
        "id": "window1",
        "position": { "x": number, "y": number },
        "wallId": "wall1", 
        "width": 1.2,
        "dimensions": "4' x 3'"
      }
    ],
    "hallways": [
      {
        "id": "hall1",
        "name": "Main Hallway (4' wide)",
        "bounds": { "x": number, "y": number, "width": number, "height": number },
        "type": "circulation"
      }
    ]
  },
  "description": "Detailed floor plan description with entry sequence"
}`;

    const userPrompt = `Generate a 2D floor plan for:

Description: ${description}
${dimensions ? `Dimensions: ${dimensions}` : ''}
${requirements ? `Requirements: ${requirements}` : ''}

Create a practical and efficient layout that meets these specifications.`;

    console.log('Generating floor plan with Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      // Return a graceful fallback instead of failing the request
      const fallbackPlan = {
        floorPlan: {
          dimensions: { width: 24, height: 18 },
          rooms: [
            { id: "living1", name: "Living Room", bounds: { x: 1, y: 1, width: 12, height: 8 }, type: "living" },
            { id: "kitchen1", name: "Kitchen", bounds: { x: 13, y: 1, width: 10, height: 6 }, type: "kitchen" },
            { id: "bed1", name: "Bedroom 1", bounds: { x: 1, y: 9, width: 8, height: 8 }, type: "bedroom" },
            { id: "bed2", name: "Bedroom 2", bounds: { x: 9, y: 9, width: 8, height: 8 }, type: "bedroom" },
            { id: "bath1", name: "Bathroom", bounds: { x: 17, y: 9, width: 6, height: 4 }, type: "bathroom" }
          ],
          walls: [],
          doors: [],
          windows: []
        },
        description: "Fallback floor plan generated (AI unavailable)"
      };
      return new Response(JSON.stringify(fallbackPlan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini response structure:', data);
      throw new Error('Invalid response from Gemini API');
    }
    
    const generatedContent = data.candidates[0].content.parts[0].text;
    
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response from Gemini
    let floorPlanData;
    try {
      floorPlanData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Fallback to a simple layout if parsing fails
      floorPlanData = {
        floorPlan: {
          dimensions: { width: 20, height: 15 },
          rooms: [
            {
              id: "room1",
              name: "Generated Room",
              bounds: { x: 2, y: 2, width: 16, height: 11 },
              type: "living"
            }
          ],
          walls: [],
          doors: [],
          windows: []
        },
        description: "Basic floor plan generated (parsing fallback)"
      };
    }

    return new Response(JSON.stringify(floorPlanData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in generate-floor-plan function:', error);
    // Graceful fallback on any unexpected error
    const fallbackPlan = {
      floorPlan: {
        dimensions: { width: 24, height: 18 },
        rooms: [
          { id: "living1", name: "Living Room", bounds: { x: 1, y: 1, width: 12, height: 8 }, type: "living" },
          { id: "kitchen1", name: "Kitchen", bounds: { x: 13, y: 1, width: 10, height: 6 }, type: "kitchen" },
          { id: "bed1", name: "Bedroom 1", bounds: { x: 1, y: 9, width: 8, height: 8 }, type: "bedroom" },
          { id: "bed2", name: "Bedroom 2", bounds: { x: 9, y: 9, width: 8, height: 8 }, type: "bedroom" },
          { id: "bath1", name: "Bathroom", bounds: { x: 17, y: 9, width: 6, height: 4 }, type: "bathroom" }
        ],
        walls: [],
        doors: [],
        windows: []
      },
      description: "Fallback floor plan generated (unexpected error)"
    };
    return new Response(JSON.stringify(fallbackPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});