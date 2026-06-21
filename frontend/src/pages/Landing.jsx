import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Nav from '../components/Nav';

const CO = ['Razorpay','Zepto','CRED','PhonePe','Groww','BrowserStack','Meesho','Swiggy','Ola','Flipkart','Atlassian','Postman'];
const FEATURES = [
  ['💰','Salary visible upfront','Every listing shows exact salary range. No more wasting time on interviews only to learn the range doesn\'t work for you.'],
  ['✅','Verified companies only','We verify every company before they can post. No fake listings, ghost jobs, or recruiters farming résumés.'],
  ['⚡','Real-time status updates','Know exactly where you stand — Applied, Reviewing, Interview, Offer — updated by the company in real time.'],
  ['🎯','One profile, everywhere','Build your profile once. One click apply. Your resume, skills, and experience auto-fills every application.'],
  ['📊','Application analytics','See how many people applied, how you compare, and which companies viewed your profile. Actual data.'],
  ['🔒','Your data is yours','We don\'t sell your data or let companies contact you without permission. You control who sees your profile.'],
];
const ROLES = ['React Developer','Product Manager','DevOps Engineer','Data Scientist','UI/UX Designer','Backend Engineer','Android Developer','Machine Learning'];

export default function Landing() {
  const navigate = useNavigate();
  const { token, user } = useSelector(s => s.auth);
  useEffect(() => { if (token) navigate(user?.userType === 'company' ? '/company' : '/seeker'); }, [token]);

  return (
    <div style={{ background: '#fff' }}>
      <Nav />

      <section className="landing-hero">
        <div className="container">
          <div className="hero-eyebrow"><span />12,400+ active jobs across India</div>
          <h1 className="hero-h1">The honest job portal<br />for India's builders.</h1>
          <p className="hero-p">Salary transparent. Companies verified. Applications tracked in real time. No spam, no ghost jobs, no surprises.</p>
          <div className="hero-actions">
            <button className="btn btn-xl btn-primary" onClick={() => navigate('/register?type=seeker')}>
              Find jobs
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn btn-xl btn-secondary" onClick={() => navigate('/register?type=company')}>Post jobs for free</button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '0.3px', marginBottom: 10 }}>TRENDING ROLES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {ROLES.map(r => <button key={r} className="chip" onClick={() => navigate(`/jobs?q=${encodeURIComponent(r)}`)}>{r}</button>)}
            </div>
          </div>
          <div className="hero-stats">
            {[['10K+','Verified companies'],['5L+','Active jobs'],['2M+','Job seekers'],['94%','Success rate']].map(([n, l]) => (
              <div key={l}><div className="hero-stat-n">{n}</div><div className="hero-stat-l">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center', marginBottom: 10 }}>Trusted by India's best</div>
        <div className="marquee-row">
          {[...CO, ...CO].map((c, i) => <span key={i} className="marquee-item">{c}</span>)}
        </div>
      </div>

      <section className="features-section">
        <div className="container">
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Why HireNext</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-1px', marginBottom: 14, lineHeight: 1.1 }}>Built on what job seekers actually want.</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65 }}>We talked to 500 engineers and designers about what they hated about job boards. Then we fixed all of it.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(([icon, title, desc]) => (
              <div key={title} className="feature-box">
                <div className="feature-icon">{icon}</div>
                <div className="feature-title">{title}</div>
                <div className="feature-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-h">Start applying in 2 minutes.</h2>
          <p className="cta-p">Free forever for job seekers. No credit card needed.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-xl" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }} onClick={() => navigate('/register')}>Create free account</button>
            <button className="btn btn-xl" style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => navigate('/jobs')}>Browse without signing up</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Hire<em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>Next</em></div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>© 2025 HireNext · Made in India 🇮🇳</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy','Terms','Contact'].map(l => <span key={l} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer' }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
