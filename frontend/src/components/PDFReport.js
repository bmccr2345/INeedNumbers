import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DollarSign, Home, TrendingUp, FileText, Phone, Mail, Globe } from 'lucide-react';

const PDFReport = ({ data, plan = "FREE", agentProfile = null }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const isPro = plan === "PRO";
  const isStarter = plan === "STARTER";
  const isPaid = isPro || isStarter;
  const showAgentContact = isPaid && agentProfile;

  // Agent contact component
  const AgentContactBlock = ({ agentProfile, compact = false }) => {
    if (!agentProfile) return null;

    const hasContactInfo = agentProfile.agent_full_name || 
                          agentProfile.agent_phone || 
                          agentProfile.agent_email || 
                          agentProfile.agent_website;

    if (!hasContactInfo) {
      return (
        <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 italic p-3 bg-gray-50 rounded`}>
          Professional real estate analysis report.
        </div>
      );
    }

    return (
      <div className={`${compact ? 'space-y-1' : 'space-y-2'}`}>
        <div className={`${compact ? 'text-sm' : 'text-base'} font-bold text-gray-900`}>
          {agentProfile.agent_full_name || 'Agent Name'}
        </div>
        {agentProfile.agent_title_or_team && (
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {agentProfile.agent_title_or_team}
          </div>
        )}
        {agentProfile.agent_brokerage && (
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {agentProfile.agent_brokerage}
          </div>
        )}
        <div className={`flex flex-col ${compact ? 'space-y-0.5' : 'space-y-1'} ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {agentProfile.agent_phone && (
            <a href={`tel:${agentProfile.agent_phone}`} className="flex items-center space-x-1 hover:text-blue-600">
              <Phone className="w-3 h-3" />
              <span>{agentProfile.agent_phone}</span>
            </a>
          )}
          {agentProfile.agent_email && (
            <a href={`mailto:${agentProfile.agent_email}`} className="flex items-center space-x-1 hover:text-blue-600">
              <Mail className="w-3 h-3" />
              <span>{agentProfile.agent_email}</span>
            </a>
          )}
          {agentProfile.agent_website && (
            <a href={agentProfile.agent_website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-blue-600">
              <Globe className="w-3 h-3" />
              <span>{agentProfile.agent_website.replace('https://', '').replace('http://', '')}</span>
            </a>
          )}
          {agentProfile.agent_license_number && (
            <div className={`${compact ? 'text-xs' : 'text-xs'} text-gray-500`}>
              License: {agentProfile.agent_license_number}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get brand color
  const brandColor = showAgentContact && agentProfile?.agent_brand_color ? 
                    agentProfile.agent_brand_color : '#2FA163';

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:space-y-6">
      
      {/* Page 1 - Snapshot */}
      <Card className="shadow-xl print:shadow-none print:border-2">
        <CardHeader 
          className="text-white"
          style={{ 
            background: showAgentContact ? brandColor : 'linear-gradient(135deg, #2FA163 0%, #286C4E 100%)'
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {showAgentContact && agentProfile?.agent_logo_url ? (
                <img src={agentProfile.agent_logo_url} alt="Agent Logo" className="h-10" />
              ) : (
                <img 
                  src="https://customer-assets.emergentagent.com/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png" 
                  alt="I Need Numbers" 
                  className="h-10 w-auto"
                />
              )}
              <div className="text-4xl font-bold text-white">Property Analysis</div>
            </div>
            {showAgentContact && (
              <div className="text-right text-sm">
                <p className="opacity-90">Prepared by</p>
                <p className="font-semibold">{agentProfile?.agent_full_name || 'Agent'}</p>
                <p className="text-sm opacity-90">{agentProfile?.agent_brokerage || ''}</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Property Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              {data.property?.photo_url && (
                <div className="mb-6">
                  <img 
                    src={data.property.photo_url}
                    alt="Property"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{data.property?.address || "Property Address"}</h2>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{data.property?.beds || 0} bed</span>
                  <span>{data.property?.baths || 0} bath</span>
                  <span>{data.property?.sqft?.toLocaleString() || 0} sqft</span>
                  <span>Built {data.property?.year_built || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Investment Snapshot</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Purchase Price</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(data.inputs?.price || 0)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Monthly Rent</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(data.inputs?.rent_monthly || 0)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Rehab/CapEx</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(data.inputs?.rehab_budget || 0)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Total Cash Needed</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(data.derived?.total_cash_needed || 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics with Explanations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Key Investment Metrics</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{formatPercentage(data.derived?.cap_rate || 0)}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">Cap Rate</div>
                <div className="text-xs text-gray-500 mt-1">{data.glossary_one_liners?.cap_rate}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{formatPercentage(data.derived?.cash_on_cash || 0)}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">Cash-on-Cash</div>
                <div className="text-xs text-gray-500 mt-1">{data.glossary_one_liners?.cash_on_cash}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{data.derived?.dscr?.toFixed(2) || 0}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">DSCR</div>
                <div className="text-xs text-gray-500 mt-1">{data.glossary_one_liners?.dscr}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">{formatPercentage(data.derived?.irr_5yr || 0)}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">IRR (5 yr)</div>
                <div className="text-xs text-gray-500 mt-1">{data.glossary_one_liners?.irr_5yr}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{formatPercentage(data.derived?.break_even_occupancy || 0)}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">Break-even Occupancy</div>
                <div className="text-xs text-gray-500 mt-1">{data.glossary_one_liners?.break_even_occupancy}</div>
              </div>
            </div>
          </div>

          {/* Agent Contact Block (Starter/Pro only) */}
          {showAgentContact && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <AgentContactBlock agentProfile={agentProfile} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page 2 - Financial Breakdown */}
      <Card className="shadow-xl print:shadow-none print:border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Financial Breakdown</span>
          </CardTitle>
          <CardDescription>Where the money comes from and where it goes</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Initial Investment */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Initial Investment Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Down Payment ({formatPercentage(data.inputs?.down_pct || 0.25)})</span>
                  <span className="font-semibold text-blue-900">{formatCurrency((data.inputs?.price || 0) * (data.inputs?.down_pct || 0.25))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-sm font-medium">Rehab/CapEx</span>
                  <span className="font-semibold text-purple-900">{formatCurrency(data.inputs?.rehab_budget || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Closing Costs (est.)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(data.inputs?.closing_costs || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border-2 border-green-200">
                  <span className="font-semibold">Total Cash Required</span>
                  <span className="font-bold text-green-900">{formatCurrency(data.derived?.total_cash_needed || 0)}</span>
                </div>
              </div>
            </div>

            {/* Income & Expenses */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Annual Income & Expenses</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-green-700">
                  <span>Effective Gross Income</span>
                  <span className="font-semibold">{formatCurrency(data.derived?.effective_gross_income_annual || 0)}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>Operating Expenses</span>
                  <span className="font-semibold">({formatCurrency(data.derived?.operating_expenses_annual || 0)})</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Net Operating Income (NOI)</span>
                  <span>{formatCurrency(data.derived?.noi_annual || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Annual Debt Service</span>
                  <span>({formatCurrency(data.derived?.annual_debt_service || 0)})</span>
                </div>
                <Separator />
                <div className={`flex justify-between font-bold text-lg ${(data.derived?.annual_cash_flow || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>Annual Cash Flow</span>
                  <span>{formatCurrency(data.derived?.annual_cash_flow || 0)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> NOI is income after expenses, before loan payments. 
                  Investors use it to compare properties regardless of financing.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page 3 - 5-Year Projection (Pro Only) */}
      {isPro && (
        <Card className="shadow-xl print:shadow-none print:border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>5-Year Projection</span>
            </CardTitle>
            <CardDescription>Projected performance over time</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Year</th>
                    <th className="text-right p-2">Income</th>
                    <th className="text-right p-2">Expenses</th>
                    <th className="text-right p-2">NOI</th>
                    <th className="text-right p-2">Debt Service</th>
                    <th className="text-right p-2">Cash Flow</th>
                    <th className="text-right p-2">Property Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(year => {
                    const income = (data.derived?.effective_gross_income_annual || 0) * Math.pow(1 + (data.inputs?.rent_growth_pct || 0.02), year - 1);
                    const expenses = (data.derived?.operating_expenses_annual || 0) * Math.pow(1 + (data.inputs?.expense_growth_pct || 0.02), year - 1);
                    const noi = income - expenses;
                    const debtService = data.derived?.annual_debt_service || 0;
                    const cashFlow = noi - debtService;
                    const propertyValue = noi / (data.inputs?.exit_cap_pct || 0.065);
                    
                    return (
                      <tr key={year} className="border-b">
                        <td className="p-2 font-medium">{year}</td>
                        <td className="text-right p-2">{formatCurrency(income)}</td>
                        <td className="text-right p-2">({formatCurrency(expenses)})</td>
                        <td className="text-right p-2 font-medium">{formatCurrency(noi)}</td>
                        <td className="text-right p-2">({formatCurrency(debtService)})</td>
                        <td className={`text-right p-2 font-medium ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(cashFlow)}
                        </td>
                        <td className="text-right p-2">{formatCurrency(propertyValue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Assumptions: {formatPercentage(data.inputs?.rent_growth_pct || 0.02)} annual rent growth, 
              {formatPercentage(data.inputs?.expense_growth_pct || 0.02)} expense growth, 
              {formatPercentage(data.inputs?.exit_cap_pct || 0.065)} exit cap rate
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page 4 - Glossary & Disclaimer */}
      <Card className="shadow-xl print:shadow-none print:border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Terms & Disclaimer</span>
          </CardTitle>
          <CardDescription>Understanding the numbers</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mini Glossary */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Key Terms</h4>
              <div className="space-y-3 text-sm">
                {data.glossary_one_liners && Object.entries(data.glossary_one_liners).map(([term, definition]) => (
                  <div key={term}>
                    <p className="font-medium text-gray-900 capitalize">{term.replace('_', ' ').replace(' 5yr', ' (5 yr)')}:</p>
                    <p className="text-gray-600">{definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Important Disclaimer</h4>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  {data.disclaimer || "These calculations are estimates based on the assumptions provided. DealPack and the agent/brokerage do not guarantee performance. Verify all information independently before investing."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer with Agent Contact (Compact) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {showAgentContact ? (
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div>
                  <AgentContactBlock agentProfile={agentProfile} compact={true} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Generated by I Need Numbers (www.ineednumbers.com) • Agent-friendly investor packets in minutes
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Generated by I Need Numbers (www.ineednumbers.com) • Agent-friendly investor packets in minutes
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFReport;