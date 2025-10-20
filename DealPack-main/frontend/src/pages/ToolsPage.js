import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ImageModal from '../components/ui/image-modal';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  ArrowLeft,
  Home,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ZoomIn,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const ToolsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalImage, setModalImage] = useState(null);

  const openImageModal = (src, alt, title) => {
    setModalImage({ src, alt, title });
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const tools = [
    {
      id: 1,
      name: "Investor Deal PDF Generator",
      shortDescription: "Create branded deal packets and PDFs in seconds.",
      fullDescription: "Transform property data into professional, investor-ready deal packets with just a few clicks. Our intelligent PDF generator creates comprehensive analysis reports featuring cap rates, cash-on-cash returns, DSCR calculations, and 5-year projections. Every PDF is fully branded with your logo, contact information, and professional styling that impresses clients and investors alike.",
      useCase: "Package property deals into investor-ready PDFs in seconds.",
      type: "Free",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-blue-500",
      route: "/calculator",
      available: true,
      features: [
        "Comprehensive financial analysis with key metrics",
        "Professional branding with your logo and contact info",
        "Investor-ready formatting and presentation",
        "5-year projection calculations",
        "Export-ready PDF generation"
      ]
    },
    {
      id: 2,
      name: "Mortgage & Affordability Calculator",
      shortDescription: "Show buyers instantly what they can afford.",
      fullDescription: "Help your buyers understand their purchasing power with precise affordability calculations. This comprehensive tool factors in income, debts, down payment, interest rates, taxes, insurance, HOA fees, and PMI to determine exactly what your clients can afford. Get instant results with clear explanations that make complex financial concepts easy to understand.",
      useCase: "Show buyers exactly what they can afford during a showing.",
      type: "Free",
      icon: <Home className="w-8 h-8" />,
      color: "bg-purple-500",
      route: "/tools/affordability",
      available: true,
      features: [
        "PITI calculations (Principal, Interest, Taxes, Insurance)",
        "PMI and HOA fee considerations",
        "Debt-to-income ratio analysis",
        "Loan-to-value calculations",
        "Multiple loan scenario comparisons"
      ]
    },
    {
      id: 3,
      name: "Commission Split Calculator",
      shortDescription: "Quickly see your exact take-home.",
      fullDescription: "Calculate your exact commission take-home amount with precision. Factor in your brokerage split, referral fees, team splits, transaction fees, and any other deductions. Know your numbers before you even list the property, helping you plan your finances and set realistic income expectations for each deal.",
      useCase: "Quickly calculate your commission split on the go.",
      type: "Free",
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-green-500",
      route: "/tools/commission-split",
      available: true,
      features: [
        "Accurate commission split calculations",
        "Brokerage and team split considerations",
        "Referral fee deductions",
        "Transaction fee calculations",
        "Net take-home projections"
      ]
    },
    {
      id: 4,
      name: "Seller Net Sheet Estimator",
      shortDescription: "Answer \"How much will I net?\" instantly.",
      fullDescription: "Provide sellers with immediate clarity on their net proceeds from a sale. Calculate exact amounts after agent commissions, closing costs, title fees, transfer taxes, loan payoffs, and other selling expenses. This tool helps sellers make informed decisions about pricing, timing, and whether to sell at all.",
      useCase: "Give sellers instant clarity on what they'll net after fees.",
      type: "Free",
      icon: <Calculator className="w-8 h-8" />,
      color: "bg-orange-500",
      route: "/tools/net-sheet",
      available: true,
      features: [
        "Comprehensive closing cost calculations",
        "Agent commission deductions",
        "Loan payoff considerations",
        "Title and transfer fee estimates",
        "Net proceeds projections"
      ]
    },
    {
      id: 5,
      name: "Closing Date Calculator",
      shortDescription: "Track your home purchase timeline and milestones.",
      fullDescription: "Keep your home purchase on track with our comprehensive closing date calculator. Input your contract date, key milestone timings, and closing date to generate a visual timeline that shows when inspections, appraisals, repair requests, and other critical deadlines occur. Perfect for keeping buyers informed and ensuring nothing falls through the cracks during the purchasing process.",
      useCase: "Show buyers exactly when each milestone needs to happen during their home purchase.",
      type: "Free",
      icon: <Calendar className="w-8 h-8" />,
      color: "bg-purple-500",
      route: "/tools/closing-date",
      available: true,
      features: [
        "Visual timeline with all purchase milestones",
        "Customizable milestone timing",
        "Due diligence period tracking",
        "Client-friendly milestone descriptions",
        "PDF timeline generation (Premium)",
        "Shareable timeline summaries (Premium)"
      ]
    },
    {
      id: 6,
      name: "Agent P&L Tracker",
      shortDescription: "Track your income, expenses, and net profit with clean reporting.",
      fullDescription: "Take control of your real estate business finances with our comprehensive profit and loss tracking system. Easily input commission income, referral fees, marketing expenses, brokerage costs, and all business-related expenditures. Generate professional P&L statements, analyze spending patterns, and get tax-ready reports that help you understand your business performance and make informed financial decisions.",
      useCase: "Track your income, expenses, and net profit to stay on top of your business.",
      type: "Pro",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-primary",
      route: "/tools/agent-pl-tracker",
      available: true,  
      features: [
        "Income and expense tracking by category",
        "Professional P&L statement generation",
        "Monthly and yearly financial summaries",
        "Tax-ready export capabilities",
        "Business performance analytics",
        "Category-based spending insights"
      ]
    },
    {
      id: 7,
      name: "Action Tracker",
      shortDescription: "Hit your goal by doing the right things daily.",
      fullDescription: "Transform your monthly goals into actionable daily targets with our intelligent action tracking system. Stop the guesswork and busy work – our Action Tracker converts your income goals into specific daily activities like prospecting calls, appointments, and offers. Track your progress with visual thermometers, get insights on productive vs. busy work, and receive smart suggestions for tomorrow's Top 3 actions. It's the difference between being busy and being profitable.",
      useCase: "Convert a $50K monthly goal into 15 daily calls, 3 appointments, and 1 offer – then track your progress.",
      type: "Pro",
      icon: <Target className="w-8 h-8" />,
      color: "bg-orange-500",
      route: "/dashboard?tab=actiontracker",
      available: true,
      image: "https://customer-assets.emergentagent.com/job_inntracker/artifacts/fyzqkaec_image.png",
      features: [
        "Goal-to-activity conversion (monthly goals → daily targets)",
        "Daily activity tracking with progress thermometers",
        "Busy work detection and productivity insights",
        "Smart suggestions for tomorrow's Top 3 actions",
        "Activity pace vs. money pace analysis",
        "Weekly and monthly progress reports"
      ]
    }
  ];

  const isPro = user?.plan === 'PRO';
  const isStarter = user?.plan === 'STARTER';

  const canUseTool = (tool) => {
    if (tool.type === 'Free') return true;
    if (tool.type === 'Pro') return isPro;
    return false;
  };

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
                Back to Home
              </Button>
              
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-deep-forest">Tools</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/pricing')}>
                View Pricing
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                My Account
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-deep-forest mb-4 font-poppins">
            Real Estate Agent Tools
          </h1>
          <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
            Professional tools designed specifically for real estate agents. From quick calculations to comprehensive reports, everything you need to serve your clients better.
          </p>
        </div>

        {/* Tools Sections */}
        <div className="space-y-16">
          {tools.map((tool) => (
            <section key={tool.id} id={`tool-${tool.id}`} className="scroll-mt-24">
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-2xl ${tool.color} flex items-center justify-center text-white`}>
                            {tool.icon}
                          </div>
                          <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-deep-forest">
                              {tool.name}
                            </h2>
                            <Badge 
                              className={`mt-2 ${tool.type === 'Free' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gradient-to-r from-primary to-secondary text-white'}`}
                            >
                              {tool.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-lg text-neutral-dark leading-relaxed">
                          {tool.fullDescription}
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">Example Use Case:</h4>
                          <p className="text-gray-700 italic">"{tool.useCase}"</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-deep-forest">Key Features:</h4>
                        <div className="grid gap-2">
                          {tool.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {canUseTool(tool) ? (
                          <Button 
                            onClick={() => navigate(tool.route)}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 text-white"
                            size="lg"
                          >
                            Use Tool
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => navigate('/pricing')}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 text-white"
                            size="lg"
                          >
                            Upgrade to {tool.type}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="bg-white rounded-xl shadow-lg p-6 border">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">Tool Preview</h4>
                            <Badge variant="outline" className="text-xs">
                              {tool.type}
                            </Badge>
                          </div>
                          
                          {/* Tool-specific preview content */}
                          {tool.id === 1 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_property-analysis/artifacts/sp1jqtoo_Investor.png",
                                  "Investor Deal PDF Generator Interface",
                                  "Investor Deal PDF Generator - Full Interface"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_property-analysis/artifacts/sp1jqtoo_Investor.png"
                                  alt="Investor Deal PDF Generator Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Professional Investment Analysis</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 2 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_property-analysis/artifacts/hprkrz8p_Mortg.png",
                                  "Mortgage & Affordability Calculator Interface",
                                  "Mortgage & Affordability Calculator - Full Interface"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_property-analysis/artifacts/hprkrz8p_Mortg.png"
                                  alt="Mortgage & Affordability Calculator Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Mortgage Payment Calculator</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 3 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_property-analysis/artifacts/2g5ghstx_Comm.png",
                                  "Commission Split Calculator Interface",
                                  "Commission Split Calculator - Full Interface"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_property-analysis/artifacts/2g5ghstx_Comm.png"
                                  alt="Commission Split Calculator Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Commission Split Calculator</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 4 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_property-analysis/artifacts/4aqyctk3_Seller%20Net.png",
                                  "Seller Net Sheet Estimator Interface",
                                  "Seller Net Sheet Estimator - Full Interface"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_property-analysis/artifacts/4aqyctk3_Seller%20Net.png"
                                  alt="Seller Net Sheet Estimator Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Seller Net Sheet Calculator</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 5 && (
                            <div className="space-y-3">
                              <div className="bg-gray-100 rounded-lg p-4 border">
                                <div className="space-y-3">
                                  <div className="text-center font-medium text-gray-900">Home Purchase Timeline</div>
                                  
                                  {/* Mock timeline visualization */}
                                  <div className="flex items-center justify-between space-x-2">
                                    <div className="flex flex-col items-center">
                                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1 text-center">
                                        <div>Under</div>
                                        <div>Contract</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1 text-center">
                                        <div>Home</div>
                                        <div>Inspection</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1 text-center">
                                        <div>Final</div>
                                        <div>Walkthrough</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    
                                    <div className="flex flex-col items-center">
                                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1 text-center">
                                        <div>Closing</div>
                                        <div>Date</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Visual Purchase Timeline</div>
                                <div className="text-xs text-gray-500">Track all important milestones</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 6 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_report-rescue-2/artifacts/cajzc1a4_P%26L.png",
                                  "Agent P&L Tracker Interface",
                                  "Agent P&L Tracker - Business Dashboard"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_report-rescue-2/artifacts/cajzc1a4_P%26L.png"
                                  alt="Agent P&L Tracker Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Business Dashboard & P&L Tracking</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                          
                          {tool.id === 7 && (
                            <div className="space-y-3">
                              <div 
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(
                                  "https://customer-assets.emergentagent.com/job_inntracker/artifacts/fyzqkaec_image.png",
                                  "Action Tracker Interface",
                                  "Action Tracker - Goal-to-Activity Dashboard"
                                )}
                              >
                                <img 
                                  src="https://customer-assets.emergentagent.com/job_inntracker/artifacts/fyzqkaec_image.png"
                                  alt="Action Tracker Interface"
                                  className="w-full h-auto rounded-lg border transition-all duration-200 group-hover:opacity-90 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-full">
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mt-2">Daily Action Tracking Dashboard</div>
                                <div className="text-xs text-gray-500">Click to view larger image</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!canUseTool(tool) && (
                        <div className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <div className="bg-white/90 p-4 rounded-lg text-center">
                            <div className="text-sm font-medium text-gray-900 mb-2">Upgrade Required</div>
                            <Button size="sm" onClick={() => navigate('/pricing')}>
                              View Plans
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 py-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl">
          <h2 className="text-3xl font-bold text-deep-forest mb-4">
            Ready to Power Up Your Business?
          </h2>
          <p className="text-xl text-neutral-dark mb-8 max-w-2xl mx-auto">
            Join thousands of agents using professional tools to close more deals and serve clients better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={closeImageModal}
          src={modalImage.src}
          alt={modalImage.alt}
          title={modalImage.title}
        />
      )}
    </div>
  );
};

export default ToolsPage;