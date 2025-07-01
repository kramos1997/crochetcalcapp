import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { User, Bell, DollarSign, Download, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input 
                    id="first-name" 
                    placeholder="Enter first name"
                    defaultValue={user?.firstName || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Enter last name"
                    defaultValue={user?.lastName || ''}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email"
                  defaultValue={user?.email || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your crochet journey..."
                  rows={3}
                />
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Business Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-hourly-rate">Default Hourly Rate</Label>
                  <Input 
                    id="default-hourly-rate" 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="15.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-profit-margin">Default Profit Margin (%)</Label>
                  <Input 
                    id="default-profit-margin" 
                    type="number"
                    min="0"
                    max="100"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-shipping">Default Shipping Cost</Label>
                  <Input 
                    id="default-shipping" 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5.00"
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
                    placeholder="8.5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input 
                  id="business-name" 
                  placeholder="Your crochet business name"
                />
              </div>
              <Button>Save Business Settings</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates about your projects and analytics</p>
                </div>
                <Switch id="email-notifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="project-reminders">Project Reminders</Label>
                  <p className="text-sm text-gray-500">Get reminded about incomplete projects</p>
                </div>
                <Switch id="project-reminders" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly analytics summaries</p>
                </div>
                <Switch id="weekly-reports" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-gray-500">Tips, tutorials, and product updates</p>
                </div>
                <Switch id="marketing-emails" />
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Data Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-template">Invoice Template</Label>
                <Input 
                  id="invoice-template" 
                  placeholder="Default template"
                  disabled
                />
                <p className="text-sm text-gray-500">Custom invoice templates coming soon</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-logo">Company Logo URL</Label>
                <Input 
                  id="company-logo" 
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Export All Data</Button>
                <Button variant="outline">Export Projects</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions Sidebar */}
        <div className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Crochet Artisan'
                    }
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'Recently'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Test Notifications
              </Button>
              <Separator />
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="text-left">
                  <p className="font-medium">Documentation</p>
                  <p className="text-sm text-gray-500">Learn how to use all features</p>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="text-left">
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-gray-500">Get help with any issues</p>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="text-left">
                  <p className="font-medium">Feature Requests</p>
                  <p className="text-sm text-gray-500">Suggest new features</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
