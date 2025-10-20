import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Settings, Palette, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const BrandingPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Branding & Profile</h1>
        <p className="text-gray-600">Manage your brand assets and personalization for all PDFs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="w-5 h-5 mr-2" />
              Brand Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Completion</span>
                <span className="font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Assets Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">PDFs Branded</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/app/branding')}
                className="w-full justify-start"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Branding
              </Button>
              <Button 
                onClick={() => navigate('/app/branding')}
                className="w-full justify-start"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Assets
              </Button>
              <Button 
                onClick={() => navigate('/app/branding')}
                className="w-full justify-start"
                variant="outline"
              >
                <Palette className="w-4 h-4 mr-2" />
                Set Brand Colors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Getting Started with Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Badge className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Add Your Details</h3>
                <p className="text-sm text-gray-600">Fill in your agent and brokerage information</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Upload Assets</h3>
                <p className="text-sm text-gray-600">Add your headshot and logos (Starter/Pro)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Set Brand Colors</h3>
                <p className="text-sm text-gray-600">Choose colors that match your brand</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => navigate('/app/branding')}
                size="lg"
                className="bg-primary hover:bg-primary-dark"
              >
                Get Started →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandingPanel;