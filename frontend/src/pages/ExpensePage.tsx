import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from '../components/Badge'
import { expenseService } from '../services/expenseService'
import { paymentService } from '../services/paymentService'
import { renovationService } from '../services/renovationService'
import { sponsorService } from '../services/sponsorService'
import { expenseTypeService } from '../services/expenseTypeService'
import DateInput from '../components/DateInput'
import MoneyInput from '../components/MoneyInput'
import type {
  ExpenseRequest,
  ExpenseStatus,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentType,
  RenovationResponse,
  SponsorResponse,
  ExpenseTypeResponse,
} from '../types'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined) {
  if (value == null) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })
}

function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function paymentTypeVariant(type: PaymentType) {
  if (type === 'PIX') return 'pix'
  if (type === 'CREDIT') return 'credit'
  return 'debit'
}

const STATUSES: ExpenseStatus[] = ['PENDING', 'IN_PROGRESS', 'FINALIZED']
const PAYMENT_TYPES: PaymentType[] = ['PIX', 'CREDIT', 'DEBIT']
const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PAID']

// ─── payment row type ─────────────────────────────────────────────────────────

interface PaymentRow {
  date: string
  amount: number | ''
  paymentType: PaymentType
  status: PaymentStatus
}

const emptyPaymentRow: PaymentRow = {
  date: '',
  amount: '',
  paymentType: 'PIX',
  status: 'PENDING',
}

// ─── component ────────────────────────────────────────────────────────────────

