import api from './api'
import type { SponsorRequest, SponsorResponse } from '../types'

export const sponsorService = {
  getAll: () => api.get<SponsorResponse[]>('/sponsors'),
  getById: (id: number) => api.get<SponsorResponse>(`/sponsors/${id}`),
  create: (data: SponsorRequest) => api.post<SponsorResponse>('/sponsors', data),
  update: (id: number, data: SponsorRequest) => api.put<SponsorResponse>(`/sponsors/${id}`, data),
  delete: (id: number) => api.delete(`/sponsors/${id}`),
}