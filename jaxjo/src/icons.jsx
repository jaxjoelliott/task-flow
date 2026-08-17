function svgIcon(children, size = 22) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const icons = {
  mower: svgIcon(
    <>
      <path d="M4 17h10" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="16" cy="18" r="3" />
      <path d="M4 17V9h7l3 4h4" />
      <path d="M11 9V6" />
    </>,
  ),
  design: svgIcon(
    <>
      <path d="M4 20h16" />
      <path d="M6 20V10l6-6 6 6v10" />
      <path d="M10 20v-5h4v5" />
    </>,
  ),
  leaf: svgIcon(
    <>
      <path d="M5 19c8-1 12-8 14-15-7 2-14 6-14 15Z" />
      <path d="M8 14c2-2 5-4 9-5" />
    </>,
  ),
  snow: svgIcon(
    <>
      <path d="M12 3v18" />
      <path d="m5 7 14 10" />
      <path d="M19 7 5 17" />
      <path d="m8 5 4 2 4-2" />
      <path d="m8 19 4-2 4 2" />
    </>,
  ),
  hedge: svgIcon(
    <>
      <path d="M4 20V9l4-4 4 4v11" />
      <path d="M8 20V9" />
      <path d="M12 20V8l4-3 4 3v12" />
      <path d="M16 20V8" />
    </>,
  ),
  phone: svgIcon(
    <path d="M6 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2Z" />,
    20,
  ),
  mail: svgIcon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>,
    20,
  ),
  pin: svgIcon(
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </>,
    20,
  ),
  photo: svgIcon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 15-5-5-8 8" />
    </>,
    28,
  ),
  menu: svgIcon(<path d="M4 7h16M4 12h16M4 17h16" />),
  close: svgIcon(<path d="M6 6l12 12M18 6 6 18" />),
}
