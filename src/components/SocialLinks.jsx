import { SOCIAL_LINKS } from '../data/socialLinks'

// variant "dark": para fondos carbón (footer). variant "light": para fondos claros (factura).
const VARIANTS = {
  dark: {
    size: 'h-10 w-10',
    icon: 'h-[18px] w-[18px]',
    button:
      'border border-dorado/30 bg-carbon-suave text-dorado shadow-[0_8px_20px_-12px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:border-fuego hover:bg-fuego hover:text-white hover:shadow-[0_12px_24px_-10px_rgba(241,90,36,0.7)] focus-visible:ring-dorado focus-visible:ring-offset-carbon',
  },
  light: {
    size: 'h-9 w-9',
    icon: 'h-4 w-4',
    button:
      'border border-arena bg-white text-fuego-oscuro hover:-translate-y-0.5 hover:border-fuego hover:bg-fuego hover:text-white focus-visible:ring-fuego focus-visible:ring-offset-crema',
  },
}

function SocialLinks({ variant = 'dark' }) {
  const styles = VARIANTS[variant]

  return (
    <ul className="flex items-center gap-3">
      {SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex ${styles.size} items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles.button}`}
          >
            <svg
              className={`${styles.icon} transition-transform duration-300 group-hover:scale-110`}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d={social.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
