import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calculator, Crown, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionStats {
  calculationsUsed: number;
  calculationsRemaining: number;
  isSubscribed: boolean;
  subscriptionType?: 'monthly' | 'yearly' | 'lifetime';
}

export default function Subscription() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const { data: stats } = useQuery<SubscriptionStats>({
    queryKey: ["/api/subscription/stats"],
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '$1.99',
      period: '/month',
      description: 'Perfect for occasional pricing',
      features: [
        'Unlimited calculations',
        'Save projects',
        'Export pricing sheets',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      buttonText: 'Start Monthly Plan'
    },
    {
      id: 'yearly',
      name: 'Annual Pro',
      price: '$9.00',
      period: '/year',
      description: 'Best value for regular users',
      features: [
        'Unlimited calculations',
        'Save projects',
        'Export pricing sheets',
        'Priority support',
        'Mobile app access',
        'Advanced templates',
        'Analytics dashboard'
      ],
      popular: true,
      buttonText: 'Start Annual Plan',
      savings: 'Save $14.88'
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: '$29.99',
      period: 'one-time',
      description: 'Own it forever',
      features: [
        'Everything in Annual Pro',
        'Lifetime updates',
        'Premium support',
        'Early access to features',
        'Commercial use license',
        'White-label option'
      ],
      popular: false,
      buttonText: 'Buy Lifetime Access',
      badge: 'Best Deal'
    }
  ];

  const handleSubscribe = (planId: string) => {
    // Redirect to checkout page with plan parameter
    window.location.href = `/checkout?plan=${planId}`;
  };

  const handleLifetimePurchase = () => {
    // Redirect to checkout page for lifetime purchase
    window.location.href = `/checkout?plan=lifetime`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Start with 7 free calculations, then choose the plan that works best for your crochet business
        </p>
      </div>

      {/* Free Trial Status */}
      {stats && !stats.isSubscribed && (
        <Card className="mb-8 neutral-gradient border-2 border-neutral-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calculator className="h-8 w-8 text-neutral-700" />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Free Trial</h3>
                  <p className="text-neutral-600">
                    {stats.calculationsRemaining} of 7 free calculations remaining
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-neutral-900">
                  {stats.calculationsRemaining}
                </div>
                <div className="text-sm text-neutral-500">calculations left</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Subscription Status */}
      {stats?.isSubscribed && (
        <Card className="mb-8 premium-card border-2 border-neutral-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  Pro Member
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {stats.subscriptionType === 'lifetime' ? 'Lifetime' : 
                     stats.subscriptionType === 'yearly' ? 'Annual' : 'Monthly'}
                  </Badge>
                </h3>
                <p className="text-neutral-600">
                  Unlimited calculations and premium features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`subscription-card relative ${
              plan.popular ? 'ring-2 ring-neutral-900 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-neutral-900 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            {plan.badge && (
              <div className="absolute -top-3 right-4">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-neutral-900">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-neutral-600 text-base">
                {plan.description}
              </CardDescription>
              
              <div className="pt-4">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-neutral-900">
                    {plan.price}
                  </span>
                  <span className="text-neutral-600 ml-2">
                    {plan.period}
                  </span>
                </div>
                {plan.savings && (
                  <p className="text-green-600 font-medium mt-2">
                    {plan.savings}
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full h-12 text-base font-medium"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => plan.id === 'lifetime' ? handleLifetimePurchase() : handleSubscribe(plan.id)}
                disabled={stats?.isSubscribed}
              >
                {stats?.isSubscribed ? 'Current Plan' : plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <Card className="neutral-gradient">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-neutral-900">
            Why Upgrade to Pro?
          </CardTitle>
          <CardDescription className="text-lg text-neutral-600">
            Take your crochet business to the next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Unlimited Calculations
              </h3>
              <p className="text-neutral-600">
                Price as many projects as you want without restrictions
              </p>
            </div>
            
            <div className="text-center">
              <Zap className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Advanced Features
              </h3>
              <p className="text-neutral-600">
                Export pricing sheets, save templates, and track analytics
              </p>
            </div>
            
            <div className="text-center">
              <Crown className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Priority Support
              </h3>
              <p className="text-neutral-600">
                Get help when you need it with dedicated customer support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="text-center mt-12">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="text-left max-w-2xl mx-auto space-y-4 text-neutral-600">
          <div>
            <strong className="text-neutral-900">Can I cancel anytime?</strong>
            <p>Yes, you can cancel your subscription at any time. No questions asked.</p>
          </div>
          <div>
            <strong className="text-neutral-900">What happens after my free calculations?</strong>
            <p>You can still view your saved projects, but you'll need to upgrade to create new calculations.</p>
          </div>
          <div>
            <strong className="text-neutral-900">Is the lifetime option really lifetime?</strong>
            <p>Yes! Pay once and use the calculator forever, including all future updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}