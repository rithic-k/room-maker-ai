import { ArrowRight, Grid3X3, Zap, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-floor-plan.jpg";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation", 
      description: "Transform rough sketches into professional floor plans with advanced AI"
    },
    {
      icon: Grid3X3,
      title: "Interactive Editor",
      description: "Drag-and-drop tools with precision grid snapping and real-time collaboration"
    },
    {
      icon: Users,
      title: "Team Collaboration", 
      description: "Share projects, get feedback, and work together seamlessly"
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Download as PNG/PDF or share with shareable links"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Grid3X3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Blueprint</h1>
                <p className="text-xs text-muted-foreground">by Team Blueprint™</p>
              </div>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-4">
                  AI-Powered Floor Planning
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                  Design Floor Plans with 
                  <span className="text-primary"> AI Precision</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Transform sketches into professional 2D floor plans instantly. 
                  Blueprint combines AI intelligence with intuitive design tools for 
                  architects, designers, and anyone planning spaces.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground blueprint-shadow-lg"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  View Examples
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span>Instant AI generation</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="blueprint-shadow-lg rounded-lg overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="Blueprint AI floor plan interface showing a modern 2D floor plan with teal and orange design elements"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border blueprint-shadow p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  <span className="font-medium">AI Generated in 3.2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need to design better
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools powered by AI to streamline your floor planning workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 blueprint-shadow hover:blueprint-shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to design your next space?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals using Blueprint to create better floor plans faster
            </p>
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-secondary hover:bg-secondary-hover text-secondary-foreground blueprint-shadow-lg"
            >
              Start Your First Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <span className="text-sm">© 2024 Team Blueprint™. AI-powered floor planning.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
