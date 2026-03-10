import api from './api'
import type { ExpenseRequest, ExpenseResponse } from '../types'

export const expenseService = {
  getAll: () => api.get<ExpenseResponse[]>('/expenses'),
  getById: (id: number) => api.get<ExpenseResponse>(`/expenses/${id}`),
  create: (data: ExpenseRequest) => api.post<ExpenseResponse>('/expenses', data),
  update: (id: number, data: ExpenseRequest) => api.put<ExpenseResponse>(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
}