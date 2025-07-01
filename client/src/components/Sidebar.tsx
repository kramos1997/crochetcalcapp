import { useLocation } from "wouter";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calculator, 
  FolderOpen, 
  Copy, 
  TrendingUp, 
  FileText, 
  Settings,
  Scissors,
  X
} from "lucide-react";
import type { UserStats } from "@/types";

const navigation = [
  { name: 'Pricing Calculator', href: '/', icon: Calculator },
  { name: 'My Projects', href: '/projects', icon: FolderOpen },
  { name: 'Subscription', href: '/subscription', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/analytics/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 pt-16 transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        {/* Close button for mobile */}
        {onClose && (
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "sidebar-link",
                  isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                )}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
        
        {/* Quick Stats */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Scissors className="h-4 w-4 text-primary mr-2" />
              <h3 className="text-sm font-medium text-primary-700">This Month</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Projects:</span>
                <span className="font-medium">
                  {stats?.monthlyProjects || 0}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
