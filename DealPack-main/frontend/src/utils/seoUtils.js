// SEO and meta tag utilities
import { Helmet } from 'react-helmet-async';

// Page-specific SEO data
export const seoData = {
  home: {
    title: "I Need Numbers — Real Estate Calculators & Investor Packets",
    description: "Professional real estate calculators for agents. Generate branded investor PDFs, commission splits, net sheets, and more. Save 30+ minutes per deal.",
    keywords: "real estate calculator, cap rate calculator, cash on cash calculator, real estate agent tools, investor analysis, commission split calculator, seller net sheet",
    canonicalUrl: "https://ineednumbers.com/",
    type: "website"
  },
  calculator: {
    title: "Free Real Estate Investment Calculator | I Need Numbers",
    description: "Calculate cap rate, cash-on-cash return, DSCR, and IRR instantly. Generate professional investor packets in PDF format. Free for real estate agents.",
    keywords: "investment calculator, cap rate calculator, cash on cash calculator, DSCR calculator, IRR calculator, real estate analysis",
    canonicalUrl: "https://ineednumbers.com/calculator",
    type: "website"
  },
  tools: {
    title: "Real Estate Agent Tools & Calculators | I Need Numbers",
    description: "Complete toolkit for real estate agents: commission split, affordability, net sheet, and closing date calculators. Professional PDF reports included.",
    keywords: "real estate tools, agent calculators, commission calculator, affordability calculator, closing date calculator, real estate software",
    canonicalUrl: "https://ineednumbers.com/tools",
    type: "website"
  },
  pricing: {
    title: "Pricing Plans | I Need Numbers - Real Estate Agent Tools",
    description: "Choose from Free, Starter ($19/mo), or Pro ($49/mo) plans. Get branded PDFs, unlimited deals, and advanced agent tools. Start free today.",
    keywords: "real estate software pricing, agent tools pricing, real estate calculator pricing, professional real estate tools",
    canonicalUrl: "https://ineednumbers.com/pricing",
    type: "website"
  },
  commissionSplit: {
    title: "Commission Split Calculator | Free Real Estate Tool",
    description: "Calculate your real estate commission splits instantly. Factor in brokerage fees, team splits, and referral costs. Free calculator for agents.",
    keywords: "commission split calculator, real estate commission calculator, brokerage split calculator, agent commission tool",
    canonicalUrl: "https://ineednumbers.com/tools/commission-split",
    type: "website"
  },
  netSheet: {
    title: "Seller Net Sheet Calculator | Free Real Estate Tool",
    description: "Show sellers their bottom line with our free net sheet calculator. Professional PDF reports with itemized costs and proceeds.",
    keywords: "net sheet calculator, seller net sheet, closing cost calculator, real estate net proceeds calculator",
    canonicalUrl: "https://ineednumbers.com/tools/net-sheet",
    type: "website"
  },
  affordability: {
    title: "Mortgage Affordability Calculator | Free Real Estate Tool",
    description: "Help buyers determine what they can afford. Includes taxes, insurance, and DTI calculations. Shareable results for clients.",
    keywords: "affordability calculator, mortgage calculator, home affordability, payment calculator, DTI calculator",
    canonicalUrl: "https://ineednumbers.com/tools/affordability",
    type: "website"
  },
  closingDate: {
    title: "Closing Date Calculator | Free Real Estate Timeline Tool",
    description: "Generate accurate closing timelines with key dates. Auto-adjusts for weekends and holidays. Export to calendar.",
    keywords: "closing date calculator, real estate timeline, closing timeline, contract dates calculator",
    canonicalUrl: "https://ineednumbers.com/tools/closing-date",
    type: "website"
  }
};

// Generate structured data for different content types
export const generateStructuredData = (pageType, additionalData = {}) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "I Need Numbers",
    "url": "https://ineednumbers.com",
    "description": "Professional real estate calculators and tools for agents",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "provider": {
      "@type": "Organization",
      "name": "I Need Numbers",
      "url": "https://ineednumbers.com"
    }
  };

  switch (pageType) {
    case 'calculator':
      return {
        ...baseStructuredData,
        "@type": "SoftwareApplication",
        "name": "Real Estate Investment Calculator",
        "applicationCategory": "FinanceApplication",
        "offers": [
          {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "name": "Free Plan"
          },
          {
            "@type": "Offer",
            "price": "19",
            "priceCurrency": "USD",
            "name": "Starter Plan"
          },
          {
            "@type": "Offer",
            "price": "49",
            "priceCurrency": "USD",
            "name": "Pro Plan"
          }
        ]
      };
    
    case 'tools':
      return {
        ...baseStructuredData,
        "@type": "WebPage",
        "name": "Real Estate Agent Tools",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "SoftwareApplication",
              "name": "Commission Split Calculator",
              "applicationCategory": "FinanceApplication"
            },
            {
              "@type": "SoftwareApplication", 
              "name": "Seller Net Sheet Calculator",
              "applicationCategory": "FinanceApplication"
            },
            {
              "@type": "SoftwareApplication",
              "name": "Affordability Calculator", 
              "applicationCategory": "FinanceApplication"
            }
          ]
        }
      };
      
    case 'organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "I Need Numbers",
        "url": "https://ineednumbers.com",
        "logo": "https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png",
        "description": "Professional real estate calculators and tools for agents",
        "sameAs": [
          "https://ineednumbers.com"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "url": "https://ineednumbers.com/support"
        }
      };
      
    default:
      return baseStructuredData;
  }
};

// SEO component wrapper
export const SEOHelmet = ({ 
  pageKey, 
  customTitle, 
  customDescription, 
  customKeywords,
  structuredData,
  additionalMeta = [] 
}) => {
  const seoInfo = seoData[pageKey] || seoData.home;
  const title = customTitle || seoInfo.title;
  const description = customDescription || seoInfo.description;
  const keywords = customKeywords || seoInfo.keywords;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={seoInfo.canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={seoInfo.type} />
      <meta property="og:url" content={seoInfo.canonicalUrl} />
      <meta property="og:image" content="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" />
      <meta property="og:site_name" content="I Need Numbers" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="I Need Numbers" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="theme-color" content="#2FA163" />
      
      {/* Additional custom meta tags */}
      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};