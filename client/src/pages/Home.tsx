import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { 
  Calculator, 
  FolderOpen, 
  Copy, 
  FileText, 
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  Plus,
  FolderSync
} from "lucide-react";
import type { UserStats, Project } from "@/types";

export default function Home() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: recentProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    select: (data) => data?.slice(0, 3) || [],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Crafter'}!
        </h1>
        <p className="text-gray-600">
          Track your crochet business performance and manage projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "--" : stats?.totalProjects || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "--" : formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hours Tracked</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "--" : Math.round(stats?.totalHours || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Margin</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "--" : `${Math.round(stats?.avgMargin || 0)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">
                        {project.updatedAt ? `Updated ${formatDate(project.updatedAt)}` : 'Recently created'}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {project.retailPrice ? formatCurrency(parseFloat(project.retailPrice)) : '--'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No projects yet</p>
                <Link href="/calculator">
                  <Button className="mt-2">Create Your First Project</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/calculator">
              <Button className="w-full justify-start" size="lg">
                <Plus className="mr-3 h-5 w-5" />
                New Pricing Calculation
              </Button>
            </Link>
            
            <Link href="/templates">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Copy className="mr-3 h-5 w-5" />
                Use Template
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FileText className="mr-3 h-5 w-5" />
              Export Invoice
            </Button>
            
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FolderSync className="mr-3 h-5 w-5" />
              FolderSync with Notion
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* This Month Stats */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projects Created</span>
                <span className="font-medium">
                  {statsLoading ? "--" : stats?.monthlyProjects || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: stats?.monthlyProjects ? `${Math.min(100, (stats.monthlyProjects / 20) * 100)}%` : '0%' 
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="font-medium text-green-600">
                  {statsLoading ? "--" : formatCurrency(stats?.monthlyRevenue || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: stats?.monthlyRevenue ? `${Math.min(100, (stats.monthlyRevenue / 2000) * 100)}%` : '0%' 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
