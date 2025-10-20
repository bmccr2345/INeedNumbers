import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const AccessibilityPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Accessibility Statement — I Need Numbers';
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
          <h1 className="text-4xl font-bold text-deep-forest mb-8 font-poppins">Accessibility Statement</h1>
          
          <div className="prose prose-lg max-w-none text-neutral-dark space-y-6">
            <p className="text-lg text-neutral-dark mb-8">
              Last updated: January 1, 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Our Commitment</h2>
              <p>
                I Need Numbers is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Accessibility Standards</h2>
              <p>
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                These guidelines help make web content more accessible to a wider range of people with disabilities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Accessibility Features</h2>
              <p>Our website includes the following accessibility features:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatible markup</li>
                <li>High contrast color schemes</li>
                <li>Descriptive alt text for images</li>
                <li>Clear heading structure</li>
                <li>Focus indicators for interactive elements</li>
                <li>ARIA labels and descriptions where appropriate</li>
                <li>Readable fonts and adequate font sizes</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Known Issues</h2>
              <p>
                We are aware of some accessibility issues and are working to address them:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some dynamic content may not be immediately announced to screen readers</li>
                <li>Complex calculators may require additional keyboard shortcuts</li>
                <li>PDF reports are being enhanced for better screen reader compatibility</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Assistive Technologies</h2>
              <p>
                Our website is designed to be compatible with common assistive technologies including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
                <li>Voice recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Screen magnification software</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Feedback and Support</h2>
              <p>
                We welcome your feedback on the accessibility of I Need Numbers. If you encounter any accessibility barriers 
                or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p><strong>Email:</strong> <a href="mailto:support@ineednumbers.com" className="text-primary hover:text-secondary underline">support@ineednumbers.com</a></p>
                <p><strong>Subject Line:</strong> Accessibility Feedback</p>
                <p className="text-sm text-neutral-dark mt-2">
                  Please describe the accessibility issue you encountered and include information about your assistive technology if applicable.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Ongoing Efforts</h2>
              <p>
                We are committed to continuously improving accessibility. Our ongoing efforts include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>User testing with assistive technology users</li>
                <li>Staff training on accessibility best practices</li>
                <li>Incorporating accessibility into our development process</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-deep-forest">Third-Party Content</h2>
              <p>
                Some content on our website may be provided by third parties. We work with our partners to ensure 
                accessibility standards are met, but we may not have full control over all third-party content.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessibilityPage;