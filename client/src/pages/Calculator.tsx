import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, RotateCcw, FileText, Share2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Material, BusinessExpense, PricingCalculation, ProjectFormData } from "@/types";

export default function Calculator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    categoryId: undefined,
    materials: [{ name: "", quantity: 0, unitCost: 0 }],
    hourlyRate: 15,
    hoursSpent: 0,
    complexityFactor: 1,
    businessExpenses: [{ name: "", cost: 0 }],
    profitMargin: 30,
    shippingCost: 0,
    taxRate: 0,
  });

  const [calculation, setCalculation] = useState<PricingCalculation>({
    materialsCost: 0,
    laborCost: 0,
    businessCost: 0,
    baseCost: 0,
    profitAmount: 0,
    wholesalePrice: 0,
    retailPrice: 0,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      await apiRequest("POST", "/api/projects", projectData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: "", quantity: 0, unitCost: 0 }]
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const addExpense = () => {
    setFormData(prev => ({
      ...prev,
      businessExpenses: [...prev.businessExpenses, { name: "", cost: 0 }]
    }));
  };

  const removeExpense = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessExpenses: prev.businessExpenses.filter((_, i) => i !== index)
    }));
  };

  const updateExpense = (index: number, field: keyof BusinessExpense, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      businessExpenses: prev.businessExpenses.map((expense, i) => 
        i === index ? { ...expense, [field]: value } : expense
      )
    }));
  };

  const calculatePricing = () => {
    // Calculate materials cost
    const materialsCost = formData.materials.reduce((sum, material) => 
      sum + (material.quantity * material.unitCost), 0
    );

    // Calculate labor cost with complexity factor
    const laborCost = formData.hourlyRate * formData.hoursSpent * formData.complexityFactor;

    // Calculate business expenses
    const businessCost = formData.businessExpenses.reduce((sum, expense) => 
      sum + expense.cost, 0
    );

    // Calculate base cost
    const baseCost = materialsCost + laborCost + businessCost;

    // Calculate profit amount
    const profitAmount = baseCost * (formData.profitMargin / 100);

    // Calculate tax amount
    const taxAmount = baseCost * (formData.taxRate / 100);

    // Calculate wholesale price
    const wholesalePrice = baseCost + profitAmount + formData.shippingCost + taxAmount;

    // Calculate retail price (2x wholesale)
    const retailPrice = wholesalePrice * 2;

    const newCalculation = {
      materialsCost,
      laborCost,
      businessCost,
      baseCost,
      profitAmount,
      wholesalePrice,
      retailPrice,
    };

    setCalculation(newCalculation);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: undefined,
      materials: [{ name: "", quantity: 0, unitCost: 0 }],
      hourlyRate: 15,
      hoursSpent: 0,
      complexityFactor: 1,
      businessExpenses: [{ name: "", cost: 0 }],
      profitMargin: 30,
      shippingCost: 0,
      taxRate: 0,
    });
    setCalculation({
      materialsCost: 0,
      laborCost: 0,
      businessCost: 0,
      baseCost: 0,
      profitAmount: 0,
      wholesalePrice: 0,
      retailPrice: 0,
    });
  };

  const saveProject = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      ...formData,
      materials: formData.materials.map(m => ({ ...m, totalCost: m.quantity * m.unitCost })),
      materialsCost: calculation.materialsCost,
      laborCost: calculation.laborCost,
      businessCost: calculation.businessCost,
      baseCost: calculation.baseCost,
      profitAmount: calculation.profitAmount,
      wholesalePrice: calculation.wholesalePrice,
      retailPrice: calculation.retailPrice,
    };

    saveProjectMutation.mutate(projectData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advanced Pricing Calculator</h1>
        <p className="text-gray-600">Calculate precise pricing with advanced formulas and cost tracking</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calculator Form */}
        <div className="xl:col-span-2">
          <Card>
            <Tabs defaultValue="basic" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
                  <TabsTrigger value="batch">Batch Calculator</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="basic" className="space-y-6">
                  {/* Project Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input
                          id="project-name"
                          placeholder="e.g., Baby Blanket"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.categoryId?.toString()} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Project details..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Materials Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Materials</h3>
                      <Button onClick={addMaterial} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Material
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.materials.map((material, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-2">
                            <Label>Material Name</Label>
                            <Input
                              placeholder="e.g., Yarn"
                              value={material.name}
                              onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="Amount"
                              value={material.quantity || ''}
                              onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit Cost</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="$0.00"
                              value={material.unitCost || ''}
                              onChange={(e) => updateMaterial(index, 'unitCost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              onClick={() => removeMaterial(index)}
                              variant="destructive"
                              size="sm"
                              disabled={formData.materials.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Labor Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Labor & Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourly-rate">Hourly Rate</Label>
                        <Input
                          id="hourly-rate"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="$15.00"
                          value={formData.hourlyRate || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hours-spent">Hours Spent</Label>
                        <Input
                          id="hours-spent"
                          type="number"
                          min="0"
                          step="0.25"
                          placeholder="0.00"
                          value={formData.hoursSpent || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, hoursSpent: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complexity">Complexity Factor</Label>
                        <Select 
                          value={formData.complexityFactor.toString()} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, complexityFactor: parseFloat(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Simple (1.0x)</SelectItem>
                            <SelectItem value="1.2">Moderate (1.2x)</SelectItem>
                            <SelectItem value="1.5">Complex (1.5x)</SelectItem>
                            <SelectItem value="2">Expert (2.0x)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Costs */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Business Costs</h3>
                      <Button onClick={addExpense} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.businessExpenses.map((expense, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-2">
                            <Label>Expense Name</Label>
                            <Input
                              placeholder="e.g., Tools"
                              value={expense.name}
                              onChange={(e) => updateExpense(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Cost</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="$0.00"
                              value={expense.cost || ''}
                              onChange={(e) => updateExpense(index, 'cost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              onClick={() => removeExpense(index)}
                              variant="destructive"
                              size="sm"
                              disabled={formData.businessExpenses.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="profit-margin">Profit Margin (%)</Label>
                        <Input
                          id="profit-margin"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="30"
                          value={formData.profitMargin || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, profitMargin: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-cost">Shipping Cost</Label>
                        <Input
                          id="shipping-cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="$0.00"
                          value={formData.shippingCost || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                        <Input
                          id="tax-rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                          value={formData.taxRate || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button onClick={calculatePricing} className="flex-1 sm:flex-none">
                      Calculate Pricing
                    </Button>
                    <Button onClick={saveProject} variant="outline" disabled={saveProjectMutation.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {saveProjectMutation.isPending ? 'Saving...' : 'Save Project'}
                    </Button>
                    <Button onClick={resetForm} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="advanced">
                  <div className="text-center py-8 text-gray-500">
                    Advanced mode features coming soon...
                  </div>
                </TabsContent>

                <TabsContent value="batch">
                  <div className="text-center py-8 text-gray-500">
                    Batch calculator features coming soon...
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Materials Cost</span>
                  <span className="font-medium">{formatCurrency(calculation.materialsCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Labor Cost</span>
                  <span className="font-medium">{formatCurrency(calculation.laborCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Business Expenses</span>
                  <span className="font-medium">{formatCurrency(calculation.businessCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base Cost</span>
                  <span className="font-medium">{formatCurrency(calculation.baseCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit ({formData.profitMargin}%)</span>
                  <span className="font-medium text-green-600">{formatCurrency(calculation.profitAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="font-medium">{formatCurrency(formData.shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Wholesale Price</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(calculation.wholesalePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Suggested Retail</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(calculation.retailPrice)}</span>
                </div>
              </div>

              {/* Export Options */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF Quote
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
