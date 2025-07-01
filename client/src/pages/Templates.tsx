import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Baby, Shirt, Home, Cookie, Plus } from "lucide-react";
import { Link } from "wouter";
import type { ProjectTemplate } from "@shared/schema";

export default function Templates() {
  const { data: templates, isLoading } = useQuery<ProjectTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "--";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'baby items':
      case 'blankets & throws':
        return <Baby className="h-8 w-8 text-white" />;
      case 'clothing':
        return <Shirt className="h-8 w-8 text-white" />;
      case 'home decor':
        return <Home className="h-8 w-8 text-white" />;
      case 'amigurumi':
        return <Cookie className="h-8 w-8 text-white" />;
      default:
        return <Baby className="h-8 w-8 text-white" />;
    }
  };

  const getCategoryGradient = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'baby items':
      case 'blankets & throws':
        return 'bg-gradient-to-br from-pink-200 to-purple-300';
      case 'clothing':
        return 'bg-gradient-to-br from-purple-200 to-pink-300';
      case 'home decor':
        return 'bg-gradient-to-br from-green-200 to-teal-300';
      case 'amigurumi':
        return 'bg-gradient-to-br from-amber-200 to-orange-300';
      default:
        return 'bg-gradient-to-br from-blue-200 to-indigo-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'complex':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock templates for demo since we don't have seed data
  const mockTemplates = [
    {
      id: 1,
      name: "Baby Blanket",
      description: "Standard 36\"x36\" baby blanket with medium complexity stitching",
      categoryName: "Baby Items",
      avgMaterialCost: "15.00",
      avgHours: "10.00",
      suggestedPrice: "95.00",
      complexity: "moderate",
    },
    {
      id: 2,
      name: "Amigurumi Animals",
      description: "Small to medium sized stuffed animals with detailed features",
      categoryName: "Amigurumi",
      avgMaterialCost: "8.00",
      avgHours: "4.50",
      suggestedPrice: "45.00",
      complexity: "complex",
    },
    {
      id: 3,
      name: "Scarves & Accessories",
      description: "Hats, scarves, mittens and other wearable accessories",
      categoryName: "Clothing",
      avgMaterialCost: "12.00",
      avgHours: "6.00",
      suggestedPrice: "65.00",
      complexity: "simple",
    },
    {
      id: 4,
      name: "Home Decor",
      description: "Pillow covers, wall hangings, plant holders and decorative items",
      categoryName: "Home Decor",
      avgMaterialCost: "13.00",
      avgHours: "6.00",
      suggestedPrice: "55.00",
      complexity: "moderate",
    },
    {
      id: 5,
      name: "Clothing Items",
      description: "Sweaters, cardigans, tops and other wearable garments",
      categoryName: "Clothing",
      avgMaterialCost: "28.00",
      avgHours: "22.50",
      suggestedPrice: "185.00",
      complexity: "expert",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Templates</h1>
          <p className="text-gray-600">Quick start with pre-configured templates for common crochet items</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-32 bg-gray-300"></div>
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const displayTemplates = templates && templates.length > 0 ? templates : mockTemplates;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Templates</h1>
        <p className="text-gray-600">Quick start with pre-configured templates for common crochet items</p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTemplates.map((template: any) => (
          <Card key={template.id} className="overflow-hidden card-hover">
            {/* Header with icon */}
            <div className={`h-32 flex items-center justify-center ${getCategoryGradient(template.categoryName || '')}`}>
              {getCategoryIcon(template.categoryName || '')}
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge className={getComplexityColor(template.complexity || 'simple')}>
                  {template.complexity || 'Simple'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {template.description}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Materials:</span>
                  <span className="font-medium">{formatCurrency(template.avgMaterialCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Time:</span>
                  <span className="font-medium">
                    {template.avgHours ? `${parseFloat(template.avgHours).toFixed(1)}h` : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Suggested Price:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(template.suggestedPrice)}
                  </span>
                </div>
              </div>
              
              <Link href={`/calculator?template=${template.id}`}>
                <Button className="w-full">
                  Use Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {/* Create Custom Template Card */}
        <Card className="overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          <div className="h-32 bg-gray-50 flex items-center justify-center">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-gray-700">Create Custom Template</CardTitle>
            <p className="text-sm text-gray-500">
              Save your own pricing calculations as reusable templates
            </p>
          </CardHeader>
          
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
