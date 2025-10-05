import React from 'react';
import './hero.css';

function Hero() {
  return (
    <div className="landing-container">

      {/* 1. HERO SECTION */}
      <section className="section hero">
        <h1 className="heading-1">
          Track, Analyze & Optimize Every Click with <span className="accent-color">Smart Link Management</span>
        </h1>
        <p className="subheading">
          Monitor traffic sources, see real-time performance, and
          <strong> keep every link alive and profitable</strong>.
        </p>

        <a href="#pricing" className="primary-button">
          Start Your 14-Day Free Trial
        </a>
        <p className="disclaimer">No credit card required. Cancel anytime.</p>
      </section>

      {/* 2. WHO WE ARE / VALUE PROPOSITION SECTION */}
      <section className="section about-section">
        <h2 className="section-title">Who We Are: Built By Affiliates, For Affiliates</h2>
        <p className="section-subtitle">
          We’re marketers who know the pain of broken links, missed clicks, and confusing reports. Our platform makes it simple to track performance and grow smarter.
        </p>

        <div className="value-proposition-grid">
          <div className="value-card">
            <div className="value-icon">📈</div>
            <h3 className="value-title">Grow Smarter</h3>
            <p>Understand exactly where your clicks come from—social media, search, or email—and make data-driven decisions.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⏱️</div>
            <h3 className="value-title">Real-Time Insights</h3>
            <p>Track clicks daily, monthly, or yearly with interactive charts. No more waiting for reports—see performance instantly.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h3 className="value-title">Reliable Links</h3>
            <p>Quickly check if links are alive or broken, so you never lose traffic or revenue to dead redirects.</p>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="section features-section">
        <h2 className="section-title">Powerful Features for Serious Tracking</h2>
        <p className="section-subtitle">From traffic source to link health, manage everything from one dashboard.</p>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3 className="feature-title">Link Health Monitoring</h3>
            <p>See which links are live and which are broken, so you can fix issues before they cost you money.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Geo & Source Tracking</h3>
            <p>Know where your traffic comes from—countries, devices, and platforms like social media or search engines.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Advanced Analytics</h3>
            <p>View clicks by day, month, or year with clear charts. Measure growth and optimize your campaigns faster.</p>
          </div>

        </div>
      </section>

      {/* 4. PRICING & FINAL CTA */}
      <section className="section pricing-section" id="pricing">
        <h2 className="section-title">Simple Plans for Every Marketer</h2>
        <p className="section-subtitle">
          Start small, grow big—choose the plan that fits your tracking needs.
        </p>

        <div className="pricing-plans">

          {/* Monthly Plan Card */}
         {/* Monthly Plan Card */}
<div className="plan-card">
  <div className="plan-card-content">
    <h3 className="plan-heading">Monthly Plan</h3>
    <p className="plan-subtext">Flexible and affordable tracking.</p>

    {/* Original Price */}
    <p className="original-price">$49/month</p>

    {/* Discounted Price */}
    <p className="plan-price">$20<span className="plan-duration">/month</span></p>

    <ul className="plan-features">
      <li>✅ Unlimited Click Tracking</li>
      <li>✅ Traffic Source Reports</li>
      <li>✅ Geo & Device Analytics</li>
      <li>✅ Link Health Monitoring</li>
      <li>✅ Standard Support</li>
    </ul>
    <a href="#" className="plan-cta">Start Monthly Plan</a>
  </div>
</div>

{/* Yearly Plan Card */}
<div className="plan-card highlighted-plan">
  <p className="most-popular">MOST POPULAR</p>
  <div className="plan-card-content">
    <h3 className="plan-heading">Yearly Plan</h3>
    <p className="plan-subtext">Commit yearly and save more.</p>

    {/* Original Price */}
    <p className="original-price">$490/year</p>

    {/* Discounted Price */}
    <p className="plan-price accent-color-light">$250<span className="plan-duration">/year</span></p>
    <p className="save-text">SAVE $50 — Best value</p>

    <ul className="plan-features">
      <li>✅ Unlimited Click Tracking</li>
      <li>✅ Everything in Monthly</li>
      <li>✅ Advanced Geo & Device Breakdown</li>
      <li>✅ Unlimited Link Checks</li>
      <li>✅ Priority Support</li>
    </ul>
    <a href="#" className="plan-cta cta-highlight">Start Yearly Plan & Save</a>
  </div>
</div>

        </div>
      </section>

    </div>
  );
}

export default Hero;
