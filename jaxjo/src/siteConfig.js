/**
 * JAXJO site content — edit this file to swap placeholders for real copy.
 *
 * After you meet with Dad:
 * 1. Update phone, email, and service area
 * 2. Replace service titles/descriptions
 * 3. Drop real merch photos in /public/merch and set image: '/merch/hat.jpg'
 * 4. Paste Stripe Payment Links into merch[].buyUrl
 */

export const site = {
  companyName: 'JAXJO',
  legalName: 'JAXJO LLC',
  tagline: 'Reliable lawn care and landscaping for your home.',
  shortDescription:
    'We show up, we work hard, and we leave the yard looking the way it should.',

  // Contact — swap these first
  phone: '(555) 000-0000',
  phoneHref: 'tel:+15550000000',
  email: 'hello@jaxjo.com',
  serviceArea: 'Your town and nearby neighborhoods',
  serviceAreaDetail:
    'Residential properties in [City] and surrounding communities. Exact service area to be confirmed.',

  about:
    'JAXJO is a local, family-run landscaping company. We take care of lawns, beds, and seasonal cleanup so you don’t have to — week after week, season after season.',

  heroImage: {
    // Set to a path like '/photos/hero.jpg' once you have a yard photo.
    src: '',
    alt: 'A freshly maintained residential lawn',
    label: 'Yard photo coming soon',
  },

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Merch', href: '#merch' },
    { label: 'Contact', href: '#contact' },
  ],

  services: [
    {
      id: 'lawn-care',
      title: 'Lawn Care',
      description: 'Mowing, edging, and blowing so the yard stays clean and even.',
      icon: 'mower',
    },
    {
      id: 'design',
      title: 'Landscaping Design',
      description: 'Beds, plants, and layouts that fit the property — not a catalog look.',
      icon: 'design',
    },
    {
      id: 'seasonal',
      title: 'Seasonal Cleanup',
      description: 'Leaves, debris, and a reset for spring or fall.',
      icon: 'leaf',
    },
    {
      id: 'winter',
      title: 'Winter Care',
      description: 'Off-season work so the yard is ready when grass starts growing again.',
      icon: 'snow',
    },
    {
      id: 'hedge',
      title: 'Hedge & Shrub Care',
      description: 'Trimming and shaping to keep the property neat.',
      icon: 'hedge',
    },
  ],

  workPhotos: [
    { id: 1, label: 'Photo 1' },
    { id: 2, label: 'Photo 2' },
    { id: 3, label: 'Photo 3' },
  ],

  merch: [
    {
      id: 'hat',
      name: 'JAXJO Hat',
      price: '$24',
      description: 'Embroidered cap. Photo coming soon.',
      image: '', // e.g. '/merch/hat.jpg'
      // Paste a Stripe Payment Link here later, e.g. 'https://buy.stripe.com/...'
      buyUrl: '',
      placeholder: 'hat',
    },
    {
      id: 'shirt',
      name: 'JAXJO Shirt',
      price: '$28',
      description: 'Soft tee with the JAXJO mark. Photo coming soon.',
      image: '', // e.g. '/merch/shirt.jpg'
      buyUrl: '',
      placeholder: 'shirt',
    },
  ],

  social: [
    { label: 'Facebook', href: '' },
    { label: 'Instagram', href: '' },
  ],

  formName: 'contact',
}
