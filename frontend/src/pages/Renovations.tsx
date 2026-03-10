import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { renovationService } from '../services/renovationService'
import { sponsorService } from '../services/sponsorService'
import type {
  RenovationResponse,
  RenovationRequest,
  RenovationSponsorRequest,
  SponsorResponse,
} from '../types'

interface SponsorRow {
  sponsorId: number | ''
  participationPercentage: number | ''
  existingId?: number
}

const emptyForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: '' as number | '',
}

export default function Renovations() {
  const { t } = useTranslation()

  // LIST STATE
  const [renovations, setRenovations] = useState<RenovationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // PANEL STATE
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // FORM STATE
  const [form, setForm] = useState(emptyForm)
  const [sponsorRows, setSponsorRows] = useState<SponsorRow[]>([
    { sponsorId: '', participationPercentage: '' }
  ])
  const [availableSponsors, setAvailableSponsors] = useState<SponsorResponse[]>([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetchRenovations()
    sponsorService.getAll().then(res => setAvailableSponsors(res.data))
  }, [])

  async function fetchRenovations() {
    try {
      setLoading(true)
      const res = await renovationService.getAll()
      setRenovations(res.data)
    } catch {
      setError(t('renovations.errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setSponsorRows([{ sponsorId: '', participationPercentage: '' }])
    setFormError(null)
    setPanelOpen(true)
  }

  function openEdit(renovation: RenovationResponse) {
    setEditingId(renovation.id)
    setForm({
      name: renovation.name,
      description: renovation.description ?? '',
      startDate: renovation.startDate,
      endDate: renovation.endDate ?? '',
      budget: renovation.budget,
    })
    setSponsorRows(
      renovation.sponsors?.length > 0
        ? renovation.sponsors.map(s => ({
            sponsorId: s.sponsorId,
            participationPercentage: s.participationPercentage,
            existingId: s.id,
          }))
        : [{ sponsorId: '', participationPercentage: '' }]
    )
    setFormError(null)
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditingId(null)
    setFormError(null)
  }

  function updateForm(field: keyof typeof emptyForm, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addSponsorRow() {
    setSponsorRows(prev => [...prev, { sponsorId: '', participationPercentage: '' }])
  }

  function removeSponsorRow(index: number) {
    setSponsorRows(prev => prev.filter((_, i) => i !== index))
  }

  function updateSponsorRow(index: number, field: keyof SponsorRow, value: number | '') {
    setSponsorRows(prev => prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ))
  }

  function totalPercentage() {
    return sponsorRows.reduce((sum, row) =>
      sum + (Number(row.participationPercentage) || 0), 0
    )
  }

  function validate() {
    if (!form.name.trim()) { setFormError(t('renovations.errors.nameRequired')); return false }
    if (!form.startDate) { setFormError(t('renovations.errors.startDateRequired')); return false }
    if (!form.budget) { setFormError(t('renovations.errors.budgetRequired')); return false }
    const filled = sponsorRows.filter(r => r.sponsorId !== '')
    if (filled.length > 0 && totalPercentage() !== 100) {
      setFormError(t('renovations.mustEqual100'))
      return false
    }
    return true
  }

  async function handleSubmit() {
    if (!validate()) return
    try {
      setSaving(true)
      setFormError(null)

      const payload: RenovationRequest = {
        name: form.name.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate || null,
        budget: Number(form.budget),
      }

      let renovationId: number
      if (editingId) {
        await renovationService.update(editingId, payload)
        renovationId = editingId
      } else {
        const res = await renovationService.create(payload)
        renovationId = res.data.id
      }

      const filled = sponsorRows.filter(r => r.sponsorId !== '')
      for (const row of filled) {
        const sponsorPayload: RenovationSponsorRequest = {
          sponsorId: Number(row.sponsorId),
          participationPercentage: Number(row.participationPercentage),
        }
        if (row.existingId) {
          await renovationService.updateSponsor(renovationId, row.existingId, sponsorPayload)
        } else {
          await renovationService.addSponsor(renovationId, sponsorPayload)
        }
      }

      closePanel()
      showSuccess(editingId ? t('renovations.edit') : t('renovations.new'))
      fetchRenovations()
    } catch {
      setFormError(t('renovations.errors.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('common.confirm_delete'))) return
    try {
      await renovationService.delete(id)
      showSuccess(t('common.delete'))
      fetchRenovations()
    } catch {
      setError(t('renovations.errors.deleteFailed'))
    }
  }

  function showSuccess(msg: string) {
    setSuccess(msg)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })
  }

  function formatDate(date: string) {
    return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const pct = totalPercentage()
  const pctGreen = pct === 100

  return (
    <div className="relative">
      <PageHeader
        title={t('renovations.titleMain')}
        titleAccent={t('renovations.titleAccent')}
        subtitle={t('renovations.subtitle')}
      >
        <button
          onClick={openNew}
          className="bg-[#c8a96e] text-[#0f0e0c] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium font-mono cursor-pointer hover:bg-[#e8c98e] transition-colors border-none"
        >
          + {t('renovations.new')}
        </button>
      </PageHeader>

      {/* FEEDBACK */}
      {error && (
        <div className="text-[11px] text-[#c0614a] mb-6 px-3 py-2 border border-[rgba(192,97,74,0.3)] bg-[rgba(192,97,74,0.08)]">
          {error}
        </div>
      )}
      {success && (
        <div className="text-[11px] text-[#6a9e7f] mb-6 px-3 py-2 border border-[rgba(106,158,127,0.3)] bg-[rgba(106,158,127,0.08)]">
          {success}
        </div>
      )}

      {/* RENOVATION CARDS */}
      {loading ? (
        <div className="text-[12px] text-[#c8a96e] py-12 text-center border border-[#2e2c29]">
          {t('common.loading')}
        </div>
      ) : renovations.length === 0 ? (
        <div className="text-[12px] text-[#c8a96e] py-12 text-center border border-[#2e2c29]">
          {t('renovations.noRenovations')}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {renovations.map(renovation => (
            <div
              key={renovation.id}
              className="bg-[#1a1917] border border-[#2e2c29] p-6 hover:border-[#c8a96e] transition-colors"
            >
              <div className="font-serif text-[20px] leading-tight mb-1">{renovation.name}</div>
              <div className="text-[10px] text-[#c8a96e] tracking-[0.05em] mb-3">
                {formatDate(renovation.startDate)}
                {renovation.endDate && ` → ${formatDate(renovation.endDate)}`}
              </div>
              {renovation.description && (
                <div className="text-[11px] text-[#c8a96e] mb-4 leading-relaxed line-clamp-2">
                  {renovation.description}
                </div>
              )}
              <div className="mb-4">
                <div className="text-[9px] tracking-[0.15em] uppercase text-[#4a4740] mb-1">
                  {t('renovations.budget_label')}
                </div>
                <div className="font-serif text-[22px] text-[#c8a96e]">
                  {formatCurrency(renovation.budget)}
                </div>
              </div>
              {renovation.sponsors?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {renovation.sponsors.map(s => (
                    <span
                      key={s.id}
                      className="text-[9px] px-2 py-1 bg-[rgba(200,169,110,0.1)] text-[#c8a96e] tracking-[0.08em] uppercase"
                    >
                      {s.sponsorName} {s.participationPercentage}%
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t border-[#2e2c29]">
                <button
                  onClick={() => openEdit(renovation)}
                  className="flex-1 bg-transparent border border-[#2e2c29] text-[#c8a96e] py-1.5 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(renovation.id)}
                  className="flex-1 bg-transparent border border-[#2e2c29] text-[#c8a96e] py-1.5 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c0614a] hover:text-[#c0614a] transition-colors"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERLAY */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20"
          onClick={closePanel}
        />
      )}

      {/* SLIDE-IN PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-[#1a1917] border-l border-[#2e2c29] z-30 overflow-y-auto transition-transform duration-300 ease-in-out ${
          panelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8">
          {/* PANEL HEADER */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-[#2e2c29]">
            <div>
              <div className="font-serif text-[28px] leading-none">
                {editingId ? t('renovations.edit') : t('renovations.new')}
                <span className="text-[#c8a96e] italic"> </span>
              </div>
              <div className="text-[11px] text-[#c8a96e] mt-1.5">
                {editingId ? t('renovations.editSubtitle') : t('renovations.newSubtitle')}
              </div>
            </div>
            <button
              onClick={closePanel}
              className="text-[#4a4740] hover:text-[#e8e4dc] transition-colors bg-transparent border-none cursor-pointer text-xl leading-none mt-1"
            >
              ✕
            </button>
          </div>

          {/* PROJECT DETAILS SECTION */}
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] mb-5 pb-3 border-b border-[#2e2c29]">
            {t('renovations.name')}
          </div>

          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
                {t('renovations.name')} <span className="text-[#c0614a]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder={t('renovations.namePlaceholder')}
                className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
                {t('renovations.description')}
              </label>
              <textarea
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                placeholder={t('renovations.descriptionPlaceholder')}
                rows={3}
                className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
                {t('renovations.budget')} <span className="text-[#c0614a]">*</span>
              </label>
              <input
                type="number"
                value={form.budget}
                onChange={e => updateForm('budget', e.target.value ? Number(e.target.value) : '')}
                placeholder="0.00"
                className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
                  {t('renovations.startDate')} <span className="text-[#c0614a]">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => updateForm('startDate', e.target.value)}
                  className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
                  {t('renovations.endDate')}
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => updateForm('endDate', e.target.value)}
                  className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* SPONSOR PARTICIPATION SECTION */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2e2c29]">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e]">
              {t('renovations.sponsors')}
            </div>
            <button
              onClick={addSponsorRow}
              className="border border-dashed border-[#c8a96e] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:bg-[rgba(200,169,110,0.08)] transition-colors bg-transparent"
            >
              + {t('renovations.addSponsor')}
            </button>
          </div>

          <div className="flex flex-col gap-2.5 mb-3">
            {sponsorRows.map((row, index) => (
              <div key={index} className="grid grid-cols-[1fr_120px_32px] gap-2 items-center bg-[#242220] border border-[#2e2c29] p-3">
                <select
                  value={row.sponsorId}
                  onChange={e => updateSponsorRow(index, 'sponsorId', e.target.value ? Number(e.target.value) : '')}
                  className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-3 py-2 text-xs outline-none focus:border-[#c8a96e] transition-colors font-mono"
                >
                  <option value="">— {t('renovations.sponsors')} —</option>
                  {availableSponsors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={row.participationPercentage}
                  onChange={e => updateSponsorRow(index, 'participationPercentage', e.target.value ? Number(e.target.value) : '')}
                  placeholder="% ex: 60"
                  min={0}
                  max={100}
                  className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-3 py-2 text-xs outline-none focus:border-[#c8a96e] transition-colors font-mono"
                />
                <button
                  onClick={() => removeSponsorRow(index)}
                  className="w-8 h-8 bg-transparent border border-[#2e2c29] text-[#c0614a] cursor-pointer hover:bg-[#c0614a] hover:text-white hover:border-[#c0614a] transition-colors flex items-center justify-center text-base"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* PERCENTAGE BAR */}
          <div className="h-[3px] bg-[#2e2c29] mb-1.5">
            <div
              className={`h-full transition-all ${pctGreen ? 'bg-[#6a9e7f]' : 'bg-[#c8a96e]'}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className={`text-[10px] mb-8 ${pctGreen ? 'text-[#6a9e7f]' : 'text-[#c8a96e]'}`}>
            {t('renovations.totalParticipation', { total: pct })} {pctGreen ? '✓' : `— ${t('renovations.mustEqual100')}`}
          </div>

          {/* FORM ERROR */}
          {formError && (
            <div className="text-[11px] text-[#c0614a] mb-6 px-3 py-2 border border-[rgba(192,97,74,0.3)] bg-[rgba(192,97,74,0.08)]">
              {formError}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#c8a96e] text-[#0f0e0c] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium font-mono cursor-pointer hover:bg-[#e8c98e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-none"
            >
              {saving ? t('common.saving') : editingId ? t('common.saveChanges') : t('renovations.new')}
            </button>
            <button
              onClick={closePanel}
              className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}