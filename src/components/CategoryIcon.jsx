function Icon({ children }) {
  return (
    <svg
      className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const ICONS = {
  all: (
    <Icon>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </Icon>
  ),
  meats: (
    <Icon>
      <path d="M4 13.5C4 9.36 7.36 6 11.5 6h3a5.5 5.5 0 0 1 0 11h-3A7.5 7.5 0 0 1 4 13.5Z" />
      <path d="M8.5 12.5c1.7-1.7 4.3-1.7 6 0" />
      <path d="M16 4.5c1.2-.8 2.8-.5 3.5.7" />
    </Icon>
  ),
  drinks: (
    <Icon>
      <path d="M6 7h12l-1.1 11.1a2 2 0 0 1-2 1.9H9.1a2 2 0 0 1-2-1.9L6 7Z" />
      <path d="M5 7h14" />
      <path d="M8.5 3.5 10 7" />
    </Icon>
  ),
  desserts: (
    <Icon>
      <path d="M5 20h14" />
      <path d="M6 20v-7.5A2.5 2.5 0 0 1 8.5 10h7a2.5 2.5 0 0 1 2.5 2.5V20" />
      <path d="M6 15c2 1.2 4 1.2 6 0s4-1.2 6 0" />
      <path d="M12 10V7" />
      <path d="M12 4.5v.01" />
    </Icon>
  ),
  sides: (
    <Icon>
      <path d="M6 10h12l-1 10H7L6 10Z" />
      <path d="M8.5 10V5.5M11.5 10V3.5M14.5 10V5M17 10V7" />
    </Icon>
  ),
  sauces: (
    <Icon>
      <path d="M9.5 3h5v3l2 3v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9l2-3V3Z" />
      <path d="M7.5 12h9" />
      <path d="M10 15h4" />
    </Icon>
  ),
}

function CategoryIcon({ id }) {
  return ICONS[id] ?? ICONS.all
}

export default CategoryIcon
