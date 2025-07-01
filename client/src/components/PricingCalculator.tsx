import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Calculator } from "lucide-react";
import type { Material, BusinessExpense, PricingCalculation } from "@/types";

interface PricingCalculatorProps {
  materials: Material[];
  hourlyRate: number;
  hoursSpent: number;
  complexityFactor: number;
  businessExpenses: BusinessExpense[];
  profitMargin: number;
  shippingCost: number;
  taxRate: number;
  onMaterialsChange: (materials: Material[]) => void;
  onLaborChange: (field: string, value: number) => void;
  onExpensesChange: (expenses: BusinessExpense[]) => void;
  onPricingFactorsChange: (field: string, value: number) => void;
  onCalculate: (calculation: PricingCalculation) => void;
}

export default function PricingCalculator({
  materials,
  hourlyRate,
  hoursSpent,
  complexityFactor,
  businessExpenses,
  profitMargin,
  shippingCost,
  taxRate,
  onMaterialsChange,
  onLaborChange,
  onExpensesChange,
  onPricingFactorsChange,
  onCalculate,
}: PricingCalculatorProps) {
  const addMaterial = () => {
    onMaterialsChange([...materials, { name: "", quantity: 0, unitCost: 0 }]);
  };

  const removeMaterial = (index: number) => {
    onMaterialsChange(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const updatedMaterials = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    );
    onMaterialsChange(updatedMaterials);
  };

  const addExpense = () => {
    onExpensesChange([...businessExpenses, { name: "", cost: 0 }]);
  };

  const removeExpense = (index: number) => {
    onExpensesChange(businessExpenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: keyof BusinessExpense, value: string | number) => {
    const updatedExpenses = businessExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    onExpensesChange(updatedExpenses);
  };

  const calculatePricing = () => {
    // Calculate materials cost
    const materialsCost = materials.reduce((sum, material) => 
      sum + (material.quantity * material.unitCost), 0
    );

    // Calculate labor cost with complexity factor
    const laborCost = hourlyRate * hoursSpent * complexityFactor;

    // Calculate business expenses
    const businessCost = businessExpenses.reduce((sum, expense) => 
      sum + expense.cost, 0
    );

    // Calculate base cost
    const baseCost = materialsCost + laborCost + businessCost;

    // Calculate profit amount
    const profitAmount = baseCost * (profitMargin / 100);

    // Calculate tax amount
    const taxAmount = baseCost * (taxRate / 100);

    // Calculate wholesale price
    const wholesalePrice = baseCost + profitAmount + shippingCost + taxAmount;

    // Calculate retail price (2x wholesale)
    const retailPrice = wholesalePrice * 2;

    const calculation = {
      materialsCost,
      laborCost,
      businessCost,
      baseCost,
      profitAmount,
      wholesalePrice,
      retailPrice,
    };

    onCalculate(calculation);
  };

  return (
    <div className="space-y-6">
      {/* Materials Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Materials</CardTitle>
            <Button onClick={addMaterial} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material, index) => (
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
                    disabled={materials.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Labor Section */}
      <Card>
        <CardHeader>
          <CardTitle>Labor & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Hourly Rate</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="$15.00"
                value={hourlyRate || ''}
                onChange={(e) => onLaborChange('hourlyRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours Spent</Label>
              <Input
                type="number"
                min="0"
                step="0.25"
                placeholder="0.00"
                value={hoursSpent || ''}
                onChange={(e) => onLaborChange('hoursSpent', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Complexity Factor</Label>
              <Input
                type="number"
                min="1"
                max="3"
                step="0.1"
                placeholder="1.0"
                value={complexityFactor || ''}
                onChange={(e) => onLaborChange('complexityFactor', parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Business Expenses</CardTitle>
            <Button onClick={addExpense} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessExpenses.map((expense, index) => (
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
                    disabled={businessExpenses.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Profit Margin (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="30"
                value={profitMargin || ''}
                onChange={(e) => onPricingFactorsChange('profitMargin', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Shipping Cost</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="$0.00"
                value={shippingCost || ''}
                onChange={(e) => onPricingFactorsChange('shippingCost', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                value={taxRate || ''}
                onChange={(e) => onPricingFactorsChange('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button onClick={calculatePricing} size="lg" className="px-8">
          <Calculator className="mr-2 h-5 w-5" />
          Calculate Pricing
        </Button>
      </div>
    </div>
  );
}
