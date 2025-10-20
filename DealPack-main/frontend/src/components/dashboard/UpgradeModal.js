import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

const UpgradeModal = ({ isOpen, onClose }) => {
  const { user, createCheckoutSession } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = async (planType = 'pro') => {
    try {
      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'upgrade_clicked', {
          source: 'dashboard_modal',
          plan: planType
        });
      }

      // Create Stripe checkout session
      const session = await createCheckoutSession(planType);
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        // Fallback to pricing page
        window.location.href = '/pricing';
      }

    } catch (error) {
      console.error('Upgrade failed:', error);
      // Fallback to pricing page
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Fairy logo accent */}
          <div className="absolute top-4 left-4 opacity-20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          
          <CardTitle className="text-2xl text-center pt-2">
            This feature is Pro
          </CardTitle>
          <p className="text-gray-600 text-center">
            Unlock powerful features designed for professional real estate agents.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Feature Highlights */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span>Agent P&L Tracker with monthly + YTD reporting</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span>Investor-ready Deal PDFs and bulk exports</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span>All Free tools included</span>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
            <div className="text-center p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">$0</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Mortgage & Affordability Calculator</li>
                <li>✓ Commission Split Calculator</li>
                <li>✓ Seller Net Sheet Estimator</li>
              </ul>
            </div>
            
            <div className="text-center p-4 rounded-lg border-2 border-primary bg-primary/5 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                $49<span className="text-sm text-gray-600">/month</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>✓ Everything in Free</li>
                <li>✓ Agent P&L Tracker</li>
                <li>✓ Investor Deal PDFs</li>
                <li>✓ Bulk exports & sharing</li>
                <li>✓ Future Pro features</li>
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => handleUpgrade('pro')}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 text-lg py-3"
            >
              Upgrade to Pro
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* FAQ */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Frequently Asked</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Can I cancel anytime?</span>
                <p className="text-gray-600">Yes. You will not be charged for subsequent months.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeModal;