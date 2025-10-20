import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import { CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import PlanPreviewRibbon from '../components/PlanPreviewRibbon';
import { usePlanPreview } from '../hooks/usePlanPreview';

const PricingPage = () => {
  const { user, createCheckoutSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { effectivePlan, previewPlan, isPreviewMode, clearPreview } = usePlanPreview(user?.plan);

  React.useEffect(() => {
    // Check for checkout cancellation
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'cancelled') {
      setError('Payment was cancelled. You can try again anytime.');
    }
  }, [searchParams]);

  const handleUpgrade = async (plan) => {
    setLoading(true);
    setError('');
    
    const result = await createCheckoutSession(plan);
    
    if (result.success) {
      window.location.href = result.url;
    } else {
      setError(result.error || 'Failed to create checkout session. Please try again.');
    }
    
    setLoading(false);
  };

  // Plan definitions with truthful, live features only
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Access to core calculators - always free, no credit card required",
      features: [
        "Commission Split Calculator",
        "Seller Net Sheet Estimator", 
        "Mortgage & Affordability Calculator",
        "Basic calculations and results"
      ],
      cta: effectivePlan === 'FREE' ? "Current Plan" : "Start Free",
      popular: false,
      current: effectivePlan === 'FREE',
      disabled: false,
      action: () => navigate('/calculator')
    },
    {
      name: "Starter",
      price: "$19",
      period: "month", 
      description: "Everything in Free, plus save deals and create branded reports",
      features: [
        "All Free tools included",
        "Save up to 10 deals",
        "Branded PDFs with your logo & contact",
        "Share links with clients",
        "Portfolio basics"
      ],
      cta: effectivePlan === 'STARTER' ? "Current Plan" : "Upgrade to Starter",
      popular: false,
      current: effectivePlan === 'STARTER',
      disabled: effectivePlan === 'STARTER' || effectivePlan === 'PRO',
      action: () => handleUpgrade('starter')
    },
    {
      name: "Pro",
      price: "$49",
      period: "month",
      description: "Everything in Starter, plus advanced business tracking and insights",
      features: [
        "All Starter features included",
        "Agent P&L Tracker – your personal business scoreboard",
        "Exportable PDF/Excel reports",
        "Drill-down insights on categories",
        "Unlimited deals & portfolios",
        "URL prefill from listings",
        "5-year projections in PDFs",
        "Multi-brand profiles",
        "Access to all future Pro features"
      ],
      cta: effectivePlan === 'PRO' ? "Current Plan" : "Upgrade to Pro",
      popular: true,
      current: effectivePlan === 'PRO',
      disabled: effectivePlan === 'PRO',
      action: () => handleUpgrade('pro')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium">
      {/* Plan Preview Ribbon */}
      {isPreviewMode && (
        <PlanPreviewRibbon previewPlan={previewPlan} onClear={clearPreview} />
      )}

      {/* Navigation */}
      <nav className={`bg-white/80 backdrop-blur-md border-b border-neutral-medium/20 ${isPreviewMode ? 'mt-12' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-deep-forest hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <div className="flex items-center space-x-2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                  alt="I Need Numbers" 
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-primary font-poppins">I NEED NUMBERS</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-neutral-dark">
                    Welcome, {user.full_name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    My Account
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/auth/login')}
                    className="text-deep-forest hover:text-primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate('/auth/register')}
                    className="bg-primary hover:bg-secondary text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
            Pricing
          </Badge>
          <h1 className="text-4xl font-bold text-deep-forest mb-4 font-poppins">
            Choose the Plan That Fits Your Business
          </h1>
          <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
            From essential calculators to comprehensive business tracking, find the perfect toolkit for your real estate practice.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <section 
              key={index} 
              aria-labelledby={`plan-${plan.name.toLowerCase()}`}
              className={`relative ${
                plan.popular ? 'order-first md:order-none' : ''
              }`}
            >
              <Card className={`relative border-2 h-full flex flex-col ${
                plan.popular ? 'border-primary shadow-xl' : 
                plan.current ? 'border-green-500 shadow-lg' : 'border-neutral-medium'
              } hover:shadow-lg transition-all duration-300`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                    Most Popular
                  </Badge>
                )}
                {plan.current && !plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle id={`plan-${plan.name.toLowerCase()}`} className="text-2xl font-bold text-deep-forest font-poppins">
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-deep-forest">
                      {plan.price}
                      <span className="text-lg font-normal text-neutral-dark">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow" role="list">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-neutral-dark text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full font-poppins ${
                      plan.popular 
                        ? 'bg-primary hover:bg-secondary text-white' 
                        : plan.current
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-deep-forest hover:bg-deep-forest/90 text-white'
                    }`}
                    onClick={plan.action}
                    disabled={loading || plan.disabled}
                  >
                    {loading && (plan.name === 'Starter' || plan.name === 'Pro') ? 'Processing...' : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-900 mb-2">Flexible Cancellation Policy</h3>
            <p className="text-green-800">
              Cancel anytime. You will not be charged for subsequent months. No questions asked, no hidden fees.
            </p>
          </div>
          
          <p className="text-neutral-dark">
            All plans include professional tools designed specifically for real estate agents.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-neutral-dark">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage;