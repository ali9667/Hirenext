import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Nav from '../../components/Nav';
import SeekerSidebar from '../../components/SeekerSidebar';
import JobCard from '../../components/JobCard';
import { appsAPI, seekerAPI, jobsAPI } from '../../api/index';
import { formatDistanceToNow } from 'date-fns';

const ST = { applied:'st-applied', reviewing:'st-reviewing', shortlisted:'st-shortlisted', interview:'st-interview', offer:'st-offer', rejected:'st-rejected', withdrawn:'st-withdrawn' };
const SL = { applied:'Applied', reviewing:'In review', shortlisted:'Shortlisted', interview:'Interview', offer:'🎉 Offer', rejected:'Rejected' };

export default function SeekerHome() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { data: profile } = useQuery({ queryKey: ['sp'], queryFn: () => seekerAPI.profile().then(r => r.data.data) });
  const { data: appsData } = useQuery({ queryKey: ['myapps'], queryFn: () => appsAPI.mine().then(r => r.data.data) });
  const { data: jobsData } = useQuery({ queryKey: ['featured'], queryFn: () => jobsAPI.list({ is_featured: true, limit: 4 }).then(r => r.data) });
  const apps = appsData || [];
  const pct = profile?.profile_completion || 0;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <SeekerSidebar />
        <div className="app-main">
          <div className="page-head">
            <h1 className="page-title">Hello, {user?.full_name?.split(' ')[0]} 👋</h1>
            <p className="page-sub">Here's your job search overview</p>
          </div>

          {pct < 80 && (
            <div className="alert alert-amber" style={{ marginBottom: 20, justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span>Your profile is {pct}% complete. A complete profile gets 4× more views.</span>
              <button className="btn btn-xs btn-secondary" onClick={() => navigate('/seeker/profile')}>Complete profile →</button>
            </div>
          )}

          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Applications', val: apps.length },
              { label: 'In Review', val: apps.filter(a => a.status === 'reviewing').length },
              { label: 'Interviews', val: apps.filter(a => a.status === 'interview').length },
              { label: 'Offers', val: apps.filter(a => a.status === 'offer').length },
            ].map(s => (
              <div key={s.label} className="stat-box">
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>Recent applications</div>
                  <button className="btn btn-xs btn-ghost" onClick={() => navigate('/seeker/applications')}>View all →</button>
                </div>
                {apps.length === 0
                  ? <div className="empty"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round"/></svg><h3>No applications yet</h3><p>Start applying to track your progress</p><button className="btn btn-sm btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/seeker/jobs')}>Browse jobs</button></div>
                  : apps.slice(0, 6).map(a => (
                    <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, color: 'var(--ink-2)' }}>
                        {a.company_id?.company_name?.substring(0,2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{a.job_id?.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.company_id?.company_name} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</div>
                      </div>
                      <span className={`st ${ST[a.status]}`}>{SL[a.status]}</span>
                    </div>
                  ))
                }
              </div>

              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)', marginBottom: 10 }}>Recommended jobs</div>
              <div className="card">
                {jobsData?.data?.slice(0,4).map(j => <JobCard key={j._id} job={j} />)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>Profile strength</div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: 'var(--ink-3)' }}>Completion</span>
                    <span style={{ fontWeight: 700, color: pct >= 80 ? 'var(--green)' : 'var(--amber)' }}>{pct}%</span>
                  </div>
                  <div className="pbar" style={{ marginBottom: 14 }}><div className="pbar-fill" style={{ width: `${pct}%` }} /></div>
                  {profile?.open_to_work && <span className="pill pill-green" style={{ marginBottom: 12, display: 'inline-flex' }}>✓ Open to work</span>}
                  <button className="btn btn-sm btn-secondary btn-full" onClick={() => navigate('/seeker/profile')}>Edit profile</button>
                </div>
              </div>

              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>Quick actions</div>
                <div style={{ padding: '4px 0' }}>
                  {[['Search 12,000+ jobs','/seeker/jobs'],['Update resume','/seeker/profile'],['Track applications','/seeker/applications']].map(([l, h]) => (
                    <div key={l} onClick={() => navigate(h)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid var(--line)', cursor: 'pointer', fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {l}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
