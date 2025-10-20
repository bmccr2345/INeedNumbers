import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlanPreview } from '../hooks/usePlanPreview';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { 
  CheckCircle, 
  Circle, 
  User, 
  FileText, 
  Share2, 
  Calculator, 
  Link2, 
  CreditCard,
  Play,
  Upload,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectivePlan, isPreviewMode } = usePlanPreview(user?.plan);
  
  const [agentInfo, setAgentInfo] = useState(null);
  const [dealCount, setDealCount] = useState(0);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});

  // Check completion states
  const agentComplete = agentInfo?.agent_full_name && agentInfo?.agent_brokerage;
  const dealComplete = dealCount > 0;
  const pdfComplete = pdfGenerated;

  const completedSteps = [agentComplete, dealComplete, pdfComplete].filter(Boolean).length;
  const progressPercentage = (completedSteps / 3) * 100;

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Mock data for now - in real app, fetch from API
      const mockAgentInfo = {
        agent_full_name: 'John Johnson',
        agent_brokerage: 'XYZ Brokerage'
      };
      const mockDealCount = 2;
      const mockPdfGenerated = true;

      setAgentInfo(mockAgentInfo);
      setDealCount(mockDealCount);
      setPdfGenerated(mockPdfGenerated);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleCreateDeal = () => {
    navigate('/calculator');
  };

  const handlePasteURL = () => {
    navigate('/calculator?mode=url');
  };

  const handleAddAgentInfo = () => {
    navigate('/calculator#agent-info');
  };

  const handleGeneratePDF = () => {
    if (!agentComplete) {
      toast.error('Add your Name and Brokerage to brand the PDF.');
      return;
    }
    // Generate PDF logic
    toast.success('Branded PDF generated!');
    setPdfGenerated(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText('https://ineednumbers.com/share/example');
    toast.success('Share link copied to clipboard!');
  };

  const handleManageBilling = () => {
    // Open Stripe customer portal
    window.open('#', '_blank');
  };

  const toggleFAQ = (section) => {
    setFaqOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isPro = effectivePlan === 'PRO';
  const isStarter = effectivePlan === 'STARTER';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Plan Preview Ribbon */}
      {isPreviewMode && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
          <div className="container mx-auto">
            <p className="text-sm text-amber-800 text-center">
              Previewing {effectivePlan} (no billing)
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Confirmation Hero */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              You're on {effectivePlan} 🎉
            </Badge>
            <div className="flex-1 text-right">
              <Button variant="ghost" size="sm" onClick={handleManageBilling}>
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's get your first investor packet out
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            3 quick steps. ~3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleCreateDeal}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Create your first deal
            </Button>
            <Button variant="outline" size="lg" onClick={handlePasteURL}>
              <Link2 className="w-5 h-5 mr-2" />
              Paste a listing URL
            </Button>
          </div>
        </div>

        {/* What you just unlocked */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">What you just unlocked</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              {isPro ? (
                "Unlimited deals & portfolios • URL prefill • 5-year projections in PDFs • Multiple brand profiles"
              ) : (
                "Save up to 10 deals • Branded PDFs • Share links • Portfolio basics"
              )}
            </p>
            <p className="text-sm text-gray-500">
              You can switch plans anytime in My Account.
            </p>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Your Progress ({completedSteps}/3 Complete)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-gray-600">
              {completedSteps === 3 ? "All set! You're ready to create amazing investor packets." 
               : `${3 - completedSteps} step${3 - completedSteps !== 1 ? 's' : ''} remaining`}
            </p>
          </CardContent>
        </Card>

        {/* 3-Step Checklist */}
        <div className="grid gap-6 mb-8">
          {/* Step 1 - Bring your brand */}
          <Card className={`${agentComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                {agentComplete ? (
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 mr-3 text-gray-400" />
                )}
                <div>
                  <span className="text-lg">Step 1 — Bring your brand</span>
                  <p className="text-sm font-normal text-gray-600 mt-1">
                    Add your name, brokerage, and logo for professional PDFs.
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {agentComplete ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Complete! Your brand info is saved.</span>
                </div>
              ) : (
                <Button onClick={handleAddAgentInfo} className="bg-primary hover:bg-emerald-700">
                  <User className="w-4 h-4 mr-2" />
                  Add Agent Info
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Step 2 - Create a deal */}
          <Card className={`${dealComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                {dealComplete ? (
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 mr-3 text-gray-400" />
                )}
                <div>
                  <span className="text-lg">Step 2 — Create a deal</span>
                  <p className="text-sm font-normal text-gray-600 mt-1">
                    Type the basics or paste a listing. We'll compute Cap Rate, CoC, DSCR, IRR.
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {dealComplete ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Complete! You have {dealCount} saved deal{dealCount !== 1 ? 's' : ''}.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleCreateDeal} className="bg-primary hover:bg-emerald-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Manual entry
                  </Button>
                  <Button variant="outline" onClick={handlePasteURL}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Paste listing URL
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3 - Generate & share */}
          <Card className={`${pdfComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                {pdfComplete ? (
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 mr-3 text-gray-400" />
                )}
                <div>
                  <span className="text-lg">Step 3 — Generate & share</span>
                  <p className="text-sm font-normal text-gray-600 mt-1">
                    One tap to a branded PDF. Share a link or download the file.
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {pdfComplete ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Complete! Your branded PDF is ready.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleGeneratePDF} className="bg-primary hover:bg-emerald-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Branded PDF
                  </Button>
                  <Button variant="outline" onClick={handleCopyShareLink}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Share Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Usage Meter / Plan Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isPro ? 'Pro Plan' : 'Starter Plan'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <div>
                <p className="text-lg text-green-700 mb-4">You have unlimited saves.</p>
                <Button variant="outline" onClick={() => navigate('/portfolio')}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Saves used:</span>
                  <span className="text-sm text-gray-600">{dealCount} / 10</span>
                </div>
                <Progress value={(dealCount / 10) * 100} className="mb-4" />
                <Button variant="outline" onClick={() => navigate('/pricing')}>
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={handleCreateDeal}>
                <Calculator className="w-6 h-6 mb-2" />
                <span className="text-sm">Start a New Deal</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => navigate('/sample-pdf')}>
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-sm">Open Sample Deal</span>
              </Button>
              {isPro && (
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => navigate('/portfolio')}>
                  <Briefcase className="w-6 h-6 mb-2" />
                  <span className="text-sm">Create Portfolio</span>
                </Button>
              )}
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center" onClick={() => navigate('/settings')}>
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-sm">Upload Logo</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 1-Minute Demo video */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              1-Minute Demo
            </CardTitle>
            <CardDescription>From listing to branded PDF in 60 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Play className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Demo video coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Help & Glossary */}
        <Card>
          <CardHeader>
            <CardTitle>Help & Glossary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* FAQ */}
            <div className="space-y-2">
              <Collapsible 
                open={faqOpen.billing} 
                onOpenChange={() => toggleFAQ('billing')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg">
                  <span className="font-medium">Billing & Plans</span>
                  {faqOpen.billing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 text-sm text-gray-600">
                  You can upgrade, downgrade, or cancel anytime. No long-term contracts.
                </CollapsibleContent>
              </Collapsible>

              <Collapsible 
                open={faqOpen.saves} 
                onOpenChange={() => toggleFAQ('saves')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg">
                  <span className="font-medium">What is a "save"?</span>
                  {faqOpen.saves ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 text-sm text-gray-600">
                  A "save" lets you store a deal analysis permanently in your account for later access and sharing.
                </CollapsibleContent>
              </Collapsible>

              <Collapsible 
                open={faqOpen.pdfs} 
                onOpenChange={() => toggleFAQ('pdfs')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg">
                  <span className="font-medium">Branded vs Generic PDFs</span>
                  {faqOpen.pdfs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 text-sm text-gray-600">
                  Branded PDFs include your name, brokerage, logo, and custom colors. Generic PDFs use "I Need Numbers" branding.
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Separator />

            {/* Micro-glossary */}
            <div>
              <h4 className="font-medium mb-3">Key Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Cap Rate:</span> NOI ÷ Purchase Price
                </div>
                <div>
                  <span className="font-medium">Cash-on-Cash:</span> Year-1 cash flow ÷ Your cash invested
                </div>
                <div>
                  <span className="font-medium">DSCR:</span> NOI ÷ Annual loan payments (aim ≥ 1.10)
                </div>
                <div>
                  <span className="font-medium">IRR:</span> Annualized return over time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;