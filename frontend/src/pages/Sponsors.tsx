import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { sponsorService } from '../services/sponsorService'
import type { SponsorResponse, SponsorRequest } from '../types'

export default function Sponsors() {
  const { t } = useTranslation()
  const [sponsors, setSponsors] = useState<SponsorResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSponsors()
  }, [])

  async function fetchSponsors() {
    try {
      setLoading(true)
      const res = await sponsorService.getAll()
      setSponsors(res.data)
    } catch {
      setError(t('sponsors.errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!name.trim()) return
    try {
      const payload: SponsorRequest = { name: name.trim() }
      await sponsorService.create(payload)
      setName('')
      showSuccess(t('sponsors.addSponsor'))
      fetchSponsors()
    } catch {
      setError(t('sponsors.errors.saveFailed'))
    }
  }

  async function handleUpdate(id: number) {
    if (!editingName.trim()) return
    try {
      await sponsorService.update(id, { name: editingName.trim() })
      setEditingId(null)
      setEditingName('')
      showSuccess(t('sponsors.editSponsor'))
      fetchSponsors()
    } catch {
      setError(t('sponsors.errors.saveFailed'))
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('common.confirm_delete'))) return
    try {
      await sponsorService.delete(id)
      showSuccess(t('common.delete'))
      fetchSponsors()
    } catch {
      setError(t('sponsors.errors.deleteFailed'))
    }
  }

  function startEditing(sponsor: SponsorResponse) {
    setEditingId(sponsor.id)
    setEditingName(sponsor.name)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingName('')
  }

  function showSuccess(msg: string) {
    setSuccess(msg)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div>
      <PageHeader title={t('sponsors.titleMain')} titleAccent={t('sponsors.titleAccent')} subtitle={t('sponsors.subtitle')} />

      <div className="flex gap-8 items-start">

        {/* ADD FORM */}
        <div className="bg-[#1a1917] border border-[#2e2c29] p-8 w-[360px] shrink-0">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] mb-6 pb-3 border-b border-[#2e2c29]">
            {t('sponsors.newSponsor')}
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">
              {t('sponsors.sponsorName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder={t('sponsors.namePlaceholder')}
              className="bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono"
            />
          </div>

          {/* FEEDBACK */}
          {error && (
            <div className="text-[11px] text-[#c0614a] mb-4 px-3 py-2 border border-[rgba(192,97,74,0.3)] bg-[rgba(192,97,74,0.08)]">
              {error}
            </div>
          )}
          {success && (
            <div className="text-[11px] text-[#6a9e7f] mb-4 px-3 py-2 border border-[rgba(106,158,127,0.3)] bg-[rgba(106,158,127,0.08)]">
              {success}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="bg-[#c8a96e] text-[#0f0e0c] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium font-mono cursor-pointer hover:bg-[#e8c98e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-none"
          >
            {t('sponsors.addSponsor')}
          </button>
        </div>

        {/* TABLE */}
        <div className="flex-1">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] mb-4">
            {t('sponsors.title')}
          </div>

          {loading ? (
            <div className="text-[12px] text-[#c8a96e] py-8 text-center border border-[#2e2c29]">
              {t('common.loading')}
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-[12px] text-[#c8a96e] py-8 text-center border border-[#2e2c29]">
              {t('sponsors.noSponsors')}
            </div>
          ) : (
            <div className="border border-[#2e2c29] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] px-4 py-3 bg-[#1a1917] border-b border-[#2e2c29] font-normal">{t('sponsors.sponsorName')}</th>
                    <th className="text-left text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] px-4 py-3 bg-[#1a1917] border-b border-[#2e2c29] font-normal">Status</th>
                    <th className="px-4 py-3 bg-[#1a1917] border-b border-[#2e2c29]"></th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map(sponsor => (
                    <tr key={sponsor.id} className="hover:bg-[#242220] transition-colors">
                      <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#e8e4dc]">
                        {editingId === sponsor.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleUpdate(sponsor.id)
                              if (e.key === 'Escape') cancelEditing()
                            }}
                            autoFocus
                            className="bg-[#0f0e0c] border border-[#c8a96e] text-[#e8e4dc] px-3 py-1.5 text-sm outline-none font-mono w-full"
                          />
                        ) : (
                          sponsor.name
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29]">
                        <Badge variant="paid">Ativo</Badge>
                      </td>
                      <td className="px-4 py-3.5 border-b border-[#2e2c29]">
                        <div className="flex gap-2 justify-end">
                          {editingId === sponsor.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(sponsor.id)}
                                className="bg-transparent border border-[#6a9e7f] text-[#6a9e7f] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:bg-[rgba(106,158,127,0.1)] transition-colors"
                              >
                                {t('common.save')}
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors"
                              >
                                {t('common.cancel')}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(sponsor)}
                                className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors"
                              >
                                {t('common.edit')}
                              </button>
                              <button
                                onClick={() => handleDelete(sponsor.id)}
                                className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c0614a] hover:text-[#c0614a] transition-colors"
                              >
                                {t('common.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}