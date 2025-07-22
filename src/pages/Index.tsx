import { DrinkBuilder } from "@/components/DrinkBuilder";
import heroImage from "@/assets/hero-drink.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary-glow/10 to-secondary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Design Your
                  <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Perfect Drink
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Create custom hot and cold beverages with our interactive drink builder. 
                  Mix ingredients, discover flavors, and generate unique names for your creations.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-hot-primary rounded-full" />
                  Hot Drinks
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-cold-primary rounded-full" />
                  Cold Drinks
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  AI Names
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-2xl blur-xl" />
              <img 
                src={heroImage} 
                alt="Beautiful drink illustration" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <DrinkBuilder />
    </div>
  );
};

export default Index;
