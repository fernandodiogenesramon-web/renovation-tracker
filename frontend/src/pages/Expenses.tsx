import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { expenseService } from '../services/expenseService'
import type { ExpenseResponse, ExpenseStatus } from '../types'

function statusVariant(status: ExpenseStatus) {
  if (status === 'PENDING') return 'pending'
  if (status === 'IN_PROGRESS') return 'inProgress'
  return 'finalized'
}

export default function Expenses() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<ExpenseStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    try {
      setLoading(true)
      const res = await expenseService.getAll()
      setExpenses(res.data)
    } catch {
      setError(t('expenses.errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('common.confirm_delete'))) return
    try {
      await expenseService.delete(id)
      showSuccess(t('common.delete'))
      fetchExpenses()
    } catch {
      setError(t('expenses.errors.deleteFailed'))
    }
  }

  function showSuccess(msg: string) {
    setSuccess(msg)
    setError(null)
    setTimeout(() => setSuccess(null), 3000)
  }

  function formatCurrency(value: number) {
    return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }) ?? '—'
  }

  function formatDate(date: string) {
    return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const filtered = filterStatus === 'ALL'
    ? expenses
    : expenses.filter(e => e.status === filterStatus)

  return (
    <div>
      <PageHeader 
        title={t('expenses.titleMain')} 
        titleAccent={t('expenses.titleAccent')} 
        subtitle={t('expenses.subtitle')}
      >
        <button
          onClick={() => navigate('/expenses/new')}
          className="bg-[#c8a96e] text-[#0f0e0c] px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium font-mono cursor-pointer hover:bg-[#e8c98e] transition-colors border-none"
        >
          + {t('expenses.new')}
        </button>
      </PageHeader>

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

      {/* FILTERS */}
      <div className="flex gap-0 mb-6">
        {(['ALL', 'PENDING', 'IN_PROGRESS', 'FINALIZED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase font-mono border transition-colors cursor-pointer
              ${filterStatus === status
                ? 'bg-[rgba(200,169,110,0.1)] border-[#c8a96e] text-[#c8a96e]'
                : 'bg-transparent border-[#2e2c29] text-[#c8a96e] hover:border-[#c8a96e]'
              } -ml-px first:ml-0`}
          >
            {status === 'ALL' ? t('expenses.all') : t(`status.${status}`)}
            {status !== 'ALL' && (
              <span className="ml-1.5 text-[#4a4740]">
                {expenses.filter(e => e.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-[12px] text-[#c8a96e] py-12 text-center border border-[#2e2c29]">
          {t('common.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-[12px] text-[#c8a96e] py-12 text-center border border-[#2e2c29]">
          {filterStatus === 'ALL'
            ? <span onClick={() => navigate('/expenses/new')} className="text-[#c8a96e] cursor-pointer hover:underline">{t('expenses.new')}</span>
            : t('expenses.noExpenses')
          }
        </div>
      ) : (
        <div className="border border-[#2e2c29] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  t('expenses.description'),
                  t('expenses.renovation'),
                  t('expenses.type'),
                  t('expenses.sponsor'),
                  t('expenses.amount'),
                  t('paymentStatus.PAID'),
                  t('paymentStatus.PENDING'),
                  t('expenses.expenseDate'),
                  t('expenses.status'),
                  '',
                ].map((h, i) => (
                  <th key={i} className="text-left text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] px-4 py-3 bg-[#1a1917] border-b border-[#2e2c29] font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(expense => (
                <tr key={expense.id} className="hover:bg-[#242220] transition-colors">
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#e8e4dc] max-w-[200px]">
                    <div className="truncate">{expense.description}</div>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#c8a96e] whitespace-nowrap">
                    {expense.renovationName}
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#2e2c29] whitespace-nowrap">
                    <Badge variant="type">{expense.expenseTypeName}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#c8a96e] whitespace-nowrap">
                    {expense.sponsorName}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#c8a96e] whitespace-nowrap font-serif">
                    {formatCurrency(expense.totalAmount)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#6a9e7f] whitespace-nowrap">
                    {formatCurrency(expense.totalPaid)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#c0614a] whitespace-nowrap">
                    {formatCurrency(expense.totalPending)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-[#2e2c29] text-[#c8a96e] whitespace-nowrap">
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#2e2c29] whitespace-nowrap">
                    <Badge variant={statusVariant(expense.status)}>
                      {t(`status.${expense.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 border-b border-[#2e2c29]">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/expenses/${expense.id}`)}
                        className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c8a96e] transition-colors whitespace-nowrap"
                      >
                        {t('expenses.open')}
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="bg-transparent border border-[#2e2c29] text-[#c8a96e] px-3 py-1 text-[10px] tracking-[0.08em] uppercase font-mono cursor-pointer hover:border-[#c0614a] hover:text-[#c0614a] transition-colors"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}