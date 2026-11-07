import { useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function LinkMark({ small = false }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M12.1 19.9 9.6 22.4a5.1 5.1 0 0 1-7.2-7.2l5.2-5.2a5.1 5.1 0 0 1 7.2 0" />
        <path d="m19.9 12.1 2.5-2.5a5.1 5.1 0 0 1 7.2 7.2l-5.2 5.2a5.1 5.1 0 0 1-7.2 0" />
        <path d="m11.5 20.5 9-9" />
      </svg>
    </span>
  );
}

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function validateUrl(value) {
    try {
      const parsed = new URL(value);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Add a link to get started.');
      return;
    }
    if (!validateUrl(trimmedUrl)) {
      setError('Enter a complete link starting with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'We couldn’t shorten that link. Please try again.');
      }
      if (!data.shortUrl || !data.code) {
        throw new Error('The server returned an unexpected response. Please try again.');
      }
      setResult(data);
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch'
        ? 'Couldn’t reach the link service. Check your connection and try again.'
        : requestError.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Copy isn’t available here. Select the link and copy it instead.');
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Linksy home">
          <LinkMark />
          <span>linksy<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Free link shortener</div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow"><span className="eyebrow-spark">✳</span> YOUR LINKS, A LITTLE LIGHTER</div>
          <h1 id="hero-title">Long story?<br /><span>Make it short.</span></h1>
          <p className="hero-copy">Turn a long, messy URL into a link that’s easy to share and remember.</p>

          <div className="shortener-card">
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="destination-url">Paste your long link</label>
              <div className={`input-row${error ? ' input-row-error' : ''}`}>
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M10 13.8a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7M14 10.2a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 19l1.7-1.7" /></svg>
                </span>
                <input
                  id="destination-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://your-very-long-link.com/goes-here"
                  value={url}
                  onChange={(event) => { setUrl(event.target.value); if (error) setError(''); }}
                  aria-describedby={error ? 'form-message' : 'url-hint'}
                  aria-invalid={Boolean(error)}
                />
                <button className="shorten-button" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner" aria-hidden="true" /> Shortening</> : <>Shorten link <span aria-hidden="true">↗</span></>}
                </button>
              </div>
              {error ? <p className="form-message error-message" id="form-message" role="alert">{error}</p> : <p className="form-message hint-message" id="url-hint">Your link should start with https:// or http://</p>}
            </form>

            {result && (
              <div className="result-panel" role="status" aria-live="polite">
                <div className="result-heading"><span className="success-icon" aria-hidden="true">✓</span><span>Your short link is ready</span></div>
                <div className="result-row">
                  <a className="short-link" href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
                  <button className={`copy-button${copied ? ' copied' : ''}`} type="button" onClick={copyLink} aria-label={copied ? 'Short link copied' : 'Copy short link'}>
                    {copied ? <><span aria-hidden="true">✓</span> Copied</> : <><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="2" /><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg> Copy</>}
                  </button>
                </div>
                <p className="destination-note" title={result.destinationUrl || url}>Goes to <span>{result.destinationUrl || url}</span></p>
              </div>
            )}
          </div>

          <div className="trust-row" aria-label="Benefits">
            <span><i aria-hidden="true">✦</i> Simple by design</span>
            <span><i aria-hidden="true">↗</i> Ready to share</span>
            <span><i aria-hidden="true">⌁</i> Free to use</span>
          </div>
        </section>

        <section className="how-section" aria-labelledby="how-title">
          <div className="section-intro">
            <span className="section-kicker">THREE LITTLE STEPS</span>
            <h2 id="how-title">Short links. <span>Zero fuss.</span></h2>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <div className="step-icon step-icon-blue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M10 13.8a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7M14 10.2a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 19l1.7-1.7" /></svg></div>
              <span className="step-number">01</span><h3>Drop your link</h3><p>Paste any long URL into the box above.</p>
            </article>
            <article className="step-card">
              <div className="step-icon step-icon-lime" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" /></svg></div>
              <span className="step-number">02</span><h3>Make it tiny</h3><p>We’ll turn it into a neat, shareable link.</p>
            </article>
            <article className="step-card">
              <div className="step-icon step-icon-peach" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18m0-18 6 6m-6-6L6 9" /></svg></div>
              <span className="step-number">03</span><h3>Send it anywhere</h3><p>Copy your short link and share away.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer"><a className="footer-brand" href="#top"><LinkMark small /> linksy<span className="brand-period">.</span></a><span>Less link. More room.</span></footer>
    </div>
  );
}

export default App;
