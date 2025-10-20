import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  Home,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Calendar,
  Target
} from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { SEOHelmet, generateStructuredData } from '../utils/seoUtils';
import LazyImage from '../components/LazyImage';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const performanceMetrics = usePerformanceMonitor();

  // Preload critical images
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = 'https://customer-assets.emergentagent.com/job_property-analysis/artifacts/2p2q1un1_Generated%20Image%20September%2020%2C%202025%20-%2010_20AM.png';
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    }
  }, []);

  const tools = [
    {
      id: 1,
      name: "Investor Deal PDF Generator",
      tagline: "Turn property numbers into polished investor packets—fast.",
      bullets: [
        "Auto-calculates cap rate, cash-on-cash, DSCR & annual cash flow.",
        "One click → branded, client-ready PDF you can text or email.",
        "Save versions, duplicate deals, and compare side-by-side."
      ],
      microProof: "Agents report < 5 min per packet after setup.",
      type: "Free",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
      route: "/calculator",
      available: true,
      primaryCTA: "Create Investor Packet"
    },
    {
      id: 3,
      name: "Mortgage & Affordability Calculator",
      tagline: '"What can I afford?"—answer it in seconds, on your phone.',
      bullets: [
        "Payment w/ taxes & insurance; optional DTI check for realism.",
        "Share a link with buyers so they can play with scenarios.",
        "Save recent calcs to reuse during showings."
      ],
      microProof: "Cuts pre-tour guesswork by 70% (avg).",
      type: "Free",
      icon: <Home className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-700",
      route: "/tools/affordability",
      available: true,
      primaryCTA: "Open Affordability"
    },
    {
      id: 4,
      name: "Commission Split Calculator",
      tagline: "Know your take-home before you take the deal.",
      bullets: [
        "Brokerage split, team split, referral %, and fixed fees—fully modeled.",
        "See net on multiple scenarios; save your defaults.",
        '"What if?" slider for quick negotiation coaching.'
      ],
      microProof: 'Prevents surprise fee "gotchas" at closing.',
      type: "Free",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-100 text-green-700",
      route: "/tools/commission-split",
      available: true,
      primaryCTA: "Run My Split"
    },
    {
      id: 5,
      name: "Seller Net Sheet Estimator",
      tagline: "Show sellers their bottom line—clearly and credibly.",
      bullets: [
        "Itemizes payoff, fees, taxes, concessions—no spreadsheet required.",
        "Multiple offer scenarios (price vs. credits vs. closing dates).",
        "Print or share a clean, branded summary."
      ],
      microProof: "Speeds listing decisions at the kitchen table.",
      type: "Free",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-700",
      route: "/tools/net-sheet",
      available: true,
      primaryCTA: "Estimate Net"
    },
    {
      id: 6,
      name: "Closing Date Calculator",
      tagline: "Deadlines that never slip.",
      bullets: [
        "Auto-generates key dates (inspection, financing, option, closing).",
        "Adjust weekends/holidays with one toggle.",
        "Export to calendar and share with clients."
      ],
      microProof: "Eliminates missed-deadline fire drills.",
      type: "Free",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-700",
      route: "/tools/closing-date",
      available: true,
      primaryCTA: "Plan Timeline"
    }
  ];

  const reasons = [
    "Plain English explanations for every calculation",
    "Professional results your clients will trust",
    "Save 30+ minutes per deal with instant calculations",
    "No confusing jargon or complex interfaces"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet 
        pageKey="home"
        structuredData={generateStructuredData('organization')}
        additionalMeta={[
          { name: 'author', content: 'I Need Numbers' },
          { name: 'coverage', content: 'Worldwide' },
          { name: 'distribution', content: 'Global' },
          { name: 'rating', content: 'General' },
          { name: 'revisit-after', content: '7 days' },
          { property: 'article:author', content: 'I Need Numbers' },
          { property: 'article:publisher', content: 'https://ineednumbers.com' }
        ]}
      />
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                alt="I Need Numbers" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-primary tracking-wide font-poppins">I NEED NUMBERS</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/')}
                className="text-deep-forest hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/tools')}
                className="text-deep-forest hover:text-primary transition-colors font-medium"
              >
                Tools
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="text-deep-forest hover:text-primary transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => navigate('/support')}
                className="text-deep-forest hover:text-primary transition-colors font-medium"
              >
                Support
              </button>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="text-deep-forest hover:text-primary"
                  >
                    My Account
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/auth/login')}
                    className="text-deep-forest hover:text-primary"
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-neutral-light via-white to-neutral-medium overflow-hidden">
        {/* Fairy Logo Accent */}
        <div className="absolute top-20 right-20 opacity-20 z-10">
          <Sparkles className="w-16 h-16 text-primary animate-pulse" />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="relative">
                <h1 className="text-4xl lg:text-6xl font-bold text-deep-forest mb-6 font-poppins leading-tight">
                  Ever catch yourself saying, "I just need the numbers"?
                </h1>
                {/* Small Fairy Logo Accent near headline */}
                <div className="absolute -top-4 -right-8 lg:-right-16">
                  <Sparkles className="w-8 h-8 text-secondary animate-bounce" />
                </div>
              </div>
              
              <div className="text-xl lg:text-2xl text-neutral-dark space-y-6">
                <p className="leading-relaxed" style={{ lineHeight: '1.7' }}>
                  From commission splits to ROI calculators, seller net sheets to your profit & loss — <span className="font-semibold text-primary">I Need Numbers</span> helps real estate agents cut the guesswork and see the truth behind every deal, all powered by A.I.
                </p>
                
                <p className="leading-relaxed" style={{ lineHeight: '1.7' }}>
                  You don't need another CRM — you need clarity.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-8">
                <Button 
                  size="lg"
                  onClick={() => navigate('/tools')}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-8 py-4"
                >
                  Explore Free Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <p className="text-lg text-neutral-dark mt-6 font-medium text-center lg:text-left">
                Tools Made for Real Estate Agents, by Real Estate Agents
              </p>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                <LazyImage
                  src="https://customer-assets.emergentagent.com/job_property-analysis/artifacts/2p2q1un1_Generated%20Image%20September%2020%2C%202025%20-%2010_20AM.png"
                  alt="Real estate agent working with clients using professional calculators and tools"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Real Estate Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Coach Promotion Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-deep-forest font-poppins">
                  Meet Your AI Sales Coach
                </h2>
              </div>
              
              <p className="text-xl text-neutral-dark leading-relaxed max-w-3xl mx-auto">
                Get personalized insights that analyze your goals, track your activities, and give you strategic advice 24/7. 
                Never miss opportunities again with AI-powered coaching that learns from your success patterns.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-deep-forest">Smart Goal Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-dark text-center">Analyzes your progress and tells you exactly what to focus on daily</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-deep-forest">Pattern Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-dark text-center">Identifies what's working in your business and scales your success</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-6 h-6 text-emerald-700" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-deep-forest">Daily Action Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-dark text-center">Provides specific recommendations to maximize your productivity</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-6 py-3 border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium text-deep-forest">Available with Pro Plan - Try Free for 7 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-deep-forest mb-4 font-poppins">
              All the Tools You Need, Right at Your Fingertips
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 relative"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center`}>
                      {tool.icon}
                    </div>
                    <Badge 
                      className={`${tool.type === 'Free' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gradient-to-r from-primary to-secondary text-white'}`}
                    >
                      {tool.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors text-left">
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-base mb-4 leading-relaxed text-left">
                    <p className="font-medium text-deep-forest mb-3">{tool.tagline}</p>
                    <ul className="space-y-2 mb-4">
                      {tool.bullets.map((bullet, index) => (
                        <li key={index} className="text-sm text-neutral-dark flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 italic">{tool.microProof}</p>
                  </div>
                  
                  {/* Action Tracker Explanation */}
                  {tool.isExplanation && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {tool.explanationText}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate(tool.route)}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                      disabled={!tool.available}
                    >
                      {tool.primaryCTA || tool.id === 2 ? 'Go to Action Tracker' : 'Use Tool'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/tools#tool-${tool.id}`)}
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Agents Love It Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-deep-forest mb-4 font-poppins">
              No Jargon. Just Results.
            </h2>
            <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
              Every tool explains the numbers in plain English—so you and your clients always know exactly what's happening.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-lg text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Upsell Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-emerald-700 text-white relative overflow-hidden">
        {/* Fairy Logo Accent */}
        <div className="absolute bottom-10 left-10 opacity-20">
          <Sparkles className="w-20 h-20 animate-pulse" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold font-poppins">
              Unlock More Power with Pro
            </h2>
            <p className="text-xl text-green-100 leading-relaxed">
              Upgrade for advanced tools like the Agent P&L Tracker and Investor Deal PDFs—plus everything in Free.
            </p>
            
            {/* Pro Tools Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              {/* Action Tracker Card */}
              <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      Pro
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-left text-deep-forest">
                    Action Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-base mb-4 leading-relaxed text-left flex-1">
                    <p className="font-medium text-deep-forest mb-3">Hit your goal by doing the right things daily.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Convert monthly goal → daily activity targets (calls, appts, offers).</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Flags "busy work" and suggests tomorrow's Top 3 actions.</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Progress thermometers for activity pace & money pace.</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-600 italic">Users add ~2 extra appointments/week on average.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/dashboard?tab=actiontracker')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Track Today
                  </Button>
                </CardContent>
              </Card>

              {/* Agent P&L Tracker Card */}
              <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      Pro
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-left text-deep-forest">
                    Agent P&L Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-base mb-4 leading-relaxed text-left flex-1">
                    <p className="font-medium text-deep-forest mb-3">Know your real profit—not just your GCI.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Simple manual entry; income/expense categories tailored to agents.</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Month & YTD KPIs, charts, and exportable reports (PDF/XLS).</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Smart insights: $/high-value hour, burn rate, tax set-aside hint.</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-600 italic">10-minute weekly habit → fewer end-of-year surprises.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/tools/agent-pl-tracker')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Open P&L
                  </Button>
                </CardContent>
              </Card>

              {/* AI Sales Coach Card */}
              <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      Pro
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-left text-deep-forest">
                    AI Sales Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-base mb-4 leading-relaxed text-left flex-1">
                    <p className="font-medium text-deep-forest mb-3">Your personal coach that analyzes your performance 24/7.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Tracks your goals, activities, and performance patterns automatically.</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Provides daily insights and strategic recommendations.</span>
                      </li>
                      <li className="text-sm text-neutral-dark flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Identifies what's working and scales your successful activities.</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-600 italic">Never miss opportunities with AI-powered guidance.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Try AI Coach
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate('/pricing')}
                className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4"
              >
                Upgrade to Pro
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-deep-forest mb-4 font-poppins">
              Choose Your Plan
            </h2>
            <p className="text-xl text-neutral-dark">
              Start with our free tools and upgrade when you're ready for more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:border-green-200 transition-colors flex flex-col">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-3xl font-bold text-green-600">$0</div>
                <p className="text-sm text-gray-600">Forever</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Commission Split Calculator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Seller Net Sheet Estimator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Mortgage & Affordability Calculator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Investor Deal PDF Generator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Closing Date Calculator</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-auto" onClick={() => navigate('/pricing')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="border-2 hover:border-primary/20 transition-colors flex flex-col">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="text-3xl font-bold text-primary">$19</div>
                <p className="text-sm text-gray-600">per month</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Everything in Free</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Branded PDFs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Save up to 10 deals</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-secondary mt-auto" onClick={() => navigate('/pricing')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-secondary/5 relative flex flex-col">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-3xl font-bold text-primary">$49</div>
                <p className="text-sm text-gray-600">per month</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Everything in Free + Starter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Agent P&L Tracker</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Action Tracker</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Unlimited deals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">🤖 AI Sales Coach</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Advanced features</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 mt-auto" onClick={() => navigate('/pricing')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-neutral-dark">
              <strong>You can cancel anytime.</strong> You will not be charged for subsequent months.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;