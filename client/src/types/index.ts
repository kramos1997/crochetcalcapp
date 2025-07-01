export interface Material {
  name: string;
  quantity: number;
  unitCost: number;
  totalCost?: number;
}

export interface BusinessExpense {
  name: string;
  cost: number;
}

export interface PricingCalculation {
  materialsCost: number;
  laborCost: number;
  businessCost: number;
  baseCost: number;
  profitAmount: number;
  wholesalePrice: number;
  retailPrice: number;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  categoryId?: number;
  materials: Material[];
  hourlyRate: number;
  hoursSpent: number;
  complexityFactor: number;
  businessExpenses: BusinessExpense[];
  profitMargin: number;
  shippingCost: number;
  taxRate: number;
}

export interface UserStats {
  totalProjects: number;
  totalRevenue: number;
  totalHours: number;
  avgMargin: number;
  monthlyProjects: number;
  monthlyRevenue: number;
}
