import { site } from '../siteConfig'
import { icons } from '../icons'

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="section-inner">
        <p className="section-label">Who we are</p>
        <h2>About & service area</h2>
        <div className="about-grid">
          <div>
            <p className="about-blurb">{site.about}</p>
            <p className="about-area">
              <strong>Service area.</strong> {site.serviceAreaDetail}
            </p>
          </div>
          <aside className="about-card">
            <p className="about-card-label">Currently serving</p>
            <p className="about-card-value">{site.serviceArea}</p>
            <a className="btn btn-green" href="#contact">
              Request a visit
            </a>
          </aside>
        </div>

        <ul className="photo-grid">
          {site.workPhotos.map((photo) => (
            <li key={photo.id} className="photo-placeholder">
              {icons.photo}
              <span>{photo.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
