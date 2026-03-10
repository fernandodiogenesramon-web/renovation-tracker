import api from './api'
import type { ExpenseTypeResponse, ExpenseTypeRequest } from '../types'

export const expenseTypeService = {
  getAll: () => api.get<ExpenseTypeResponse[]>('/expense-types'),
  getById: (id: number) => api.get<ExpenseTypeResponse>(`/expense-types/${id}`),
  create: (data: ExpenseTypeRequest) => api.post<ExpenseTypeResponse>('/expense-types', data),
  update: (id: number, data: ExpenseTypeRequest) => api.put<ExpenseTypeResponse>(`/expense-types/${id}`, data),
  delete: (id: number) => api.delete(`/expense-types/${id}`),
}