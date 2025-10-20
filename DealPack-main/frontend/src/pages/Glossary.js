import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Calculator, BookOpen, TrendingUp } from 'lucide-react';

const Glossary = () => {
  const navigate = useNavigate();

  const glossaryTerms = [
    {
      term: "Cap Rate (Capitalization Rate)",
      definition: "Quick, loan-agnostic return. Formula: NOI ÷ Purchase Price. Shows annual return based on purchase price alone.",
      category: "core"
    },
    {
      term: "DSCR (Debt Service Coverage Ratio)",
      definition: "How easily income covers the mortgage. Formula: NOI ÷ Annual Debt Service. Lenders want ≥1.20.",
      category: "core"
    },
    {
      term: "Cash-on-Cash",
      definition: "Annual cash flow vs cash invested. Formula: Annual Cash Flow ÷ Cash Invested. Your actual return on the money you put in.",
      category: "core"
    },
    {
      term: "IRR (Internal Rate of Return)",
      definition: "Time-weighted return including sale; assumption-sensitive. Average yearly return over the entire investment period.",
      category: "core"
    },
    {
      term: "NOI (Net Operating Income)",
      definition: "Income after operating expenses, before loan payments. The property's earning power before financing.",
      category: "income"
    },
    {
      term: "EGI (Effective Gross Income)",
      definition: "(Rent + Other Income) × (1 − Vacancy %). What you actually collect after accounting for vacancy.",
      category: "income"
    },
    {
      term: "Break-even Occupancy",
      definition: "(Operating Expenses + Annual Debt Service) ÷ Potential Gross Income. Minimum occupancy needed to cover all costs.",
      category: "analysis"
    },
    {
      term: "MOIC (Multiple on Invested Capital)",
      definition: "Total returned ÷ cash invested. How many times your initial investment you get back.",
      category: "analysis"
    },
    {
      term: "Payback Period",
      definition: "Years to recoup cash invested (Cash Invested ÷ Annual Cash Flow). How long until you break even.",
      category: "analysis"
    },
    {
      term: "LTV (Loan-to-Value)",
      definition: "Loan ÷ value (e.g., 75–80% common). How much of the property is financed vs. paid in cash.",
      category: "financing"
    },
    {
      term: "Amortization",
      definition: "Years to pay down loan (e.g., 30). The loan term over which payments are calculated.",
      category: "financing"
    },
    {
      term: "Interest-Only Period",
      definition: "Months with interest-only payments. Period where you only pay interest, not principal.",
      category: "financing"
    },
    {
      term: "Exit Cap Rate",
      definition: "Sale ≈ next year's NOI ÷ exit cap; use slightly higher than entry to be conservative. Expected cap rate when you sell.",
      category: "analysis"
    },
    {
      term: "Vacancy Rate",
      definition: "Expected empty time/unpaid rent. Percentage of time property won't generate income.",
      category: "operations"
    },
    {
      term: "Management Fee",
      definition: "% of EGI (often 8–10%). Cost to have someone else manage the property.",
      category: "operations"
    },
    {
      term: "Repairs vs CapEx",
      definition: "Small ongoing fixes vs big, infrequent items (roof/HVAC). Different types of property expenses.",
      category: "operations"
    },
    {
      term: "PGI (Potential Gross Income)",
      definition: "Rent if fully occupied (before vacancy). Maximum possible rental income.",
      category: "income"
    },
    {
      term: "Operating Expenses (OpEx)",
      definition: "Regular costs (taxes, insurance, utilities, management, repairs, CapEx reserve, HOA, misc). Not OpEx: mortgage, depreciation, income taxes.",
      category: "operations"
    },
    {
      term: "GRM (Gross Rent Multiplier)",
      definition: "Price ÷ annual rent; quick screen. Simple way to compare property values.",
      category: "analysis"
    }
  ];

  const categories = {
    core: { title: "Core Metrics", color: "bg-blue-100 text-blue-800", icon: <TrendingUp className="w-4 h-4" /> },
    income: { title: "Income Terms", color: "bg-green-100 text-green-800", icon: <Calculator className="w-4 h-4" /> },
    financing: { title: "Financing", color: "bg-purple-100 text-purple-800", icon: <Calculator className="w-4 h-4" /> },
    operations: { title: "Operations", color: "bg-orange-100 text-orange-800", icon: <Calculator className="w-4 h-4" /> },
    analysis: { title: "Analysis", color: "bg-indigo-100 text-indigo-800", icon: <Calculator className="w-4 h-4" /> }
  };

  const groupedTerms = glossaryTerms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_reipro/artifacts/0kmyam6x_Logo-removebg-preview.png" 
                  alt="DealPack Real Estate" 
                  className="h-6 w-auto"
                />
                <h1 className="text-xl font-bold">Real Estate Glossary</h1>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Plain English
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Real Estate Investment Terms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every term explained in plain English. No jargon, no confusion—just clear definitions 
            that help you understand the numbers.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/calculator')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              Try the Calculator
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/sample-pdf')}
            >
              See Sample PDF
            </Button>
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-12">
          {Object.entries(groupedTerms).map(([categoryKey, terms]) => {
            const category = categories[categoryKey];
            return (
              <div key={categoryKey}>
                <div className="flex items-center space-x-3 mb-6">
                  <Badge className={`${category.color} flex items-center space-x-1`}>
                    {category.icon}
                    <span>{category.title}</span>
                  </Badge>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {terms.map((term, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {term.term}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {term.definition}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-16">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-yellow-800">Friendly Disclaimer</h3>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  These are educational summaries to help you understand real estate investment concepts. 
                  Always verify definitions and calculations with local market experts, attorneys, and 
                  financial advisors. Real estate markets and regulations vary by location.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to put these terms to work?
          </h2>
          <p className="text-gray-600">
            Use our free calculator to see these metrics in action with real property data.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              onClick={() => navigate('/calculator')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              Try the Free Calculator
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;