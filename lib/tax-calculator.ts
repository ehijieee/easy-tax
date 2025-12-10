// Tax calculation utilities based on Nigerian tax brackets

export interface TaxCalculationInput {
  income: number
  occupation: string
  businessType?: string
  state?: string
}

export interface TaxCalculationResult {
  federalTax: number
  stateTax: number
  totalTax: number
  effectiveRate: number
  breakdown: {
    taxableIncome: number
    personalAllowance: number
    consolidatedRelief: number
  }
}

// Nigerian Personal Income Tax (PIT) Brackets 2024
const TAX_BRACKETS = [
  { min: 0, max: 300000, rate: 0.07 },
  { min: 300000, max: 600000, rate: 0.11 },
  { min: 600000, max: 1100000, rate: 0.15 },
  { min: 1100000, max: 1600000, rate: 0.19 },
  { min: 1600000, max: 3200000, rate: 0.21 },
  { min: 3200000, max: Infinity, rate: 0.24 },
]

export function calculatePersonalIncomeTax(income: number): TaxCalculationResult {
  // Personal Allowance: 1% of gross income or NGN 200,000 (whichever is higher)
  const personalAllowance = Math.max(income * 0.01, 200000)
  
  // Consolidated Relief Allowance: Higher of 1% of gross income or NGN 200,000
  // Plus 20% of gross income
  const consolidatedRelief = Math.max(income * 0.01, 200000) + (income * 0.2)
  
  // Taxable Income
  const taxableIncome = Math.max(0, income - personalAllowance - consolidatedRelief)
  
  // Calculate tax using progressive brackets
  let federalTax = 0
  let remainingIncome = taxableIncome
  
  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break
    
    const bracketSize = bracket.max - bracket.min
    const taxableAmount = Math.min(remainingIncome, bracketSize)
    
    federalTax += taxableAmount * bracket.rate
    remainingIncome -= taxableAmount
  }
  
  // State tax is typically a percentage of federal tax (varies by state)
  // Using a simplified 5% of federal tax for this example
  const stateTax = federalTax * 0.05
  
  const totalTax = federalTax + stateTax
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0
  
  return {
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    totalTax: Math.round(totalTax),
    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    breakdown: {
      taxableIncome: Math.round(taxableIncome),
      personalAllowance: Math.round(personalAllowance),
      consolidatedRelief: Math.round(consolidatedRelief),
    }
  }
}

export function calculateCompanyIncomeTax(revenue: number, expenses: number): number {
  const profit = revenue - expenses
  const taxRate = 0.30 // 30% for large companies
  return Math.max(0, profit * taxRate)
}

export function calculateVAT(amount: number): number {
  return amount * 0.075 // 7.5% VAT in Nigeria
}
