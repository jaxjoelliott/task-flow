import { useState } from 'react'
import { site } from '../siteConfig'
import { icons } from '../icons'

export default function Contact() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    data.set('form-name', site.formName)

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      })
    } catch {
      // Local preview has no Netlify Forms backend. Still thank the visitor.
    }

    form.reset()
    setStatus('sent')
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div>
          <p className="section-label">Reach out</p>
          <h2>Contact</h2>
          <p className="contact-lede">
            Call, email, or send a note. We’ll get back to you about availability in{' '}
            {site.serviceArea.toLowerCase()}.
          </p>

          <ul className="contact-list">
            <li className="contact-detail">
              <span className="contact-icon">{icons.phone}</span>
              <div>
                <p>Phone</p>
                <a href={site.phoneHref}>{site.phone}</a>
              </div>
            </li>
            <li className="contact-detail">
              <span className="contact-icon">{icons.mail}</span>
              <div>
                <p>Email</p>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </li>
            <li className="contact-detail">
              <span className="contact-icon">{icons.pin}</span>
              <div>
                <p>Service area</p>
                <p>{site.serviceArea}</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <p className="section-label">Get a quote</p>
          {status === 'sent' ? (
            <p className="form-success" role="status">
              Thanks — we got your message. If this is urgent, call {site.phone}.
            </p>
          ) : (
            <form
              className="contact-form"
              name={site.formName}
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value={site.formName} />
              <p className="honeypot">
                <label>
                  Don’t fill this out
                  <input name="bot-field" />
                </label>
              </p>
              <label>
                Name
                <input type="text" name="name" autoComplete="name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="Yard size, address, and what you need..."
                />
              </label>
              <button className="btn btn-green" type="submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
