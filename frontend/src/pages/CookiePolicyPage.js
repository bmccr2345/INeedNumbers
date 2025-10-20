import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const CookiePolicyPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Cookie Policy — I Need Numbers';
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
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-deep-forest mb-8 font-poppins">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none text-neutral-dark space-y-6">
            <p className="text-lg text-neutral-dark mb-8">
              Last updated: January 1, 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Authentication Cookies:</strong> Keep you logged in to your account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-deep-forest">Strictly Necessary Cookies</h3>
                  <p>These cookies are essential for the website to function properly. They include authentication tokens and security features.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-deep-forest">Analytics Cookies</h3>
                  <p>We use Google Analytics to understand how visitors interact with our website. This helps us improve our services.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-deep-forest">Functional Cookies</h3>
                  <p>These cookies remember your preferences and settings to provide a personalized experience.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Managing Cookies</h2>
              <p>
                You can control and manage cookies in various ways. Most web browsers allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p>
                Please note that blocking or deleting cookies may affect your experience on our website and some features may not work properly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Third-Party Cookies</h2>
              <p>
                We may use third-party services like Google Analytics and Stripe that set their own cookies. 
                These services have their own privacy policies and cookie policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at{' '}
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

export default CookiePolicyPage;