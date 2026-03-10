interface Props {
  title: string
  titleAccent: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, titleAccent, subtitle, children }: Props) {
  return (
    <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#2e2c29]">
      <div>
        <h1 className="font-serif text-[36px] leading-none">
          {title}<span className="text-[#c8a96e] italic">{titleAccent}</span>
        </h1>
        {subtitle && (
          <p className="text-[11px] text-[#7a766e] mt-1.5 tracking-[0.05em]">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}