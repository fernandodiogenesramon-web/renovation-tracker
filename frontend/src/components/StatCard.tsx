interface Props {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className="bg-[#1a1917] p-6">
      <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-3">{label}</div>
      <div className={`font-serif text-[32px] leading-none ${accent ? 'text-[#c8a96e]' : 'text-[#e8e4dc]'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-[#7a766e] mt-1.5">{sub}</div>}
    </div>
  )
}