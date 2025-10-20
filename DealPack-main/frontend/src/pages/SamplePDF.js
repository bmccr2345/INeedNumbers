import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, FileText, Download, Calculator } from 'lucide-react';
import PDFReport from '../components/PDFReport';
import { dealpackSamplePDF } from '../data/samplePDFData';

const SamplePDF = () => {
  const navigate = useNavigate();

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
                <h1 className="text-xl font-bold">Sample PDF Report</h1>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Live Preview - Starter Plan
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sample Investor Packet
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is what your investors will see—clean, professional, and easy to understand. 
            No confusing jargon, just the numbers that matter with your contact information.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/calculator')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              Create Your Own
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Print Sample
            </Button>
          </div>
        </div>

        {/* PDF Report Component with Agent Profile */}
        <PDFReport 
          data={dealpackSamplePDF} 
          plan={dealpackSamplePDF.plan} 
          agentProfile={dealpackSamplePDF.agent}
        />

        {/* Call to Action */}
        <div className="text-center mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to create your own branded investor packet?
          </h2>
          <p className="text-gray-600">
            Add your contact information in Settings and upgrade to Starter or Pro to get branded PDFs like this one.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              onClick={() => navigate('/settings')}
              variant="outline"
              className="border-2"
            >
              Add Your Contact Info
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/calculator')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Try the Free Calculator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePDF;