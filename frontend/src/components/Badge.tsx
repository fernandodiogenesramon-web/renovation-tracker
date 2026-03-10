type Variant = 'paid' | 'pending' | 'inProgress' | 'finalized' | 'type' | 'pix' | 'credit' | 'debit'

const variants: Record<Variant, string> = {
  paid:       'bg-[rgba(106,158,127,0.15)] text-[#6a9e7f]',
  pending:    'bg-[rgba(192,97,74,0.15)] text-[#c0614a]',
  inProgress: 'bg-[rgba(90,143,168,0.15)] text-[#5a8fa8]',
  finalized:  'bg-[rgba(106,158,127,0.15)] text-[#6a9e7f]',
  type:       'bg-[rgba(200,169,110,0.1)] text-[#c8a96e]',
  pix:        'bg-[rgba(106,158,127,0.12)] text-[#6a9e7f]',
  credit:     'bg-[rgba(90,143,168,0.12)] text-[#5a8fa8]',
  debit:      'bg-[rgba(200,169,110,0.12)] text-[#c8a96e]',
}

interface Props {
  variant?: Variant
  children: React.ReactNode
}

export default function Badge({ variant = 'type', children }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] tracking-[0.08em] uppercase ${variants[variant]}`}>
      {children}
    </span>
  )
}