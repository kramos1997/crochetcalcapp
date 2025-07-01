import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Baby, Shirt, Home, Cookie } from "lucide-react";
import { Link } from "wouter";
import type { ProjectTemplate } from "@shared/schema";

interface TemplateCardProps {
  template: ProjectTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
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

  // Use a fallback category name if not available
  const categoryName = template.categoryId ? 'General' : 'General';

  return (
    <Card className="overflow-hidden card-hover">
      {/* Header with icon */}
      <div className={`h-32 flex items-center justify-center ${getCategoryGradient(categoryName)}`}>
        {getCategoryIcon(categoryName)}
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
  );
}
