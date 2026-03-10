import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  value: string        // expects "YYYY-MM-DD"
  onChange: (val: string) => void
  placeholder?: string
  className?: string
}

export default function DateInput({ value, onChange, className }: Props) {
  const ref = useRef<DatePicker>(null)
  const { t } = useTranslation()

  // convert "YYYY-MM-DD" string → Date for the picker
  const selected = value ? new Date(value + 'T12:00:00') : null

  // convert Date → "YYYY-MM-DD" string for your state
  function handleChange(date: Date | null) {
    if (!date) { onChange(''); return }
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    onChange(`${yyyy}-${mm}-${dd}`)
  }

  return (
    <DatePicker
      ref={ref}
      selected={selected}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
      placeholderText={t('common.DateComponentPlaceholder')}
      className={className}
      onKeyDown={e => e.preventDefault()} // prevent manual typing
      onClick={() => ref.current?.setOpen(true)}
    />
  )
}