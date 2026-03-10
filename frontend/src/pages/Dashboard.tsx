import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { dashboardService } from '../services/dashboardService'
import type { DashboardResponse } from '../types'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })
}

// ─── colors ──────────────────────────────────────────────────────────────────

const TYPE_COLORS = ['#c8a96e', '#6a9e7f', '#5a8fa8', '#c0614a', '#9b7bb8', '#e8c98e']

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#c0614a',
  IN_PROGRESS: '#5a8fa8',
  FINALIZED: '#6a9e7f',
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
      <div className="text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] mb-3">{label}</div>
      <div className={`font-serif text-[32px] leading-none ${accent ? 'text-[#c8a96e]' : 'text-[#e8e4dc]'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-[#c8a96e] mt-2">{sub}</div>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] tracking-[0.2em] uppercase text-[#c8a96e] mb-4">
      {children}
    </div>
  )
}

// ─── custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1917] border border-[#2e2c29] px-3 py-2 text-[11px] font-mono">
      {label && <div className="text-[#c8a96e] mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  )
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getSummary()
      .then(res => setData(res.data))
      .catch(() => setError(t('dashboard.noDataYet')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-[12px] text-[#4a4740] py-12 text-center">
        {t('common.loading')}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-[12px] text-[#c0614a] py-12 text-center">
        {error ?? t('common.noData')}
      </div>
    )
  }

  const { budgetSummary, expensesByStatus, expensesByType, sponsorContributions } = data

  const budgetUsedPct = budgetSummary.totalBudget > 0
    ? Math.min((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100, 100)
    : 0

  const paidPct = budgetSummary.totalSpent > 0
    ? Math.min((budgetSummary.totalPaid / budgetSummary.totalSpent) * 100, 100)
    : 0

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="mb-10 pb-6 border-b border-[#2e2c29]">
        <h1 className="font-serif text-[36px] leading-none">
          {t('dashboard.title').slice(0, -1)}
          <span className="text-[#c8a96e] italic">{t('dashboard.title').slice(-1)}</span>
        </h1>
        <p className="text-[11px] text-[#c8a96e] mt-1.5 tracking-[0.05em]">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* ── ROW 1: STAT CARDS ── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label={t('dashboard.totalBudget')}
          value={formatCurrency(budgetSummary.totalBudget)}
          accent
        />
        <StatCard
          label={t('dashboard.totalSpent')}
          value={formatCurrency(budgetSummary.totalSpent)}
          sub={t('dashboard.budgetUsed', { pct: budgetUsedPct.toFixed(0) })}
        />
        <StatCard
          label={t('dashboard.totalPaid')}
          value={formatCurrency(budgetSummary.totalPaid)}
          sub={t('dashboard.paidOfSpent', { pct: paidPct.toFixed(0) })}
        />
        <StatCard
          label={t('dashboard.pendingPayments')}
          value={formatCurrency(budgetSummary.totalPending)}
        />
      </div>

      {/* ── BUDGET PROGRESS BAR ── */}
      <div className="bg-[#1a1917] border border-[#2e2c29] p-6 mb-8">
        <SectionTitle>{t('dashboard.budgetVsSpent')}</SectionTitle>
        <div className="flex items-center gap-6 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-[#c8a96e] mb-1.5">
              <span>{t('dashboard.spent')}</span>
              <span>{formatCurrency(budgetSummary.totalSpent)} / {formatCurrency(budgetSummary.totalBudget)}</span>
            </div>
            <div className="h-[8px] bg-[#2e2c29]">
              <div
                className="h-full bg-[#c8a96e] transition-all"
                style={{ width: `${budgetUsedPct}%` }}
              />
            </div>
          </div>
          <div className={`text-[11px] font-mono w-16 text-right ${budgetUsedPct >= 100 ? 'text-[#c0614a]' : 'text-[#c8a96e]'}`}>
            {budgetUsedPct.toFixed(0)}%
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-[#c8a96e] mb-1.5">
              <span>{t('dashboard.paid')}</span>
              <span>{formatCurrency(budgetSummary.totalPaid)} / {formatCurrency(budgetSummary.totalSpent)}</span>
            </div>
            <div className="h-[8px] bg-[#2e2c29]">
              <div
                className="h-full bg-[#6a9e7f] transition-all"
                style={{ width: `${paidPct}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] font-mono w-16 text-right text-[#6a9e7f]">
            {paidPct.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* ── ROW 2: DONUT + STATUS ── */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        {/* EXPENSES BY TYPE — donut */}
        <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
          <SectionTitle>{t('dashboard.expensesByType')}</SectionTitle>
          {expensesByType.length === 0 ? (
            <div className="text-[11px] text-[#4a4740] py-8 text-center">{t('dashboard.noDataYet')}</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={expensesByType}
                    dataKey="totalAmount"
                    nameKey="typeName"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {expensesByType.map((_, i) => (
                      <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => (
                      <CustomTooltip
                        active={active}
                        payload={payload?.map(p => ({
                          name: p.name as string,
                          value: p.value as number,
                          color: p.payload.fill,
                        }))}
                      />
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {expensesByType.map((item, i) => (
                  <div key={item.typeName} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 shrink-0"
                        style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }}
                      />
                      <span className="text-[11px] text-[#e8e4dc]">{item.typeName}</span>
                    </div>
                    <span className="text-[11px] text-[#c8a96e] font-mono">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* EXPENSES BY STATUS */}
        <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
          <SectionTitle>{t('dashboard.expensesByStatus')}</SectionTitle>
          {expensesByStatus.length === 0 ? (
            <div className="text-[11px] text-[#4a4740] py-8 text-center">{t('dashboard.noDataYet')}</div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {expensesByStatus.map(s => {
                const total = expensesByStatus.reduce((sum, x) => sum + x.totalAmount, 0)
                const pct = total > 0 ? (s.totalAmount / total) * 100 : 0
                const color = STATUS_COLORS[s.status] ?? '#c8a96e'
                return (
                  <div key={s.status}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2" style={{ backgroundColor: color }} />
                        <span className="text-[11px] text-[#e8e4dc]">{t(`status.${s.status}`)}</span>
                        <span className="text-[10px] text-[#4a4740]">({s.count})</span>
                      </div>
                      <span className="text-[11px] text-[#c8a96e] font-mono">
                        {formatCurrency(s.totalAmount)}
                      </span>
                    </div>
                    <div className="h-[6px] bg-[#2e2c29]">
                      <div
                        className="h-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── ROW 3: SPONSOR CONTRIBUTIONS ── */}
      <div className="bg-[#1a1917] border border-[#2e2c29] p-6">
        <SectionTitle>{t('dashboard.sponsorContributions')}</SectionTitle>
        {sponsorContributions.length === 0 ? (
          <div className="text-[11px] text-[#4a4740] py-8 text-center">{t('dashboard.noDataYet')}</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={sponsorContributions}
              margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
              barGap={4}
            >
              <CartesianGrid vertical={false} stroke="#2e2c29" />
              <XAxis
                dataKey="sponsorName"
                tick={{ fill: '#c8a96e', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#c8a96e', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalAmount" name={t('dashboard.totalSpentLegend')} fill="#c8a96e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="totalPaid" name={t('dashboard.totalPaidLegend')} fill="#6a9e7f" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {sponsorContributions.length > 0 && (
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#c8a96e]" />
              <span className="text-[10px] text-[#c8a96e]">{t('dashboard.totalSpentLegend')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6a9e7f]" />
              <span className="text-[10px] text-[#c8a96e]">{t('dashboard.totalPaidLegend')}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}