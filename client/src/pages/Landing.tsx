import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Calculator, BarChart3, FileText, Users, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Scissors className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              CrochetCraft Pro
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            The ultimate pricing calculator for crochet artisans. 
            Price your handmade creations fairly and grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="text-lg px-8 py-3"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="card-hover">
            <CardHeader>
              <Calculator className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Advanced Calculator</CardTitle>
              <CardDescription>
                Calculate precise pricing with material costs, labor, and business expenses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Project Templates</CardTitle>
              <CardDescription>
                Quick start with pre-configured templates for common crochet items
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>
                Track revenue, profit margins, and business growth over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Save, organize, and manage all your crochet projects in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>PDF Exports</CardTitle>
              <CardDescription>
                Generate professional quotes and invoices for your clients
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Fair Pricing</CardTitle>
              <CardDescription>
                Ensure you're paid fairly for your time and craftsmanship
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Loved by Crochet Artists Everywhere
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  "CrochetCraft Pro helped me realize I was undercharging for my work. 
                  Now I'm making a sustainable income from my passion!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Crochet Artist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  "The project templates save me so much time! I can quote clients 
                  quickly and confidently now."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold">Maria Chen</p>
                    <p className="text-sm text-gray-500">Handmade Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Price Your Creations Fairly?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of crochet artists who are building sustainable businesses 
                with fair pricing.
              </p>
              <Button 
                onClick={handleLogin}
                size="lg" 
                className="text-lg px-8 py-3"
              >
                Start Your Free Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
