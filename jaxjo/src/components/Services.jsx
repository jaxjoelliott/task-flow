import { site } from '../siteConfig'
import { icons } from '../icons'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <p className="section-label">What we do</p>
        <h2>Services</h2>
        <ul className="services-grid">
          {site.services.map((service) => (
            <li key={service.id} className="service-card">
              <div className="service-icon">{icons[service.icon]}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
