import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    // Analytics event for footer email clicks
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'footer_contact_click');
    }
  };

  return (
    <footer className="bg-neutral-light border-t border-neutral-medium/20 py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4">
          {/* Copyright */}
          <p className="text-sm text-neutral-dark">
            ©2025 I Need Numbers, LLC. All rights reserved.
          </p>
          
          {/* Business Entity Info */}
          <p className="text-sm text-neutral-dark">
            I Need Numbers, LLC is a registered business entity.
          </p>
          
          {/* Disclaimer */}
          <p className="text-sm text-neutral-dark max-w-4xl mx-auto leading-relaxed">
            Educational use only. Not financial, investment, legal, tax, or lending advice. 
            I Need Numbers is not a lender or broker. Calculations are estimates based on user inputs; verify independently.
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-neutral-dark">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-primary transition-colors underline"
            >
              Home
            </button>
            <span>|</span>
            <button 
              onClick={() => navigate('/tools')}
              className="hover:text-primary transition-colors underline"
            >
              Tools
            </button>
            <span>|</span>
            <button 
              onClick={() => navigate('/pricing')}
              className="hover:text-primary transition-colors underline"
            >
              Pricing
            </button>
            <span>|</span>
            <button 
              onClick={() => navigate('/support')}
              className="hover:text-primary transition-colors underline"
            >
              Support
            </button>
            <span>|</span>
            <button 
              onClick={() => navigate('/auth/login')}
              className="hover:text-primary transition-colors underline"
            >
              Login
            </button>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-neutral-dark">
            <button 
              onClick={() => navigate('/legal/privacy')}
              className="hover:text-primary transition-colors underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button 
              onClick={() => navigate('/legal/terms')}
              className="hover:text-primary transition-colors underline"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button 
              onClick={() => navigate('/support#cancellation-policy')}
              className="hover:text-primary transition-colors underline"
            >
              Cancellation Policy
            </button>
            <span>·</span>
            <span>Contact:</span>
            <a 
              href="mailto:support@ineednumbers.com"
              onClick={handleEmailClick}
              className="hover:text-primary transition-colors underline"
            >
              support@ineednumbers.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;