// Google Analytics 4 (gtag). Measurement ID can be overridden at build time
// via REACT_APP_GA_MEASUREMENT_ID; otherwise the Task Flow property is used.
const GA_MEASUREMENT_ID =
  process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-GCZ64876H7';

const isLocalHost = () => {
  if (typeof window === 'undefined') return true;
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

const isAnalyticsEnabled = () =>
  Boolean(GA_MEASUREMENT_ID) && process.env.NODE_ENV === 'production' && !isLocalHost();

export function initAnalytics() {
  if (!isAnalyticsEnabled() || typeof window.gtag === 'function') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

export function pageview(path) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
}
