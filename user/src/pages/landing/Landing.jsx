import React, { useState } from "react";
import "./hero.css";
import demo from '../../assets/analytics.png'
export default function Landing() {
  const [billing, setBilling] = useState("monthly"); // "monthly" or "yearly"
  const monthly = { price: 25, original: 49, suffix: "/month" };
  const yearly = { price: 250, original: 590, suffix: "/year" };

  const PRICING = billing === "monthly" ? monthly : yearly;

  const faqs = [
    {
      q: "Is there a free trial?",
      a: "Yes new users get a 5 day free trial with full access to all features.",
    },
    {
      q: "How quickly can I start using LinkMan?",
      a: "Sign up and start creating links immediately no complicated setup required.",
    },
    {
      q: "Is my data secure with LinkMan?",
      a: "Yes all links and analytics are protected with secure encryption and safe account access.",
    },
    {
       q: "Does LinkMan provide detailed analytics?",
      a: "Yes  track clicks, locations, devices, referrers, and export data in CSV or JSON.",
    
    },
    {
       q: "Which export formats are supported?",
      a: "Export links and analytics as CSV, JSON, or copy-ready text formats.",
    },
     {
       q: "Can multiple people manage links together?",

      a: "Yes  for now you can share your account email and password with teammates so they can access and use it on one platform bit we'll add team account we are working on it",
    },
  ];

  const features = [
    { title: "Unlimited Links", desc: "Create and manage unlimited short links with ease. Never worry about limits keep all your links organized and accessible in one place." },
    { title: "Real-Time Dashboard", desc: "Monitor link performance instantly with live charts and filters. Gain actionable insights from real time analytics in a single, easy to use dashboard." },
    { title: "Branded Links", desc: "Use your own brand to create professional, branded links. Make every URL uniquely yours and instantly recognizable across platforms." },
    { title: "Device Tracking", desc: "See exactly which devices your audience uses. Optimize your links based on device specific engagement and user behavior." },
    { title: "Location Tracking", desc: "Track clicks by country, region, and city. Understand where your audience engages most and improve targeting strategies." },
    { title: "One Click Exports", desc: "Export all your link data instantly in CSV or JSON format. Analyze, share, and manage your insights efficiently." },
  ];

  return (
    <div className="lm-root">
      <header className="lm-header">
        <div className="lm-container lm-header-inner">
          <div className="lm-brand">
            <div className="lm-logo" aria-hidden>LM</div>
            <div className="lm-name">
              <span className="lm-title">LinkMan</span>
              <span className="lm-tag">Manage all your links in one smart dashboard</span>
            </div>
          </div>

          <nav className="lm-nav" role="navigation" aria-label="Main">
            <a href="#how" className="lm-link">How it works</a>
            <a href="#features" className="lm-link">Features</a>
            <a href="#pricing" className="lm-link">Pricing</a>
            <a href="#faq" className="lm-link">FAQ</a>
            <a href="#subscribe" className="lm-cta">Get Started</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="lm-hero" aria-label="Hero">
          <div className="lm-container lm-hero-inner">
            <div className="lm-hero-left">
              <h1 className="lm-hero-title">
                Shorten, track, and grow  <span>all your links in one place</span>
              </h1>
              <p className="lm-hero-desc">
                Simple, powerful link management for affiliates, creators, and marketers.
                Shorten links, see real-time analytics, use custom domains, and export data in one click.
              </p>

              <div className="lm-hero-cta">
                <a className="lm-btn primary" href="#pricing" onClick={() => setBilling("monthly")}>
                  Start free trial
                </a>
                <a className="lm-btn ghost" href="#features">See features</a>
              </div>

              <ul className="lm-hero-stats" aria-hidden>
                <li><strong>14-day</strong> free trial</li>
                <li><strong>Trusted</strong> by creators & affiliates</li>
                <li><strong>500K+</strong> links created</li>
              </ul>
            </div>

            <div className="lm-hero-right" aria-hidden>
              <div className="lm-card preview">
                <div className="preview-header">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>

                <div className="preview-body">
                  <div className="preview-row">
                    <div>
                      <div color="#0400ffff" className="short-link">linkman.app/aff-boost</div>
                      <div className="meta">Clicks: <strong>1,294</strong></div>
                    </div>
                    <div className="pill">Active</div>
                  </div>

                  <div  className="chart-placeholder"><img src={demo} alt="" /></div>

                  <div className="preview-features">
                    <span>Geo: US, IN, GB</span>
                    <span>Platform: Mobile</span>
                    <span>Export: CSV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="lm-section lm-about">
          <div className="lm-container">
            <h2 className="section-title">Who we are</h2>
            <p className="section-lead">
             At LinkMan, we understand how overwhelming it can be to manage dozens of links whether you're an affiliate, creator, or marketer. That's why we built a platform that makes link management simple, fast, and stress free.
            </p>
            <p className="section-lead">
              Our mission is to help you track, organize, and optimize all your links in one place. With real-time analytics, intuitive dashboards, and powerful reporting tools, you can see exactly what’s working and make smarter decisions to grow your audience and revenue.
            </p>
            <p className="section-lead">
              We're not just a tool we're a partner in your growth. LinkMan saves you time, keeps you organized, and helps you focus on what truly matters: creating content, connecting with your audience, and expanding your business.
             </p>
          </div>
        </section>

       {/* HOW */}
<section id="how" className="lm-section lm-how">
  <div className="lm-container">
    <h2 className="section-title">How it works</h2>
    <p className="section-lead">
      Get started in minutes — create, share, and track your links with complete control.
    </p>

    <div className="lm-grid-3">
      <div className="how-card">
        <div className="how-step">1</div>
        <h2>Create</h2>
        <p style={{fontSize:'18px'}}> Easily shorten or import any URL and get a custom link with your brand name. Stay fully in control of your links.</p>
      </div>

      <div className="how-card">
        <div className="how-step">2</div>
        <h2>Share</h2>
        <p style={{fontSize:'18px'}}>Share your links anywhere social media, emails, or websites. Spread your content quickly and efficiently.</p>
      </div>

      <div className="how-card">
        <div className="how-step">3</div>
        <h2>Analyze</h2>
        <p style={{fontSize:'18px'}}>Track every click in real time. See which platforms, countries, devices, and even the time and day your links perform best all in one intuitive dashboard.</p>
      </div>
    </div>
  </div>
</section>


        {/* FEATURES */}
        <section id="features" className="lm-section lm-features">
          <div className="lm-container">
            <h2 className="section-title">What you'll gain</h2>
            <p className="section-lead">Everything you need to manage links, analyze performance, and convert more clicks.</p>

            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-ic">✓</div>
                  <h2>{f.title}</h2>
                  <p style={{fontSize:'17px'}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="lm-section lm-pricing">
          <div className="lm-container">
            <div className="pricing-head">
              <div>
                <h2 className="section-title">Simple pricing</h2>
                <p className="section-lead">Monthly or save big with yearly — both include the same powerful features.</p>
              </div>

              <div className="billing-toggle" role="tablist" aria-label="Billing">
                <button
                  className={`toggle-btn ${billing === "monthly" ? "active" : ""}`}
                  onClick={() => setBilling("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`toggle-btn ${billing === "yearly" ? "active" : ""}`}
                  onClick={() => setBilling("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="pricing-grid">
              <div className="price-card recommended">
                <div className="price-card-head">
                  <h3>{billing === "monthly" ? "Monthly Plan" : "Yearly Plan"}</h3>
                  <p className="muted">Same features — better value on yearly</p>
                </div>

                <div className="price-big">
                  <span className="price-amount">${PRICING.price}</span>
                  <span className="price-suffix">{PRICING.suffix}</span>
                </div>

                <div className="price-original">
                  <span className="strike">${PRICING.original}</span> <span className="muted">regular</span>
                </div>

                <ul className="price-features">
                  <li>Unlimited links</li>
                  <li>Real-time dashboard</li>
                  <li>Geo & device reports</li>
                  <li>Custom domains</li>
                </ul>

                <a style={{textAlign:'center',}} className="lm-btn primary large" href="#subscribe">Start free trial</a>
              </div>

              <div className="price-card">
                <h3>Compare</h3>
                <p className="muted">All plans include the same core features. Yearly saves you a big amount.</p>

                <div className="compare-grid">
                  <div className="compare-row">
                    <strong>${monthly.price}{monthly.suffix}</strong>
                    <span className="muted">Monthly (billed monthly)</span>
                  </div>
                  <div className="compare-row">
                    <strong>${yearly.price}{yearly.suffix}</strong>
                    <span className="muted">Yearly (billed annually)</span>
                  </div>
                </div>

                <a className="lm-btn ghost" href="#faq">Learn more</a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="lm-section lm-faq">
          <div className="lm-container">
            <h2 className="section-title">Frequently asked questions</h2>
            <div className="faq-grid">
              {faqs.map((f, i) => (
                <details key={i} className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lm-footer" id="subscribe">
        <div className="lm-container lm-footer-inner">
          <div className="footer-col">
            <div className="lm-brand small">
              <div className="lm-logo small" aria-hidden>LM</div>
              <div>
                <div className="lm-title">LinkMan</div>
                <div className="lm-tag">Manage all your links</div>
              </div>
            </div>

          </div>

         

          <div className="footer-col">
            <h4>Contact</h4>
            <p className="muted">hello@linkman.app</p>

            <form
              className="subscribe-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks — check your inbox for the free trial (demo).");
              }}
            >
              <label className="visually-hidden" htmlFor="email"></label>
              <input id="email" type="email" placeholder="you@company.com" required />
              <button style={{color:'#444',fontSize:'20px'}} className="lm-btn primary small" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
            <p style={{textAlign:'center',marginTop:'10px'}} className="muted">© {new Date().getFullYear()} LinkMan — All rights reserved</p>
      </footer>
    </div>
  );
}
