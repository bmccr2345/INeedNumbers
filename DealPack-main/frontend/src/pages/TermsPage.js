import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { navigateToHome } from '../utils/navigation';

const TermsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    document.title = 'Terms of Service — I Need Numbers';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-medium/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigateToHome(navigate, user)}
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
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-deep-forest mb-8 font-poppins">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-neutral-dark space-y-6">
            <p className="text-lg text-neutral-dark mb-8">
              Last updated: January 1, 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Acceptance of Terms</h2>
              <p>
                By accessing and using I Need Numbers, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Service Description</h2>
              <p>
                I Need Numbers provides real estate investment calculators and report generation tools. 
                Our service includes basic calculations, PDF generation, and data management features.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information and 
                for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Subscription Plans</h2>
              <p>We offer the following subscription plans:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Free:</strong> Basic calculator access with generic PDFs</li>
                <li><strong>Starter ($19/mo):</strong> Save up to 10 items, branded PDFs, sharing features</li>
                <li><strong>Pro ($49/mo):</strong> Unlimited saves, advanced features, multiple brand profiles</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Cancellation</h2>
              <p>
                You may cancel your subscription at any time. Upon cancellation, your service will remain active 
                until the end of your current billing period, and you will not be charged for subsequent months.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Disclaimer</h2>
              <p>
                <strong>Educational use only.</strong> I Need Numbers provides educational estimates and is not 
                financial, investment, legal, tax, or lending advice. We are not a lender or broker. 
                All calculations are estimates based on user inputs and should be verified independently.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Limitation of Liability</h2>
              <p>
                I Need Numbers shall not be liable for any direct, indirect, incidental, or consequential damages 
                resulting from the use or inability to use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at{' '}
                <a href="mailto:support@ineednumbers.com" className="text-primary hover:text-secondary underline">
                  support@ineednumbers.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;