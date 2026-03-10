import api from './api'
import type { DashboardResponse } from '../types'

export const dashboardService = {
  getSummary: () => api.get<DashboardResponse>('/dashboard'),
}