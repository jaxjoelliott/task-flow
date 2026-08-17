import { useState } from 'react'
import { site } from '../siteConfig'
import { icons } from '../icons'

export default function Header() {
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="logo" onClick={close}>
          {site.companyName}
          <span>{site.legalName}</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? icons.close : icons.menu}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="site-nav" className={open ? 'nav is-open' : 'nav'}>
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a className="nav-call" href={site.phoneHref} onClick={close}>
            Call Now
          </a>
        </nav>
      </div>
    </header>
  )
}
