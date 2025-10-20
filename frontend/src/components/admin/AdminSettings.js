import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Key, 
  Bell, 
  Database,
  Globe,
  Lock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Server,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Application Settings
  const [appSettings, setAppSettings] = useState({
    app_name: 'I Need Numbers',
    app_description: 'Real estate tools for agents',
    maintenance_mode: false,
    registration_enabled: true,
    max_free_deals: 0,
    max_starter_deals: 10,
    starter_price: 1900, // cents
    pro_price: 4900, // cents
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    session_timeout: 3600, // seconds
    max_login_attempts: 5,
    password_min_length: 8,
    require_2fa_for_admins: true,
    password_expiry_days: 90,
    allowed_domains: '',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_use_tls: true,
    from_email: 'noreply@ineedNumbers.com',
    from_name: 'I Need Numbers',
  });

  // Stripe Settings
  const [stripeSettings, setStripeSettings] = useState({
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    stripe_success_url: '',
    stripe_cancel_url: '',
  });

  // Show/hide sensitive fields
  const [showSecrets, setShowSecrets] = useState({
    smtp_password: false,
    stripe_secret_key: false,
    stripe_webhook_secret: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Mock settings load - will be replaced with actual API call
      // Settings are already initialized with default values above
      
    } catch (error) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType) => {
    try {
      setSaving(true);
      setError('');
      
      // Mock save operation - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${settingsType} settings saved successfully`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError(`Failed to save ${settingsType.toLowerCase()} settings`);
    } finally {
      setSaving(false);
    }
  };

  const toggleSecret = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testEmailSettings = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Mock email test - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Test email sent successfully');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Failed to send test email');
    } finally {
      setSaving(false);
    }
  };

  const testStripeConnection = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Mock Stripe test - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Stripe connection successful');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Failed to connect to Stripe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure application, security, and integration settings</p>
        </div>
        
        <Button onClick={loadSettings} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Reload Settings</span>
        </Button>
      </div>

      {/* Status Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="w-4 h-4" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Application Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app_name">Application Name</Label>
              <Input
                id="app_name"
                value={appSettings.app_name}
                onChange={(e) => setAppSettings(prev => ({ ...prev, app_name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app_description">Description</Label>
              <Input
                id="app_description"
                value={appSettings.app_description}
                onChange={(e) => setAppSettings(prev => ({ ...prev, app_description: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_starter_deals">Starter Plan Limit</Label>
              <Input
                id="max_starter_deals"
                type="number"
                value={appSettings.max_starter_deals}
                onChange={(e) => setAppSettings(prev => ({ ...prev, max_starter_deals: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="starter_price">Starter Price (cents)</Label>
              <Input
                id="starter_price"
                type="number"
                value={appSettings.starter_price}
                onChange={(e) => setAppSettings(prev => ({ ...prev, starter_price: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pro_price">Pro Price (cents)</Label>
              <Input
                id="pro_price"
                type="number"
                value={appSettings.pro_price}
                onChange={(e) => setAppSettings(prev => ({ ...prev, pro_price: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={appSettings.maintenance_mode}
                onChange={(e) => setAppSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Maintenance Mode</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={appSettings.registration_enabled}
                onChange={(e) => setAppSettings(prev => ({ ...prev, registration_enabled: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Registration Enabled</span>
            </label>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => saveSettings('Application')}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Application Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_timeout">Session Timeout (seconds)</Label>
              <Input
                id="session_timeout"
                type="number"
                value={securitySettings.session_timeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
              <Input
                id="max_login_attempts"
                type="number"
                value={securitySettings.max_login_attempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password_min_length">Min Password Length</Label>
              <Input
                id="password_min_length"
                type="number"
                value={securitySettings.password_min_length}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowed_domains">Allowed Email Domains (comma-separated)</Label>
            <Input
              id="allowed_domains"
              placeholder="example.com, company.com"
              value={securitySettings.allowed_domains}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowed_domains: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={securitySettings.require_2fa_for_admins}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, require_2fa_for_admins: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Require 2FA for Admins</span>
            </label>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => saveSettings('Security')}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Security Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                id="smtp_host"
                placeholder="smtp.gmail.com"
                value={emailSettings.smtp_host}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_port">SMTP Port</Label>
              <Input
                id="smtp_port"
                type="number"
                value={emailSettings.smtp_port}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_username">SMTP Username</Label>
              <Input
                id="smtp_username"
                value={emailSettings.smtp_username}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_password">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="smtp_password"
                  type={showSecrets.smtp_password ? "text" : "password"}
                  value={emailSettings.smtp_password}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('smtp_password')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.smtp_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_email">From Email</Label>
              <Input
                id="from_email"
                type="email"
                value={emailSettings.from_email}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, from_email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="from_name">From Name</Label>
              <Input
                id="from_name"
                value={emailSettings.from_name}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, from_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="pt-4 border-t flex space-x-3">
            <Button
              onClick={() => saveSettings('Email')}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Email Settings</span>
            </Button>
            
            <Button
              onClick={testEmailSettings}
              disabled={saving}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Test Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Stripe Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_publishable_key">Publishable Key</Label>
              <Input
                id="stripe_publishable_key"
                placeholder="pk_test_..."
                value={stripeSettings.stripe_publishable_key}
                onChange={(e) => setStripeSettings(prev => ({ ...prev, stripe_publishable_key: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stripe_secret_key">Secret Key</Label>
              <div className="relative">
                <Input
                  id="stripe_secret_key"
                  type={showSecrets.stripe_secret_key ? "text" : "password"}
                  placeholder="sk_test_..."
                  value={stripeSettings.stripe_secret_key}
                  onChange={(e) => setStripeSettings(prev => ({ ...prev, stripe_secret_key: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('stripe_secret_key')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.stripe_secret_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
              <div className="relative">
                <Input
                  id="stripe_webhook_secret"
                  type={showSecrets.stripe_webhook_secret ? "text" : "password"}
                  placeholder="whsec_..."
                  value={stripeSettings.stripe_webhook_secret}
                  onChange={(e) => setStripeSettings(prev => ({ ...prev, stripe_webhook_secret: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('stripe_webhook_secret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.stripe_webhook_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex space-x-3">
            <Button
              onClick={() => saveSettings('Stripe')}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Stripe Settings</span>
            </Button>
            
            <Button
              onClick={testStripeConnection}
              disabled={saving}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Server className="w-4 h-4" />
              <span>Test Connection</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;