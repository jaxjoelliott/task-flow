import { site } from '../siteConfig'

function isLiveBuyLink(url) {
  return Boolean(url) && /^https?:\/\//.test(url) && !url.includes('REPLACE_ME')
}

function ProductArt({ type, name }) {
  if (type === 'hat') {
    return (
      <svg className="product-art" viewBox="0 0 200 200" role="img" aria-label={`${name} placeholder`}>
        <rect width="200" height="200" fill="#24351c" />
        <ellipse cx="100" cy="128" rx="78" ry="18" fill="#1a2714" />
        <path d="M38 118c8-44 116-44 124 0-18 10-106 10-124 0Z" fill="#3d5c28" />
        <path d="M52 108c10-32 86-32 96 0-14 6-82 6-96 0Z" fill="#4a7032" />
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill="#e7f0dc"
          fontFamily="Bebas Neue, Impact, sans-serif"
          fontSize="22"
          letterSpacing="3"
        >
          JAXJO
        </text>
      </svg>
    )
  }

  return (
    <svg className="product-art" viewBox="0 0 200 200" role="img" aria-label={`${name} placeholder`}>
      <rect width="200" height="200" fill="#2a3324" />
      <path
        d="M62 58c18-10 58-10 76 0l18 12v88c0 6-4 10-10 10H54c-6 0-10-4-10-10V70l18-12Z"
        fill="#5c6b4a"
      />
      <path d="M62 58c10 14 66 14 76 0" fill="none" stroke="#3f4a34" strokeWidth="3" />
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="#e7f0dc"
        fontFamily="Bebas Neue, Impact, sans-serif"
        fontSize="26"
        letterSpacing="3"
      >
        JAXJO
      </text>
    </svg>
  )
}

export default function Merch() {
  return (
    <section className="merch-section" id="merch">
      <div className="section-inner">
        <p className="section-label">Rep the brand</p>
        <h2>Merch</h2>
        <p className="merch-intro">
          Hats and shirts with the JAXJO mark. Real photos and checkout coming soon.
        </p>
        <ul className="merch-grid">
          {site.merch.map((item) => {
            const live = isLiveBuyLink(item.buyUrl)
            return (
              <li key={item.id} className="merch-card">
                <div className="merch-img">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <ProductArt type={item.placeholder} name={item.name} />
                  )}
                </div>
                <div className="merch-info">
                  <h3>{item.name}</h3>
                  <p className="merch-desc">{item.description}</p>
                  <p className="price">{item.price}</p>
                  <a
                    className="btn btn-buy"
                    href={live ? item.buyUrl : '#contact'}
                    target={live ? '_blank' : undefined}
                    rel={live ? 'noopener noreferrer' : undefined}
                  >
                    Buy Now
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
