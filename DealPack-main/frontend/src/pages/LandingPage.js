import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { Calculator, TrendingUp, FileText, Users, DollarSign, BarChart3, Clock, Target, Shield, CheckCircle, Settings, User, Plus, Home, Share2, Briefcase, Upload, Calendar, Download, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PlanPreviewRibbon from '../components/PlanPreviewRibbon';
import { usePlanPreview } from '../hooks/usePlanPreview';
import { toast } from 'sonner';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { effectivePlan, previewPlan, isPreviewMode, clearPreview } = usePlanPreview(user?.plan);
  const [showSamplePDF, setShowSamplePDF] = useState(false);
  const [userStats, setUserStats] = useState({
    dealCount: 0,
    pdfGenerated: false,
    agentComplete: false
  });

  // Load user stats for dashboard
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Mock data for demo - in real app, fetch from API
      setUserStats({
        dealCount: 3,
        pdfGenerated: true,
        agentComplete: true
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const isPro = effectivePlan === 'PRO';
  const isStarter = effectivePlan === 'STARTER';
  const isPaid = isPro || isStarter;

  // Handle PDF download
  const handleDownloadPDF = (deal) => {
    // In a real app, this would generate/fetch the actual PDF for this deal
    // For now, we'll show a sample PDF or generate a mock PDF
    toast.success(`Downloading PDF for ${deal.address}`);
    
    // Mock PDF download - in real app, this would be an API call
    // window.open('/api/deals/{dealId}/pdf', '_blank');
    
    // For demo, redirect to sample PDF
    window.open('/sample-pdf', '_blank');
  };

  // Trust chips content
  const trustChips = [
    { text: "Explains terms", icon: <FileText className="w-4 h-4" /> },
    { text: "Agent-branded PDF", icon: <Target className="w-4 h-4" /> },
    { text: "Free one-off", icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium">
      {/* Plan Preview Ribbon */}
      {isPreviewMode && (
        <PlanPreviewRibbon previewPlan={previewPlan} onClear={clearPreview} />
      )}

      {/* Navigation */}
      <nav className={`bg-white/90 backdrop-blur-md border-b border-neutral-medium/20 ${isPreviewMode ? 'mt-12' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                alt="I Need Numbers" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-primary tracking-wide font-poppins">I NEED NUMBERS</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-deep-forest hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-deep-forest hover:text-primary transition-colors">Pricing</a>
              <button 
                onClick={() => navigate('/glossary')}
                className="text-deep-forest hover:text-primary transition-colors"
              >
                Glossary
              </button>
              <button 
                onClick={() => navigate('/sample-pdf')}
                className="text-deep-forest hover:text-primary transition-colors"
              >
                Sample PDF
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigate('/settings')}
                    className="text-deep-forest hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-deep-forest hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </button>
                  <Button 
                    onClick={() => navigate('/calculator')}
                    className="bg-primary hover:bg-secondary text-white"
                  >
                    Calculator
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/auth/login')}
                    className="text-deep-forest hover:text-primary"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Authenticated User Dashboard */}
      {user ? (
        <div className="py-8">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-deep-forest mb-2">
                    Welcome back, {user.full_name || user.email?.split('@')[0] || 'there'}!
                  </h1>
                  <p className="text-lg text-neutral-dark">
                    {effectivePlan === 'FREE' ? 'Ready to create your next deal analysis?' : 'Your investor packets are waiting.'}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge className={`text-lg px-4 py-2 ${
                    effectivePlan === 'PRO' ? 'bg-purple-100 text-purple-800' :
                    effectivePlan === 'STARTER' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {effectivePlan} Plan
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-dark">Saved Deals</p>
                      <p className="text-3xl font-bold text-deep-forest">{userStats.dealCount}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  {effectivePlan === 'STARTER' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage</span>
                        <span>{userStats.dealCount}/10</span>
                      </div>
                      <Progress value={(userStats.dealCount / 10) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-dark">PDFs Generated</p>
                      <p className="text-3xl font-bold text-deep-forest">
                        {userStats.pdfGenerated ? userStats.dealCount * 2 : 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-dark">This Month</p>
                      <p className="text-3xl font-bold text-deep-forest">
                        {Math.floor(userStats.dealCount / 2) || 1}
                      </p>
                      <p className="text-xs text-neutral-dark">deals analyzed</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Start your analysis or manage your deals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate('/calculator')}
                      className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-primary to-secondary"
                    >
                      <Calculator className="w-6 h-6 mb-2" />
                      <span>New Deal</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/sample-pdf')}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <FileText className="w-6 h-6 mb-2" />
                      <span>Sample PDF</span>
                    </Button>
                    {isPaid && (
                      <Button 
                        variant="outline"
                        onClick={() => toast.info('Portfolio feature coming soon!')}
                        className="h-20 flex flex-col items-center justify-center"
                      >
                        <Briefcase className="w-6 h-6 mb-2" />
                        <span>Portfolio</span>
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/settings')}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Settings className="w-6 h-6 mb-2" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity / Plan Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {effectivePlan === 'FREE' ? 'Upgrade Your Plan' : 'Your Plan'}
                  </CardTitle>
                  <CardDescription>
                    {effectivePlan === 'FREE' ? 'Unlock branded PDFs and more' : 'Plan details and usage'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {effectivePlan === 'FREE' ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Upgrade to get:</h4>
                        <ul className="text-sm space-y-1 text-neutral-dark">
                          <li>• Branded PDFs with your logo</li>
                          <li>• Save and share deal links</li>
                          <li>• Professional contact info</li>
                          <li>• Portfolio management</li>
                        </ul>
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/welcome')}
                          className="px-8"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-green-800">{effectivePlan} Plan Active</h4>
                          <p className="text-sm text-green-600">
                            {effectivePlan === 'PRO' ? 'Unlimited deals and features' : `${10 - userStats.dealCount} deals remaining`}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/account')}
                          className="flex-1"
                        >
                          Manage Account
                        </Button>
                        {effectivePlan === 'STARTER' && (
                          <Button 
                            onClick={() => navigate('/pricing')}
                            className="flex-1"
                          >
                            Upgrade to Pro
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Getting Started / Tips */}
            {userStats.dealCount === 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Get Started
                  </CardTitle>
                  <CardDescription>Complete these steps to make the most of I Need Numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${userStats.agentComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-center mb-3">
                        {userStats.agentComplete ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2" />
                        )}
                        <h4 className="font-semibold">Add Your Info</h4>
                      </div>
                      <p className="text-sm text-neutral-dark mb-3">Set up your agent details for branded PDFs</p>
                      <Button 
                        size="sm" 
                        variant={userStats.agentComplete ? "outline" : "default"}
                        onClick={() => navigate('/settings')}
                        className={userStats.agentComplete ? "" : "bg-primary"}
                      >
                        {userStats.agentComplete ? "Update Info" : "Add Info"}
                      </Button>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${userStats.dealCount > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-center mb-3">
                        {userStats.dealCount > 0 ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2" />
                        )}
                        <h4 className="font-semibold">Create Deal</h4>
                      </div>
                      <p className="text-sm text-neutral-dark mb-3">Analyze your first investment property</p>
                      <Button 
                        size="sm" 
                        variant={userStats.dealCount > 0 ? "outline" : "default"}
                        onClick={() => navigate('/calculator')}
                        className={userStats.dealCount > 0 ? "" : "bg-primary"}
                      >
                        {userStats.dealCount > 0 ? "New Deal" : "Start Analysis"}
                      </Button>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${userStats.pdfGenerated ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-center mb-3">
                        {userStats.pdfGenerated ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2" />
                        )}
                        <h4 className="font-semibold">Generate PDF</h4>
                      </div>
                      <p className="text-sm text-neutral-dark mb-3">Create your first investor packet</p>
                      <Button 
                        size="sm" 
                        variant={userStats.pdfGenerated ? "outline" : "default"}
                        onClick={() => navigate('/sample-pdf')}
                        className={userStats.pdfGenerated ? "" : "bg-primary"}
                      >
                        {userStats.pdfGenerated ? "View Sample" : "See Example"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Deals */}
            {userStats.dealCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-2" />
                      Recent Deals
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/calculator')}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Deal
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Mock recent deals */}
                    {[
                      { address: "123 Main St, Austin, TX", date: "2 days ago", capRate: "7.2%", id: "deal-1" },
                      { address: "456 Oak Ave, Dallas, TX", date: "1 week ago", capRate: "6.8%", id: "deal-2" },
                      { address: "789 Pine Dr, Houston, TX", date: "2 weeks ago", capRate: "8.1%", id: "deal-3" }
                    ].slice(0, userStats.dealCount).map((deal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{deal.address}</p>
                          <p className="text-sm text-neutral-dark">{deal.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-3">
                            <p className="font-semibold text-green-600">{deal.capRate}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPDF(deal)}
                            className="h-8 px-3"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => navigate('/calculator')}
                            className="h-8 px-3"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-deep-forest leading-tight font-poppins">
                  Investor packets in minutes. The math—done for you.
                </h1>
                <p className="text-xl text-neutral-dark leading-relaxed">
                  Paste a listing or type the basics. Get cap rate, CoC, DSCR, IRR — and a branded PDF agents can share.
                </p>
                
                {/* Trust Chips */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {trustChips.map((chip, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-neutral-medium shadow-sm">
                      <span className="text-primary">{chip.icon}</span>
                      <span className="text-sm font-medium text-deep-forest">{chip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/calculator')}
                  className="bg-primary hover:bg-secondary text-white text-lg px-8 py-4 font-poppins"
                >
                  Try it free
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/sample-pdf')}
                  className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-poppins"
                >
                  See a sample PDF
                </Button>
              </div>
            </div>

            {/* Hero Demo/Image */}
            <div className="relative">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/7647207/pexels-photo-7647207.jpeg" 
                  alt="Real estate agent meeting with couple discussing investment documents"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/20 to-transparent rounded-2xl"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Coach Promotion Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white/20 rounded-full p-3 mr-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold">Meet Your AI Sales Coach</h2>
              </div>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Get personalized insights that analyze your goals, track your activities, and give you strategic advice 24/7. 
                Never miss opportunities again with AI-powered coaching that learns from your success patterns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Target className="w-6 h-6 mb-3 mx-auto text-emerald-200" />
                  <h3 className="font-semibold mb-2">Smart Goal Tracking</h3>
                  <p className="text-sm text-white/80">Analyzes your progress and tells you exactly what to focus on daily</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 mb-3 mx-auto text-blue-200" />
                  <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                  <p className="text-sm text-white/80">Identifies what's working in your business and scales your success</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 mb-3 mx-auto text-purple-200" />
                  <h3 className="font-semibold mb-2">Daily Action Plans</h3>
                  <p className="text-sm text-white/80">Provides specific recommendations to maximize your productivity</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 inline-flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium">Available with Pro Plan - Try Free for 7 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="flex justify-center mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                alt="I Need Numbers" 
                className="h-16 w-auto"
              />
            </div>
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
              Built for Agents
            </Badge>
            <h2 className="text-4xl font-bold text-deep-forest font-poppins">
              Built for Agents, Explained for Investors
            </h2>
            <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
              Stop losing deals because you can't explain the numbers. <span className="font-bold text-primary font-poppins">I Need Numbers</span> makes investment analysis simple for agents and clear for buyers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calculator className="w-8 h-8 text-primary" />,
                title: "Simple Calculator",
                description: "Just paste a listing or enter basic details. We handle the complex math and show you what matters.",
                isPro: false
              },
              {
                icon: <FileText className="w-8 h-8 text-primary" />,
                title: "Branded PDFs",
                description: "Professional reports with your logo, contact info, and plain-English explanations investors understand.",
                isPro: false
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                title: "Key Metrics",
                description: "Cap rate, cash-on-cash, DSCR, IRR — all calculated instantly with explanations of what they mean.",
                isPro: false
              },
              {
                icon: <div className="text-2xl">🤖</div>,
                title: "AI Sales Coach",
                description: "Your personal AI coach analyzes your goals, activities, and performance to give you strategic insights and daily action plans.",
                isPro: true
              }
            ].map((feature, index) => (
              <Card key={index} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${feature.isPro ? 'ring-2 ring-primary/20 bg-gradient-to-br from-white to-primary/5' : ''}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl font-semibold text-deep-forest font-poppins">{feature.title}</CardTitle>
                    {feature.isPro && (
                      <Badge className="bg-primary text-white text-xs px-2 py-1">PRO</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-dark leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Simplicity Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-light to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              No Jargon Zone
            </Badge>
            <h2 className="text-4xl font-bold text-deep-forest font-poppins">
              Don't worry about jargon
            </h2>
            <p className="text-xl text-neutral-dark leading-relaxed">
              <span className="font-bold text-primary font-poppins">I Need Numbers</span> explains every number in plain English. Your investors will know what they're looking at. 
              Every packet includes a built-in disclaimer so you stay compliant.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1562776903-cc60d622df72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBleHBsYW5hdGlvbnxlbnwwfHx8fDE3NTgyMzU3NzJ8MA&ixlib=rb-4.1.0&q=85"
                alt="IT'S SIMPLE - Plain English explanations without jargon"
                className="rounded-2xl shadow-xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              Pricing
            </Badge>
            <h2 className="text-4xl font-bold text-deep-forest font-poppins">
              Choose your plan
            </h2>
            <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
              Start free and upgrade as your business grows. All plans include plain-English explanations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 border-neutral-medium hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-forest font-poppins">Free</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-deep-forest">
                    $0<span className="text-lg font-normal text-neutral-dark">/forever</span>
                  </div>
                  <CardDescription className="text-sm">Single-deal calculator</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3" role="list">
                  {[
                    <>Single-deal calculator</>,
                    <>Basic KIPs with explanations</>,
                    <>Download PDF with <span className="font-semibold text-primary font-poppins">I Need Numbers</span> branding</>,
                    <>No saving or sharing</>,
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-neutral-dark text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-deep-forest hover:bg-deep-forest/90 text-white font-poppins"
                  onClick={() => navigate('/calculator')}
                >
                  Try the Free Calculator
                </Button>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="relative border-2 border-primary shadow-xl">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                Most Popular
              </Badge>
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-forest font-poppins">Starter</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-deep-forest">
                    $19<span className="text-lg font-normal text-neutral-dark">/month</span>
                  </div>
                  <CardDescription className="text-sm">Save up to 10 deals, branded PDFs, share links</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3" role="list">
                  {[
                    <>Save up to 10 deals</>,
                    <>Branded PDFs with your logo & contact</>,
                    <>Share links with investors</>,
                    <>Portfolio basics</>,
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-neutral-dark text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-primary hover:bg-secondary text-white font-poppins"
                  onClick={() => {
                    if (user) {
                      navigate('/pricing');
                    } else {
                      navigate('/auth/login', { state: { from: { pathname: '/pricing' } } });
                    }
                  }}
                >
                  Upgrade to Starter
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-neutral-medium hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-forest font-poppins">Pro</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-deep-forest">
                    $49<span className="text-lg font-normal text-neutral-dark">/month</span>
                  </div>
                  <CardDescription className="text-sm">Unlimited deals, URL prefill, 5-year projections</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3" role="list">
                  {[
                    <>Unlimited deals & portfolios</>,
                    <>URL prefill from listings</>,
                    <>5-year projections in PDFs</>,
                    <>Multiple brand profiles</>,
                    <><span className="flex items-center">🤖 <span className="ml-2">AI Sales Coach & Analytics</span></span></>,
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-neutral-dark text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-deep-forest hover:bg-deep-forest/90 text-white font-poppins"
                  onClick={() => {
                    if (user) {
                      navigate('/pricing');
                    } else {
                      navigate('/auth/login', { state: { from: { pathname: '/pricing' } } });
                    }
                  }}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-white font-poppins">
              Turn your next listing into an investor packet today
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/calculator')}
                className="bg-white text-primary hover:bg-neutral-light text-lg px-8 py-4 font-poppins"
              >
                Try the Free Calculator
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/sample-pdf')}
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 font-poppins"
              >
                See Sample PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {/* Footer */}
      <footer className="bg-deep-forest text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                  alt="I Need Numbers" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-neutral-medium">
                Agent-friendly investor packets in minutes. Plain-English metrics and clean PDFs.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-poppins">Product</h3>
              <ul className="space-y-2 text-neutral-medium">
                <li><button onClick={() => navigate('/calculator')} className="hover:text-white transition-colors">Calculator</button></li>
                <li><button onClick={() => navigate('/sample-pdf')} className="hover:text-white transition-colors">Sample PDF</button></li>
                <li><button onClick={() => navigate('/glossary')} className="hover:text-white transition-colors">Glossary</button></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 font-poppins">Support</h3>
              <ul className="space-y-2 text-neutral-medium">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 font-poppins">Legal</h3>
              <ul className="space-y-2 text-neutral-medium">
                <li><button onClick={() => navigate('/legal/privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/legal/terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary mt-12 pt-8 text-center text-neutral-medium">
            <p>&copy; 2025 <span className="font-bold text-primary font-poppins">I Need Numbers</span>, LLC. All rights reserved. Agent-friendly investor packets in minutes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;