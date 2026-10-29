import { Link } from 'react-router-dom'
import logo from '../assets/logos/logoBaconjrv2.svg'
import SocialLinks from './SocialLinks'

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
