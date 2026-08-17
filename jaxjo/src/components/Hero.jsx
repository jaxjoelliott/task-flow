import { site } from '../siteConfig'

export default function Hero() {
  const { heroImage } = site

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{site.legalName}</p>
          <h1>
            {site.companyName}
          </h1>
          <p className="hero-tagline">{site.tagline}</p>
          <p className="hero-lede">{site.shortDescription}</p>
          <div className="hero-actions">
            <a className="btn btn-white" href="#contact">
              Get a Quote
            </a>
            <a className="btn btn-outline" href={site.phoneHref}>
              Call Now
            </a>
          </div>
        </div>

        <div className="hero-media" aria-label={heroImage.alt}>
          {heroImage.src ? (
            <img src={heroImage.src} alt={heroImage.alt} />
          ) : (
            <div className="hero-placeholder">
              <div className="hero-sky" />
              <div className="hero-lawn" />
              <span>{heroImage.label}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
