import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { key: 'dashboard', path: '/dashboard' },
  { key: 'renovations', path: '/renovations' },
  { key: 'expenses', path: '/expenses' },
  { key: 'sponsors', path: '/sponsors' },
]

export default function Sidebar() {
  const { t, i18n } = useTranslation()

  function toggleLanguage() {
    const next = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(next)
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-[#1a1917] border-r border-[#2e2c29] flex flex-col z-10">

      {/* LOGO */}
      <div className="px-6 py-8 border-b border-[#2e2c29]">
        <div className="font-serif text-[22px] leading-none text-[#e8e4dc]">
          {t('nav.appTitlePart1')}<span className="text-[#c8a96e] italic">{t('nav.appTitlePart2')}</span>
        </div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-[#f2f1ed] mt-1.5">
          {t('nav.appSubtitle')}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase font-mono transition-colors ${
                isActive
                  ? 'text-[#c8a96e] bg-[rgba(200,169,110,0.08)]'
                  : 'text-[#7a766e] hover:text-[#e8e4dc] hover:bg-[rgba(255,255,255,0.03)]'
              }`
            }
          >
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </nav>

      {/* LANGUAGE SWITCHER */}
      <div className="px-6 py-5 border-t border-[#2e2c29]">
        <div className="text-[9px] tracking-[0.2em] uppercase text-[#4a4740] mb-2">
          {t('language.label')}
        </div>
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2 border border-[#2e2c29] text-[11px] font-mono text-[#7a766e] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors bg-transparent cursor-pointer"
        >
          <span>{i18n.language === 'pt-BR' ? '🇧🇷  Português' : '🇺🇸  English'}</span>
          <span className="text-[#4a4740]">⇄</span>
        </button>
      </div>

    </aside>
  )
}