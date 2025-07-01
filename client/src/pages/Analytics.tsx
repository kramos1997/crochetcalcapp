import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Clock, Target, Star } from "lucide-react";
import type { UserStats } from "@/types";

export default function Analytics() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/analytics/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Mock data for charts and trends
  const categoryData = [
    { name: 'Baby Items', percentage: 45, color: 'bg-primary' },
    { name: 'Accessories', percentage: 30, color: 'bg-purple-400' },
    { name: 'Home Decor', percentage: 15, color: 'bg-green-500' },
    { name: 'Clothing', percentage: 10, color: 'bg-amber-500' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Track your crochet business performance and identify trends</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
        <p className="text-gray-600">Track your crochet business performance and identify trends</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className="text-2xl font-bold text-green-600">+23%</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-primary">$87.50</p>
                <p className="text-xs text-gray-500">+8% increase</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency Rate</p>
                <p className="text-2xl font-bold text-blue-600">$18.40</p>
                <p className="text-xs text-gray-500">per hour</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-amber-600">4.8/5</p>
                <p className="text-xs text-gray-500">based on reviews</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p className="font-medium">Revenue Chart</p>
                <p className="text-sm">Showing growth over the last 6 months</p>
                <div className="mt-4 text-left">
                  <p className="text-xs text-gray-400">Integration with charting library needed</p>
                  <p className="text-xs text-gray-400">Current month: {formatCurrency(stats?.monthlyRevenue || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Project Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="text-sm font-medium">{category.percentage}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Hours per Project</span>
                <span className="font-semibold">
                  {stats?.totalHours && stats?.totalProjects 
                    ? (stats.totalHours / stats.totalProjects).toFixed(1) 
                    : '0.0'
                  }h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Most Time-Intensive</span>
                <span className="font-semibold">Sweaters</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quickest Projects</span>
                <span className="font-semibold">Accessories</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Effective Hourly Rate</span>
                <span className="font-semibold text-green-600">
                  {stats?.totalHours && stats?.totalRevenue
                    ? formatCurrency(stats.totalRevenue / stats.totalHours)
                    : '$0.00'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Materials (Avg)</span>
                <span className="font-semibold">$12.45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Labor (Avg)</span>
                <span className="font-semibold">$108.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Business Costs</span>
                <span className="font-semibold">$8.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="font-semibold text-green-600">
                  {stats?.avgMargin ? `${stats.avgMargin.toFixed(0)}%` : '0%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-semibold text-green-600">+23%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project Completion</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-semibold text-green-600">+15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-semibold text-green-600">+8%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projects Completed</span>
                <span className="font-medium">
                  {stats?.monthlyProjects || 0}
                </span>
              </div>
              <Progress 
                value={stats?.monthlyProjects ? Math.min(100, (stats.monthlyProjects / 20) * 100) : 0} 
                className="h-2" 
              />
              <p className="text-xs text-gray-500">Target: 20 projects</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </span>
              </div>
              <Progress 
                value={stats?.monthlyRevenue ? Math.min(100, (stats.monthlyRevenue / 2000) * 100) : 0} 
                className="h-2" 
              />
              <p className="text-xs text-gray-500">Target: $2,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
