export interface SponsorResponse {
  id: number
  name: string
}

export interface ExpenseTypeResponse {
  id: number
  name: string
}

export interface RenovationSponsorResponse {
  id: number
  sponsorId: number
  sponsorName: string
  participationPercentage: number
}

export interface RenovationResponse {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  budget: number
  sponsors: RenovationSponsorResponse[]
}

export interface RenovationRequest {
  name: string
  description: string
  startDate: string
  endDate: string
  budget: number
}

export interface RenovationSponsorRequest {
  sponsorId: number
  participationPercentage: number
}

export type ExpenseStatus = 'PENDING' | 'IN_PROGRESS' | 'FINALIZED'
export type PaymentStatus = 'PENDING' | 'PAID'
export type PaymentType = 'CREDIT' | 'DEBIT' | 'PIX'

export interface ExpenseResponse {
  id: number
  description: string
  totalAmount: number
  expenseDate: string
  serviceDeliveryDate: string
  invoiceImageUrl: string
  status: ExpenseStatus
  expenseTypeId: number
  expenseTypeName: string
  sponsorId: number
  sponsorName: string
  renovationId: number
  renovationName: string
  totalPaid: number
  totalPending: number
}

export interface ExpenseRequest {
  description: string
  totalAmount: number
  expenseDate: string
  serviceDeliveryDate: string
  invoiceImageUrl?: string
  status: ExpenseStatus
  expenseTypeId: number
  sponsorId: number
  renovationId: number
}

export interface PaymentResponse {
  id: number
  expenseId: number
  date: string
  amount: number
  status: PaymentStatus
  paymentType: PaymentType
}

export interface PaymentRequest {
  expenseId: number
  date: string
  amount: number
  status: PaymentStatus
  paymentType: PaymentType
}

export interface SponsorRequest {
  name: string
}

export interface ExpenseTypeRequest {
  name: string
}

export interface BudgetSummary {
  totalBudget: number
  totalSpent: number
  totalPaid: number
  totalPending: number
}

export interface StatusSummary {
  status: string
  count: number
  totalAmount: number
}

export interface TypeSummary {
  typeName: string
  count: number
  totalAmount: number
}

export interface SponsorSummary {
  sponsorName: string
  totalAmount: number
  totalPaid: number
}

export interface DashboardResponse {
  budgetSummary: BudgetSummary
  expensesByStatus: StatusSummary[]
  expensesByType: TypeSummary[]
  sponsorContributions: SponsorSummary[]
}
