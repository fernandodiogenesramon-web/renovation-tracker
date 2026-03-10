import api from './api'
import type { PaymentRequest, PaymentResponse } from '../types'

export const paymentService = {
  getByExpense: (expenseId: number) =>
    api.get<PaymentResponse[]>(`/expenses/${expenseId}/payments`),
  create: (expenseId: number, data: PaymentRequest) =>
    api.post<PaymentResponse>(`/expenses/${expenseId}/payments`, data),
  update: (expenseId: number, id: number, data: PaymentRequest) =>
    api.put<PaymentResponse>(`/expenses/${expenseId}/payments/${id}`, data),
  delete: (expenseId: number, id: number) =>
    api.delete(`/expenses/${expenseId}/payments/${id}`),
}