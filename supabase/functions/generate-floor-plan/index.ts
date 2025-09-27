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

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI floor plan generator. Generate a 2D floor plan based on user descriptions.

Rules:
1. Return a JSON object with room layouts, walls, doors, and windows
2. Use a coordinate system where (0,0) is top-left
3. All dimensions should be in grid units (1 unit = 10 feet)
4. Include room labels, wall thickness, and openings
5. Ensure proper room flow and accessibility
6. Optimize for space efficiency and natural lighting

Response format:
{
  "floorPlan": {
    "dimensions": { "width": number, "height": number },
    "rooms": [
      {
        "id": "room1",
        "name": "Living Room",
        "bounds": { "x": number, "y": number, "width": number, "height": number },
        "type": "living"
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
        "swing": "inward"
      }
    ],
    "windows": [
      {
        "id": "window1",
        "position": { "x": number, "y": number },
        "wallId": "wall1",
        "width": 1.2
      }
    ]
  },
  "description": "Generated floor plan description"
}`;

    const userPrompt = `Generate a 2D floor plan for:

Description: ${description}
${dimensions ? `Dimensions: ${dimensions}` : ''}
${requirements ? `Requirements: ${requirements}` : ''}

Create a practical and efficient layout that meets these specifications.`;

    console.log('Generating floor plan with OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response from OpenAI
    let floorPlanData;
    try {
      floorPlanData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});