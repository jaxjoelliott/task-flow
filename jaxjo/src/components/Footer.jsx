import { site } from '../siteConfig'

export default function Footer() {
  const year = new Date().getFullYear()
  const social = site.social.filter((item) => item.href)

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>{site.companyName}</strong>
          <span>{site.legalName}</span>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={site.phoneHref}>Call</a>
        </nav>
        {social.length > 0 && (
          <nav className="footer-social" aria-label="Social">
            {social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <p className="copyright">
          © {year} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
