import api from './api'
import type { RenovationRequest, RenovationResponse, RenovationSponsorRequest, RenovationSponsorResponse } from '../types'

export const renovationService = {
  getAll: () => api.get<RenovationResponse[]>('/renovations'),
  getById: (id: number) => api.get<RenovationResponse>(`/renovations/${id}`),
  create: (data: RenovationRequest) => api.post<RenovationResponse>('/renovations', data),
  update: (id: number, data: RenovationRequest) => api.put<RenovationResponse>(`/renovations/${id}`, data),
  delete: (id: number) => api.delete(`/renovations/${id}`),
  addSponsor: (renovationId: number, data: RenovationSponsorRequest) =>
    api.post<RenovationSponsorResponse>(`/renovations/${renovationId}/sponsors`, data),
  updateSponsor: (renovationId: number, sponsorId: number, data: RenovationSponsorRequest) =>
    api.put<RenovationSponsorResponse>(`/renovations/${renovationId}/sponsors/${sponsorId}`, data),
  deleteSponsor: (renovationId: number, sponsorId: number) =>
    api.delete(`/renovations/${renovationId}/sponsors/${sponsorId}`),
}