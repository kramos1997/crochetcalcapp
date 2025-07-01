import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ plan }: { plan: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription?success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Complete Your Subscription
        </CardTitle>
        <CardDescription>
          {plan === 'monthly' && 'Monthly Pro - $1.99/month'}
          {plan === 'yearly' && 'Annual Pro - $9.00/year (Save $14.88!)'}
          {plan === 'lifetime' && 'Lifetime Access - $29.99 one-time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Payment'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setLocation('/subscription')}
          >
            Back to Plans
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [plan, setPlan] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    
    if (!planParam) {
      setLocation('/subscription');
      return;
    }

    setPlan(planParam);

    // Create payment intent based on plan type
    const endpoint = planParam === 'lifetime' 
      ? `/api/create-payment-intent?plan=${planParam}`
      : `/api/create-subscription?plan=${planParam}`;

    fetch(endpoint, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret received');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setLocation('/subscription');
      });
  }, [setLocation]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neutral-300 border-t-neutral-900 rounded-full mx-auto mb-4" />
          <p className="text-neutral-600">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 neutral-gradient">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm plan={plan} />
      </Elements>
    </div>
  );
}