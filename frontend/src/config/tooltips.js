// Tooltips configuration for DealPack
// Plain-English explanations for real estate investment terms

export const tooltips = {
  "cap_rate": "Cap Rate = NOI ÷ Purchase Price. Loan-agnostic return for quick comparison.",
  "dscr": "DSCR = NOI ÷ Annual Debt Service. Shows how easily rent covers the mortgage. Lenders like ≥ 1.20.",
  "cash_on_cash": "Annual cash flow divided by your cash invested (down + closing + rehab).",
  "irr_5yr": "Time-weighted return over ~5 years, including sale. Helpful but assumption-sensitive.",
  "noi": "Net Operating Income = EGI − Operating Expenses. Before loan payments and taxes.",
  "egi": "Effective Gross Income = (Rent + Other Income) × (1 − Vacancy %).",
  "break_even_occupancy": "Occupancy (or rent %) needed to cover OpEx + debt. Lower is safer.",
  "moic": "Multiple on Invested Capital: total returned per $1 invested.",
  "payback": "Years to recoup your cash from annual cash flow.",
  "ltv": "Loan-to-Value = Loan ÷ Value (often ~75–80%).",
  "amort_years": "Years over which the loan is paid down (e.g., 30).",
  "interest_only_months": "Months with interest-only payments (lower payment, no principal).",
  "exit_cap": "Assumed cap rate at sale. Sale ≈ next year's NOI ÷ exit cap. Use a slightly higher number to be conservative.",
  "vacancy_pct": "Expected empty time/unpaid rent over a year. Market-dependent.",
  "mgmt_pct": "Percent of EGI paid to a property manager (often 8–10%).",
  "capex_pct": "Reserve for big items (roof/HVAC) so cash flow isn't a surprise later.",
  "repairs_pct": "Ongoing small fixes (separate from CapEx reserve).",
  
  // Form field tooltips
  "property_address": "Full street address of the property you're analyzing",
  "purchase_price": "Total purchase price of the property - required for all calculations",
  "down_payment": "Cash down payment amount (typically 20-25% of purchase price)",
  "loan_amount": "Total loan amount (usually Purchase Price - Down Payment)",
  "interest_rate": "Annual interest rate on the loan (current market rates 6-8%)",
  "loan_term": "Number of years to pay off the loan (typically 30 years)",
  "monthly_rent": "Expected monthly rental income - required for all calculations",
  "other_income": "Other monthly income like parking, laundry, pet fees, etc.",
  "property_taxes": "Annual property tax amount (check local tax records)",
  "insurance": "Annual insurance premium for the property",
  "hoa_fees": "Monthly homeowners association fees (if applicable)",
  "maintenance_reserve": "Monthly reserve for repairs and maintenance (typically $100-300)",
  "vacancy_allowance": "Monthly allowance for periods when property is vacant (typically 5-10% of rent)",
  "property_management": "Monthly property management fee (typically 8-12% of rent)",
  "square_footage": "Total square footage of the property (affects price per sq ft)",
  "property_type": "Type of property for investment analysis"
};

// Content constants for easy updates
export const content = {
  HERO_HEADLINE: "Turn any listing into an investor-ready packet in 5 minutes",
  HERO_SUBHEAD: "DealPack makes the math simple. Even if you've never run a cap rate before, we guide you step-by-step and create a clean PDF your buyers can understand.",
  CTA_PRIMARY: "Try the Free Calculator",
  CTA_SECONDARY: "See Sample PDF",
  
  WHY_TITLE: "Built for Agents, Explained for Investors",
  WHY_SUBTITLE: "Stop losing deals because you can't explain the numbers. DealPack makes investment analysis simple for agents and clear for buyers.",
  
  WHY_FEATURES: [
    {
      title: "Guided Inputs",
      description: "Just enter the basics—price, rent, and a few expenses. DealPack tells you what matters."
    },
    {
      title: "Plain-English Metrics",
      description: "Cap Rate, DSCR, Cash-on-Cash… each with a one-line explanation, not jargon."
    },
    {
      title: "Branded Reports",
      description: "Download a professional one-pager with your logo and contact info. Send to investors with confidence."
    }
  ],
  
  HOW_STEPS: [
    {
      step: "1",
      title: "Enter the deal",
      description: "Manual form for all plans. Pro adds paste-URL prefill for faster input."
    },
    {
      step: "2",
      title: "See the numbers", 
      description: "Live KPIs with short explanations so you understand what each metric means."
    },
    {
      step: "3",
      title: "Share the packet",
      description: "Free = generic branding; Starter/Pro = save + branded PDFs and share links."
    }
  ],
  
  WHAT_YOU_GET_LIST: [
    { term: "Cap Rate", definition: "Yearly return based on purchase price." },
    { term: "DSCR", definition: "Rent coverage vs. mortgage; lenders want ~1.2+." },
    { term: "Cash-on-Cash", definition: "Annual cash flow vs. cash invested." },
    { term: "IRR", definition: "Average yearly return over time, including sale." }
  ],
  
  TRUST_HEADLINE: "Don't worry about jargon",
  TRUST_COPY: "DealPack explains every number in plain English. Your investors will know what they're looking at. Every packet includes a built-in disclaimer so you stay compliant.",
  
  CTA_BANNER_LINE: "Turn your next listing into an investor packet today",
  
  PDF_DISCLOSURE_DEFAULT: "These calculations are estimates based on the assumptions provided. DealPack and the agent/brokerage do not guarantee performance. Verify all information independently before investing."
};