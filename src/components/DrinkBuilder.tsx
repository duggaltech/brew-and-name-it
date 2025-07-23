import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Snowflake, Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  category: "base" | "flavor" | "topping" | "sweetener";
  color: string;
  defaultAmount: string;
  unit: string;
}

interface DrinkIngredient extends Ingredient {
  amount: string;
}

interface Drink {
  type: "hot" | "cold";
  ingredients: DrinkIngredient[];
  name?: string;
}

const hotIngredients: Ingredient[] = [
  { id: "espresso", name: "Espresso", category: "base", color: "#8B4513", defaultAmount: "2", unit: "shots" },
  { id: "coffee", name: "Coffee", category: "base", color: "#6F4E37", defaultAmount: "8", unit: "oz" },
  { id: "milk", name: "Steamed Milk", category: "base", color: "#F5F5DC", defaultAmount: "4", unit: "oz" },
  { id: "chocolate", name: "Hot Chocolate", category: "base", color: "#7B3F00", defaultAmount: "6", unit: "oz" },
  { id: "vanilla", name: "Vanilla Syrup", category: "flavor", color: "#F3E5AB", defaultAmount: "1", unit: "pump" },
  { id: "caramel", name: "Caramel Syrup", category: "flavor", color: "#D2691E", defaultAmount: "1", unit: "pump" },
  { id: "hazelnut", name: "Hazelnut", category: "flavor", color: "#D2B48C", defaultAmount: "1", unit: "pump" },
  { id: "cinnamon", name: "Cinnamon", category: "topping", color: "#D2691E", defaultAmount: "1", unit: "pinch" },
  { id: "foam", name: "Milk Foam", category: "topping", color: "#FFFDD0", defaultAmount: "2", unit: "oz" },
  { id: "whipped", name: "Whipped Cream", category: "topping", color: "#FFFACD", defaultAmount: "1", unit: "dollop" },
];

const coldIngredients: Ingredient[] = [
  { id: "cold-brew", name: "Cold Brew", category: "base", color: "#4A4A4A", defaultAmount: "8", unit: "oz" },
  { id: "iced-coffee", name: "Iced Coffee", category: "base", color: "#8B4513", defaultAmount: "6", unit: "oz" },
  { id: "cold-milk", name: "Cold Milk", category: "base", color: "#F0F8FF", defaultAmount: "4", unit: "oz" },
  { id: "ice", name: "Ice Cubes", category: "base", color: "#E0F6FF", defaultAmount: "1", unit: "cup" },
  { id: "mint", name: "Fresh Mint", category: "flavor", color: "#98FB98", defaultAmount: "3", unit: "leaves" },
  { id: "coconut", name: "Coconut Milk", category: "flavor", color: "#F5F5DC", defaultAmount: "2", unit: "oz" },
  { id: "berry", name: "Berry Syrup", category: "flavor", color: "#8B008B", defaultAmount: "1", unit: "pump" },
  { id: "lemon", name: "Lemon Zest", category: "topping", color: "#FFFF00", defaultAmount: "1", unit: "tsp" },
  { id: "crushed-ice", name: "Crushed Ice", category: "topping", color: "#F0F8FF", defaultAmount: "½", unit: "cup" },
  { id: "fruit", name: "Fresh Fruit", category: "topping", color: "#FF6347", defaultAmount: "2", unit: "pieces" },
];

const generateDrinkName = (drink: Drink): string => {
  const adjectives = drink.type === "hot" 
    ? ["Warm", "Cozy", "Steamy", "Rich", "Smooth", "Creamy", "Bold", "Aromatic"]
    : ["Cool", "Refreshing", "Crisp", "Icy", "Smooth", "Zesty", "Bright", "Energizing"];
  
  const bases = drink.ingredients.filter(i => i.category === "base");
  const flavors = drink.ingredients.filter(i => i.category === "flavor");
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const baseName = bases[0]?.name.split(" ")[0] || (drink.type === "hot" ? "Coffee" : "Brew");
  const flavorName = flavors[0]?.name.split(" ")[0] || "";
  
  const combinations = [
    `${adjective} ${flavorName} ${baseName}`,
    `${flavorName} ${adjective} ${baseName}`,
    `The ${adjective} ${baseName}`,
    `${baseName} ${adjective}`,
  ].filter(name => name.trim() !== "");
  
  return combinations[Math.floor(Math.random() * combinations.length)] || `Custom ${drink.type === "hot" ? "Hot" : "Cold"} Drink`;
};

export const DrinkBuilder = () => {
  const [drink, setDrink] = useState<Drink>({ type: "hot", ingredients: [] });
  const [generatedName, setGeneratedName] = useState<string>("");

  const addIngredient = (ingredient: Ingredient) => {
    if (drink.ingredients.find(i => i.id === ingredient.id)) {
      toast("Ingredient already added!");
      return;
    }
    
    const drinkIngredient: DrinkIngredient = {
      ...ingredient,
      amount: ingredient.defaultAmount
    };
    
    const newDrink = { ...drink, ingredients: [...drink.ingredients, drinkIngredient] };
    setDrink(newDrink);
    toast(`Added ${ingredient.defaultAmount} ${ingredient.unit} ${ingredient.name}`);
  };

  const updateIngredientAmount = (ingredientId: string, newAmount: string) => {
    setDrink({
      ...drink,
      ingredients: drink.ingredients.map(ingredient =>
        ingredient.id === ingredientId 
          ? { ...ingredient, amount: newAmount }
          : ingredient
      )
    });
  };

  const removeIngredient = (ingredientId: string) => {
    setDrink({ ...drink, ingredients: drink.ingredients.filter(i => i.id !== ingredientId) });
  };

  const generateName = () => {
    if (drink.ingredients.length === 0) {
      toast("Add some ingredients first!");
      return;
    }
    
    const name = generateDrinkName(drink);
    setGeneratedName(name);
    toast(`Generated name: ${name}`);
  };

  const saveDrink = () => {
    if (drink.ingredients.length === 0) {
      toast("Add some ingredients first!");
      return;
    }
    
    const name = generatedName || generateDrinkName(drink);
    toast(`Saved "${name}" to your recipes!`);
  };

  const currentIngredients = drink.type === "hot" ? hotIngredients : coldIngredients;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Drink Designer Studio
        </h1>
        <p className="text-lg text-muted-foreground">
          Create and name your perfect hot or cold beverage
        </p>
      </div>

      <Tabs value={drink.type} onValueChange={(value) => setDrink({ type: value as "hot" | "cold", ingredients: [] })}>
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="hot" className="flex items-center gap-2 text-base">
            <Coffee className="w-5 h-5" />
            Hot Drinks
          </TabsTrigger>
          <TabsTrigger value="cold" className="flex items-center gap-2 text-base">
            <Snowflake className="w-5 h-5" />
            Cold Drinks
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Ingredients Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Available Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {["base", "flavor", "topping", "sweetener"].map((category) => {
                    const categoryIngredients = currentIngredients.filter(i => i.category === category);
                    if (categoryIngredients.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h3 className="font-semibold capitalize text-muted-foreground">{category}s</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {categoryIngredients.map((ingredient) => (
                            <Button
                              key={ingredient.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addIngredient(ingredient)}
                              className="justify-start h-auto p-3"
                              disabled={drink.ingredients.some(i => i.id === ingredient.id)}
                            >
                              <div 
                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                style={{ backgroundColor: ingredient.color }}
                              />
                              {ingredient.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drink Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {drink.type === "hot" ? <Coffee className="w-5 h-5" /> : <Snowflake className="w-5 h-5" />}
                  Your {drink.type === "hot" ? "Hot" : "Cold"} Drink
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drink Visualization */}
                <div className={`w-full h-48 rounded-lg border-2 border-dashed p-4 ${
                  drink.type === "hot" 
                    ? "bg-gradient-to-b from-orange-50 to-amber-50 border-orange-200" 
                    : "bg-gradient-to-b from-blue-50 to-cyan-50 border-blue-200"
                }`}>
                  {drink.ingredients.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        Recipe Details ({drink.ingredients.length} ingredients):
                      </div>
                      <div className="space-y-3">
                        {drink.ingredients.map((ingredient) => (
                          <div 
                            key={ingredient.id}
                            className="flex items-center justify-between p-3 bg-background/50 rounded-lg border"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: ingredient.color }}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{ingredient.name}</div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {ingredient.category}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ingredient.amount}
                                onChange={(e) => updateIngredientAmount(ingredient.id, e.target.value)}
                                className="w-16 px-2 py-1 text-sm border rounded text-center"
                                placeholder="1"
                              />
                              <span className="text-sm text-muted-foreground min-w-12">
                                {ingredient.unit}
                              </span>
                              <button
                                onClick={() => removeIngredient(ingredient.id)}
                                className="ml-2 p-1 hover:text-destructive rounded-sm hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Start adding ingredients to build your drink
                    </div>
                  )}
                </div>

                {/* Generated Name */}
                {generatedName && (
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Sparkles className="w-4 h-4" />
                      Generated Name:
                    </div>
                    <div className="text-xl font-bold text-primary">{generatedName}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={generateName}
                    variant={drink.type === "hot" ? "hot" : "cold"}
                    disabled={drink.ingredients.length === 0}
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Name
                  </Button>
                  <Button 
                    onClick={saveDrink}
                    variant="premium"
                    disabled={drink.ingredients.length === 0}
                    className="flex-1"
                  >
                    Save Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};