export default function ExpensePage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const expenseId = id ? Number(id) : null

  // ── expense form state ──────────────────────────────────────────────────────
  const [description, setDescription] = useState('')
  const [totalAmount, setTotalAmount] = useState<number | ''>('')
  const [expenseDate, setExpenseDate] = useState('')
  const [serviceDeliveryDate, setServiceDeliveryDate] = useState('')
  const [status, setStatus] = useState<ExpenseStatus>('PENDING')
  const [expenseTypeId, setExpenseTypeId] = useState<number | ''>('')
  const [sponsorId, setSponsorId] = useState<number | ''>('')
  const [renovationId, setRenovationId] = useState<number | ''>('')
  const [invoiceImageUrl, setInvoiceImageUrl] = useState('')

  // ── reference data ──────────────────────────────────────────────────────────
  const [renovations, setRenovations] = useState<RenovationResponse[]>([])
  const [sponsors, setSponsors] = useState<SponsorResponse[]>([])
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeResponse[]>([])

  // ── payment state ───────────────────────────────────────────────────────────
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [addingRow, setAddingRow] = useState(false)
  const [newRow, setNewRow] = useState<PaymentRow>(emptyPaymentRow)
  const [savingNew, setSavingNew] = useState(false)
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<PaymentRow>(emptyPaymentRow)
  const [savingEdit, setSavingEdit] = useState(false)

  // ── page state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ── load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        await Promise.all([
          renovationService.getAll().then(r => setRenovations(r.data)),
          sponsorService.getAll().then(r => setSponsors(r.data)),
          expenseTypeService.getAll().then(r => setExpenseTypes(r.data)),
        ])
        if (!isNew && expenseId) {
          const [expRes, payRes] = await Promise.all([
            expenseService.getById(expenseId),
            paymentService.getByExpense(expenseId),
          ])
          const e = expRes.data
          setDescription(e.description)
          setTotalAmount(e.totalAmount)
          setExpenseDate(e.expenseDate)
          setServiceDeliveryDate(e.serviceDeliveryDate)
          setStatus(e.status)
          setExpenseTypeId(e.expenseTypeId)
          setSponsorId(e.sponsorId)
          setRenovationId(e.renovationId)
          setInvoiceImageUrl(e.invoiceImageUrl ?? '')
          setPayments(payRes.data)
        }
      } catch {
        setError(t('expensePage.errors.loadFailed'))
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id])

  async function refreshPayments() {
    if (!expenseId) return
    const res = await paymentService.getByExpense(expenseId)
    setPayments(res.data)
  }

  function showSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  // ── expense save ────────────────────────────────────────────────────────────

  function validate() {
    if (!description.trim()) { setError(t('expensePage.errors.descriptionRequired')); return false }
    if (!totalAmount) { setError(t('expensePage.errors.amountRequired')); return false }
    if (!expenseDate) { setError(t('expensePage.errors.expenseDateRequired')); return false }
    if (!serviceDeliveryDate) { setError(t('expensePage.errors.deliveryDateRequired')); return false }
    if (!renovationId) { setError(t('expensePage.errors.renovationRequired')); return false }
    if (!expenseTypeId) { setError(t('expensePage.errors.typeRequired')); return false }
    if (!sponsorId) { setError(t('expensePage.errors.sponsorRequired')); return false }
    return true
  }

  async function handleSaveExpense() {
    if (!validate()) return
    try {
      setSaving(true)
      setError(null)
      const payload: ExpenseRequest = {
        description: description.trim(),
        totalAmount: Number(totalAmount),
        expenseDate,
        serviceDeliveryDate,
        status,
        expenseTypeId: Number(expenseTypeId),
        sponsorId: Number(sponsorId),
        renovationId: Number(renovationId),
        invoiceImageUrl: invoiceImageUrl || undefined,
      }
      if (isNew) {
        await expenseService.create(payload)
        showSuccess(t('expensePage.success.created'))
        navigate(`/expenses`)
      } else {
        await expenseService.update(expenseId!, payload)
        showSuccess(t('expensePage.success.updated'))
        navigate(`/expenses`)
      }
    } catch {
      setError(t('expensePage.errors.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  // ── payment actions ─────────────────────────────────────────────────────────

  function startAdding() {
    setAddingRow(true)
    setNewRow(emptyPaymentRow)
    setEditingPaymentId(null)
  }

  function cancelAdding() {
    setAddingRow(false)
    setNewRow(emptyPaymentRow)
  }

  async function saveNewPayment() {
    if (!newRow.date || !newRow.amount || !expenseId) return
    try {
      setSavingNew(true)
      const payload: PaymentRequest = {
        expenseId,
        date: newRow.date,
        amount: Number(newRow.amount),
        paymentType: newRow.paymentType,
        status: newRow.status,
      }
      await paymentService.create(expenseId, payload)
      setAddingRow(false)
      setNewRow(emptyPaymentRow)
      refreshPayments()
    } catch {
      setError(t('expensePage.errors.paymentSaveFailed'))
    } finally {
      setSavingNew(false)
    }
  }

  function startEditingPayment(payment: PaymentResponse) {
    setEditingPaymentId(payment.id)
    setEditRow({
      date: payment.date,
      amount: payment.amount,
      paymentType: payment.paymentType,
      status: payment.status,
    })
    setAddingRow(false)
  }

  function cancelEditingPayment() {
    setEditingPaymentId(null)
    setEditRow(emptyPaymentRow)
  }

  async function saveEditPayment(paymentId: number) {
    if (!editRow.date || !editRow.amount || !expenseId) return
    try {
      setSavingEdit(true)
      const payload: PaymentRequest = {
        expenseId,
        date: editRow.date,
        amount: Number(editRow.amount),
        paymentType: editRow.paymentType,
        status: editRow.status,
      }
      await paymentService.update(expenseId, paymentId, payload)
      setEditingPaymentId(null)
      refreshPayments()
    } catch {
      setError(t('expensePage.errors.paymentUpdateFailed'))
    } finally {
      setSavingEdit(false)
    }
  }

  async function deletePayment(paymentId: number) {
    if (!confirm(t('common.confirm_delete'))) return
    try {
      await paymentService.delete(expenseId!, paymentId)
      refreshPayments()
    } catch {
      setError(t('expensePage.errors.paymentDeleteFailed'))
    }
  }

  // ── derived totals ──────────────────────────────────────────────────────────

  const totalPaid = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)

  const remaining = (Number(totalAmount) || 0) - totalPaid - totalPending
  const progressPct = totalAmount
    ? Math.min((totalPaid / Number(totalAmount)) * 100, 100)
    : 0

  const stepIndex = STATUSES.indexOf(status)

  // ── shared styles ───────────────────────────────────────────────────────────

  const inputClass = 'bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors font-mono w-full'
  const labelClass = 'text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]'
  const paymentInputClass = 'bg-[#0f0e0c] border border-[#2e2c29] text-[#e8e4dc] px-2 py-1.5 text-xs outline-none focus:border-[#c8a96e] transition-colors font-mono w-full'

  // ── render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="text-[12px] text-[#c8a96e] py-12 text-center">
        {t('common.loading')}
      </div>
    )
  }

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#2e2c29]">
        <div>
          <button
            onClick={() => navigate('/expenses')}
            className="text-[10px] tracking-[0.1em] uppercase text-[#c8a96e] hover:text-[#e8c98e] transition-colors bg-transparent border-none cursor-pointer font-mono mb-3 p-0"
          >
            {t('expensePage.back')}
          </button>
          <h1 className="font-serif text-[36px] leading-none">
            {isNew ? t('expensePage.newTitle') : t('expensePage.editTitle')}{' '}
            <span className="text-[#c8a96e] italic">{t('expensePage.expenseWord')}</span>
          </h1>
          <p className="text-[11px] text-[#c8a96e] mt-1.5 tracking-[0.05em]">
            {isNew ? t('expensePage.newSubtitle') : t('expensePage.editSubtitle')}
          </p>
        </div>
        <button
          onClick={() => handleSaveExpense()}
          disabled={saving}
          className="bg-[#c8a96e] text-[#0f0e0c] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium font-mono cursor-pointer hover:bg-[#e8c98e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-none"
        >
          {saving ? t('common.saving') : isNew ? t('expensePage.createExpense') : t('common.saveChanges')}
        </button>
      </div>

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

      <div className="flex gap-8 items-start">

        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-6">

          {/* STATUS STEPPER */}
          <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">
              {t('expensePage.statusSection')}
            </div>
            <div className="text-[10px] text-[#c8a96e] mb-5">
              {t('expensePage.statusHint')}
            </div>
            <div className="flex items-center">
              {STATUSES.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setStatus(step)}
                    >
                      <div
                        className={`w-7 h-7 flex items-center justify-center text-[11px] border transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]
                          ${active
                            ? 'border-[#c8a96e] bg-[rgba(200,169,110,0.12)] text-[#c8a96e]'
                            : done
                            ? 'border-[#6a9e7f] bg-[rgba(106,158,127,0.12)] text-[#6a9e7f]'
                            : 'border-[#2e2c29] text-[#4a4740]'
                          }`}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                      <div
                        className={`text-[9px] tracking-[0.1em] uppercase mt-1.5 whitespace-nowrap
                          ${active ? 'text-[#c8a96e]' : done ? 'text-[#6a9e7f]' : 'text-[#4a4740]'}`}
                      >
                        {t(`status.${step}`)}
                      </div>
                    </div>
                    {i < STATUSES.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-3 mb-4 ${i < stepIndex ? 'bg-[#6a9e7f]' : 'bg-[#2e2c29]'}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* EXPENSE DETAILS */}
          <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] mb-6 pb-3 border-b border-[#2e2c29]">
              {t('expensePage.expenseDetails')}
            </div>
            <div className="grid grid-cols-2 gap-5">

              <div className="col-span-2 flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.description')} <span className="text-[#c0614a]">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t('expensePage.descriptionPlaceholder')}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.renovation')} <span className="text-[#c0614a]">*</span>
                </label>
                <select
                  value={renovationId}
                  onChange={e => setRenovationId(e.target.value ? Number(e.target.value) : '')}
                  className={inputClass}
                >
                  <option value="">{t('expensePage.selectRenovation')}</option>
                  {renovations.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.expenseType')} <span className="text-[#c0614a]">*</span>
                </label>
                <select
                  value={expenseTypeId}
                  onChange={e => setExpenseTypeId(e.target.value ? Number(e.target.value) : '')}
                  className={inputClass}
                >
                  <option value="">{t('expensePage.selectType')}</option>
                  {expenseTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.sponsor')} <span className="text-[#c0614a]">*</span>
                </label>
                <select
                  value={sponsorId}
                  onChange={e => setSponsorId(e.target.value ? Number(e.target.value) : '')}
                  className={inputClass}
                >
                  <option value="">{t('expensePage.selectSponsor')}</option>
                  {sponsors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.totalAmount')} <span className="text-[#c0614a]">*</span>
                </label>
                <MoneyInput
                  value={totalAmount}
                  onChange={setTotalAmount}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.expenseDate')} <span className="text-[#c0614a]">*</span>
                </label>
                <DateInput
                  value={expenseDate}
                  onChange={setExpenseDate}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>
                  {t('expensePage.serviceDeliveryDate')} <span className="text-[#c0614a]">*</span>
                </label>
                <DateInput
                  value={serviceDeliveryDate}
                  onChange={setServiceDeliveryDate}
                  className={inputClass}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <label className={labelClass}>{t('expensePage.invoiceImageUrl')}</label>
                <input
                  type="text"
                  value={invoiceImageUrl}
                  onChange={e => setInvoiceImageUrl(e.target.value)}
                  placeholder={t('expensePage.invoicePlaceholder')}
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* PAYMENTS */}
          {!isNew && (
            <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e]">
                  {t('expensePage.paymentsSection')}
                </div>
                {!addingRow && (
                  <button
                    onClick={startAdding}
                    className="border border-dashed border-[#c8a96e] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:bg-[rgba(200,169,110,0.08)] transition-colors bg-transparent"
                  >
                    {t('expensePage.addPayment')}
                  </button>
                )}
              </div>

              {payments.length === 0 && !addingRow ? (
                <div className="text-[12px] text-[#c8a96e] py-6 text-center border border-dashed border-[#2e2c29]">
                  {t('expensePage.noPayments')}
                </div>
              ) : (
                <div className="border border-[#2e2c29] overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {[
                          t('expensePage.paymentDate'),
                          t('expensePage.paymentAmount'),
                          t('expensePage.paymentType'),
                          t('expensePage.paymentStatus'),
                          '',
                        ].map((h, i) => (
                          <th
                            key={i}
                            className="text-left text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] px-3 py-2.5 bg-[#242220] border-b border-[#2e2c29] font-normal whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>

                      {payments.map(payment => (
                        <tr key={payment.id} className="hover:bg-[#242220] transition-colors">
                          {editingPaymentId === payment.id ? (
                            <>
                              <td className="px-3 py-2 border-b border-[#2e2c29]">                                
                                <DateInput value={editRow.date} onChange={val => setEditRow(r => ({ ...r, date: val }))} className={paymentInputClass} />
                              </td>
                              <td className="px-3 py-2 border-b border-[#2e2c29]">
                                <MoneyInput value={editRow.amount} onChange={val => setEditRow(r => ({ ...r, amount: val }))} className={paymentInputClass} />
                              </td>
                              <td className="px-3 py-2 border-b border-[#2e2c29]">
                                <select value={editRow.paymentType} onChange={e => setEditRow(r => ({ ...r, paymentType: e.target.value as PaymentType }))} className={paymentInputClass}>
                                  {PAYMENT_TYPES.map(pt => <option key={pt} value={pt}>{t(`paymentType.${pt}`)}</option>)}
                                </select>
                              </td>
                              <td className="px-3 py-2 border-b border-[#2e2c29]">
                                <select value={editRow.status} onChange={e => setEditRow(r => ({ ...r, status: e.target.value as PaymentStatus }))} className={paymentInputClass}>
                                  {PAYMENT_STATUSES.map(ps => <option key={ps} value={ps}>{t(`paymentStatus.${ps}`)}</option>)}
                                </select>
                              </td>
                              <td className="px-3 py-2 border-b border-[#2e2c29]">
                                <div className="flex gap-1.5 justify-end">
                                  <button onClick={() => saveEditPayment(payment.id)} disabled={savingEdit} className="border border-[#6a9e7f] text-[#6a9e7f] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:bg-[rgba(106,158,127,0.1)] transition-colors bg-transparent disabled:opacity-40">
                                    {savingEdit ? '...' : t('common.save')}
                                  </button>
                                  <button onClick={cancelEditingPayment} className="border border-[#2e2c29] text-[#c8a96e] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors bg-transparent">
                                    {t('common.cancel')}
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 py-3 text-xs border-b border-[#2e2c29] text-[#c8a96e]">{formatDate(payment.date)}</td>
                              <td className="px-3 py-3 text-xs border-b border-[#2e2c29] text-[#c8a96e] font-serif">{formatCurrency(payment.amount)}</td>
                              <td className="px-3 py-3 border-b border-[#2e2c29]">
                                <Badge variant={paymentTypeVariant(payment.paymentType)}>{t(`paymentType.${payment.paymentType}`)}</Badge>
                              </td>
                              <td className="px-3 py-3 border-b border-[#2e2c29]">
                                <Badge variant={payment.status === 'PAID' ? 'paid' : 'pending'}>{t(`paymentStatus.${payment.status}`)}</Badge>
                              </td>
                              <td className="px-3 py-3 border-b border-[#2e2c29]">
                                <div className="flex gap-1.5 justify-end">
                                  <button onClick={() => startEditingPayment(payment)} className="border border-[#2e2c29] text-[#c8a96e] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors bg-transparent">
                                    {t('common.edit')}
                                  </button>
                                  <button onClick={() => deletePayment(payment.id)} className="border border-[#2e2c29] text-[#c8a96e] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:border-[#c0614a] hover:text-[#c0614a] transition-colors bg-transparent">
                                    {t('common.delete')}
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}

                      {addingRow && (
                        <tr className="bg-[rgba(200,169,110,0.04)]">
                          <td className="px-3 py-2 border-b border-[#2e2c29]">
                            <DateInput value={editRow.date} onChange={val => setEditRow(r => ({ ...r, date: val }))} className={paymentInputClass} />
                          </td>
                          <td className="px-3 py-2 border-b border-[#2e2c29]">
                            <MoneyInput value={editRow.amount} onChange={val => setEditRow(r => ({ ...r, amount: val }))} className={paymentInputClass} />
                          </td>
                          <td className="px-3 py-2 border-b border-[#2e2c29]">
                            <select value={newRow.paymentType} onChange={e => setNewRow(r => ({ ...r, paymentType: e.target.value as PaymentType }))} className={paymentInputClass}>
                              {PAYMENT_TYPES.map(pt => <option key={pt} value={pt}>{t(`paymentType.${pt}`)}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2 border-b border-[#2e2c29]">
                            <select value={newRow.status} onChange={e => setNewRow(r => ({ ...r, status: e.target.value as PaymentStatus }))} className={paymentInputClass}>
                              {PAYMENT_STATUSES.map(ps => <option key={ps} value={ps}>{t(`paymentStatus.${ps}`)}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2 border-b border-[#2e2c29]">
                            <div className="flex gap-1.5 justify-end">
                              <button onClick={saveNewPayment} disabled={savingNew} className="border border-[#6a9e7f] text-[#6a9e7f] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:bg-[rgba(106,158,127,0.1)] transition-colors bg-transparent disabled:opacity-40">
                                {savingNew ? '...' : t('common.save')}
                              </button>
                              <button onClick={cancelAdding} className="border border-[#2e2c29] text-[#c8a96e] px-2.5 py-1 text-[10px] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors bg-transparent">
                                {t('common.cancel')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* HINT when creating new expense */}
          {isNew && (
            <div className="text-[11px] text-[#c8a96e] px-4 py-3 border border-dashed border-[#2e2c29]">
              {t('expensePage.newExpenseHint')}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN — only shown for existing expenses */}
        {!isNew && (
          <div className="w-[240px] shrink-0 flex flex-col gap-4">

            <div className="bg-[#1a1917] border border-[#2e2c29] p-5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">{t('expensePage.totalAmountLabel')}</div>
              <div className="font-serif text-[28px] text-[#c8a96e] leading-none">
                {formatCurrency(Number(totalAmount))}
              </div>
            </div>

            <div className="bg-[#1a1917] border border-[#2e2c29] p-5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">{t('expensePage.paidLabel')}</div>
              <div className="font-serif text-[24px] text-[#6a9e7f] leading-none">
                {formatCurrency(totalPaid)}
              </div>
            </div>

            <div className="bg-[#1a1917] border border-[#2e2c29] p-5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">{t('expensePage.plannedLabel')}</div>
              <div className="font-serif text-[24px] text-[#c0614a] leading-none">
                {formatCurrency(totalPending)}
              </div>
            </div>

            <div className="bg-[#1a1917] border border-[#2e2c29] p-5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">{t('expensePage.unplannedLabel')}</div>
              <div className={`font-serif text-[24px] leading-none ${remaining <= 0 ? 'text-[#6a9e7f]' : 'text-[#e8e4dc]'}`}>
                {formatCurrency(remaining)}
              </div>
              {remaining <= 0 && (
                <div className="text-[9px] text-[#6a9e7f] mt-1.5">{t('expensePage.fullyPlanned')}</div>
              )}
            </div>

            <div className="bg-[#1a1917] border border-[#2e2c29] p-5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-3">{t('expensePage.progressLabel')}</div>
              <div className="h-[6px] bg-[#2e2c29] mb-2">
                <div
                  className="h-full bg-[#6a9e7f] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[10px] text-[#c8a96e]">
                {t('expensePage.paidPct', { pct: progressPct.toFixed(0) })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}