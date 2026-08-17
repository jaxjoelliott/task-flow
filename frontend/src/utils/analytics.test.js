import { initAnalytics, pageview } from './analytics';

describe('analytics', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    delete window.gtag;
    delete window.dataLayer;
  });

  test('does not load gtag outside production', () => {
    initAnalytics();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  test('pageview is a no-op when gtag is missing', () => {
    expect(() => pageview('/login')).not.toThrow();
  });
});
