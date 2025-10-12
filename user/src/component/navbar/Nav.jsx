import React from 'react';
 import './nav.css'
export default function Nav() {
  return (
    <header className="header-sticky">
      <div className="container header-content">
        <div className="logo-group">
          <div className="logo-icon">SAAS</div>
          <h1 className="logo-text">Linkify Pro</h1>
        </div>
        
        {/* Mobile Menu Toggle (Hidden Checkbox) */}
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </label>

        <nav className="nav-links-desktop nav-links-mobile">
          <a href="#about" className="nav-link">Who We Are</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <button className="btn btn-primary btn-mobile">Start Free Trial</button>
        </nav>

        <button className="btn btn-primary btn-desktop">Start Free Trial</button>
      </div>
    </header>
  );
}