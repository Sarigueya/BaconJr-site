import { Link } from 'react-router-dom'
import logo from '../assets/logos/logoBaconjrv2.svg'

const FOOTER_LINKS = [
  {
    title: 'Menú',
    links: [
      { label: 'Carnes', href: '/menu?category=meats' },
      { label: 'Acompañantes', href: '/menu?category=sides' },
      { label: 'Bebidas', href: '/menu?category=drinks' },
      { label: 'Postres', href: '/menu?category=desserts' },
      { label: 'Salsas', href: '/menu?category=sauces' },
    ],
  },
  {
    title: 'Bacon Jr.',
    links: [
      { label: 'Nuestra historia', href: '/#about' },
      { label: 'Ofertas del día', href: '/#offers' },
      { label: 'Trabaja con nosotros', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
]

// Datos de ejemplo: reemplázalos por los reales del negocio.
const CONTACT_INFO = [
  {
    label: 'Dirección',
    value: 'Av. Principal #123, Neiva Huila, Colombia',
    icon: (
      <>
        <path d="M17.66 16.66 13.41 20.9a2 2 0 0 1-2.82 0l-4.25-4.24a8 8 0 1 1 11.32 0Z" />
        <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </>
    ),
  },
  {
    label: 'Horario',
    value: 'Lun a Jue 12:00 – 22:00 · Vie a Dom 12:00 – 23:00',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: 'Pedidos',
    value: '+57 310 123 4567',
    icon: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
  },
]

const LEGAL_LINKS = [
  { label: 'Preguntas frecuentes', href: '#' },
  { label: 'Privacidad', href: '#' },
  { label: 'Términos', href: '#' },
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'TikTok',
    href: '#',
    path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.13a8.16 8.16 0 005.58 2.19V11.2a4.85 4.85 0 01-3.77-1.63V6.69h3.77z',
  },
  {
    label: 'WhatsApp',
    href: '#',
    path: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 01-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 01-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 012.77 6.68c0 5.2-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0012.05.69C5.8.69.7 5.78.7 12.04c0 2 .52 3.95 1.52 5.67L.6 23.6l6.03-1.58a11.3 11.3 0 005.41 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.03z',
  },
]

function SocialLinks() {
  return (
    <ul className="flex items-center gap-3">
      {SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-dorado/30 bg-carbon-suave text-dorado shadow-[0_8px_20px_-12px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-fuego hover:bg-fuego hover:text-white hover:shadow-[0_12px_24px_-10px_rgba(241,90,36,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          >
            <svg
              className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110"
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

function FooterLink({ href, className, children }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

function FooterHeading({ children }) {
  return (
    <h4 className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-dorado uppercase">
      <span className="h-px w-5 bg-fuego" aria-hidden="true" />
      {children}
    </h4>
  )
}

function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-carbon text-crema">
      {/* Línea y resplandor de brasa en la parte superior */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brasa via-fuego to-dorado"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-fuego/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        {/* Llamado a la acción */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuego-oscuro via-fuego-profundo to-brasa px-6 py-8 shadow-[0_24px_60px_-24px_rgba(241,90,36,0.6)] sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-dorado/25 blur-3xl"
          />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.2em] text-dorado uppercase">
              Recién salido del barril
            </p>
            <h3 className="mt-2 text-2xl leading-tight font-black text-white sm:text-3xl">
              ¿Se te antojó un buen asado?
            </h3>
            <p className="mt-2 max-w-md text-sm text-crema/80">
              Haz tu pedido en minutos y recíbelo caliente en tu puerta.
            </p>
          </div>
          <Link
            to="/menu?category=all"
            className="relative mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-carbon px-6 py-3 text-sm font-bold text-dorado transition-all duration-300 hover:-translate-y-0.5 hover:bg-carbon-suave hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado md:mt-0"
          >
            Pedir ahora
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Columnas principales */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" aria-label="Bacon Jr. — Inicio" className="inline-block">
              <img src={logo} alt="Bacon Jr." className="h-14 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-arena/70">
              Asados al barril desde 1995. Sabor, tradición y calidad en cada corte.
            </p>
            <p className="mt-6 mb-3 text-xs font-semibold tracking-[0.2em] text-arena/50 uppercase">
              Síguenos
            </p>
            <SocialLinks />
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <FooterHeading>{column.title}</FooterHeading>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-arena/70 transition-colors hover:text-llama"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-0 rounded-full bg-fuego transition-all duration-300 group-hover:w-1.5"
                      />
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-4">
            <FooterHeading>Visítanos</FooterHeading>
            <ul className="space-y-4">
              {CONTACT_INFO.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-carbon-suave text-llama ring-1 ring-crema/10">
                    <svg
                      className="h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-crema">{item.label}</p>
                    <p className="text-sm leading-relaxed text-arena/70">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-crema/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:px-6 md:flex-row lg:px-8">
          <p className="text-xs text-humo">
            &copy; {new Date().getFullYear()} BACON JR. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <FooterLink
                  href={link.href}
                  className="text-xs text-humo transition-colors hover:text-dorado"
                >
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
