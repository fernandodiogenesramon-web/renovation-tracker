import { useState } from 'react'

interface Props {
  value: number | ''
  onChange: (val: number | '') => void
  placeholder?: string
  className?: string
}

export default function MoneyInput({ value, onChange, placeholder, className }: Props) {
  const [focused, setFocused] = useState(false)

  // format number → "1.234,56"
  function formatDisplay(val: number | '') {
    if (val === '') return ''
    return Number(val).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // when typing, strip everything except digits and comma
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    if (raw === '') { onChange(''); return }
    // treat last 2 digits as cents
    const number = Number(raw) / 100
    onChange(number)
  }

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8a96e] text-sm font-mono pointer-events-none">
        R$
      </span>
      <input
        type={focused ? 'text' : 'text'}
        inputMode="numeric"
        value={focused ? (value === '' ? '' : formatDisplay(value)) : (value === '' ? '' : formatDisplay(value))}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? '0,00'}
        className={`${className} pl-9`}
      />
    </div>
  )
}