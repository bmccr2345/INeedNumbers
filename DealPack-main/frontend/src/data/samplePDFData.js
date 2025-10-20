// Sample PDF data for demo purposes - no DB writes required
export const dealpackSamplePDF = {
  "plan": "STARTER",
  "agent": {
    "agent_full_name": "John Johnson",
    "agent_title_or_team": "Senior Agent", 
    "agent_brokerage": "XYZ Brokerage",
    "agent_license_number": "SL9876543",
    "agent_phone": "(555) 555-1212",
    "agent_email": "john@xyzbrokerage.com",
    "agent_website": "https://xyzbrokerage.com",
    "agent_logo_url": null,
    "agent_headshot_url": null,
    "agent_brand_color": "#2FA163"
  },
  "property": {
    "address": "123 Main Street, Tampa, FL 33602",
    "photo_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnR8ZW58MHx8fHwxNzU4MTk4MzkyfDA&ixlib=rb-4.1.0&q=85",
    "type": "Single Family",
    "beds": 3,
    "baths": 2,
    "sqft": 1450,
    "year_built": 1998
  },
  "inputs": {
    "price": 240000,
    "rehab_budget": 25000,
    "closing_costs": 0,
    "rent_monthly": 2400,
    "other_income_monthly": 0,
    "vacancy_pct": 0.05,
    "taxes_annual": 3000,
    "insurance_annual": 2000,
    "hoa_monthly": 0,
    "utilities_monthly": 0,
    "misc_monthly": 0,
    "mgmt_pct": 0.08,
    "repairs_pct": 0.05,
    "capex_pct": 0.05,
    "down_pct": 0.25,
    "interest_annual_pct": 0.065,
    "amort_years": 30,
    "interest_only_months": 0,
    "exit_cap_pct": 0.065,
    "rent_growth_pct": 0.02,
    "expense_growth_pct": 0.02,
    "selling_costs_pct": 0.06
  },
  "derived": {
    "total_cash_needed": 85000,
    "effective_gross_income_annual": 27360,
    "operating_expenses_annual": 9924.8,
    "noi_annual": 17435.2,
    "annual_debt_service": 13652.67,
    "annual_cash_flow": 3782.53,
    "cap_rate": 0.07265,
    "dscr": 1.277,
    "cash_on_cash": 0.0445,
    "break_even_occupancy": 0.819,
    "irr_5yr": 0.10
  },
  "glossary_one_liners": {
    "cap_rate": "Yearly return based on purchase price.",
    "cash_on_cash": "Annual cash flow vs cash invested.",
    "dscr": "Rent coverage vs mortgage; lenders want ~1.2+.",
    "irr_5yr": "Average yearly return including sale.",
    "break_even_occupancy": "% rented to cover costs."
  },
  "disclaimer": "These calculations are estimates based on the assumptions provided. DealPack and the agent/brokerage do not guarantee performance. Verify all information independently before investing."
};