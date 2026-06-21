import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Nav from '../../components/Nav';
import CompanySidebar from '../../components/CompanySidebar';
import { companyAPI, jobsAPI } from '../../api/index';

export default function CompanyHome() {
  const navigate = useNavigate();
  const { user, profile } = useSelector(s => s.auth);
  const { data: stats } = useQuery({ queryKey: ['cstats'], queryFn: () => companyAPI.stats().then(r => r.data.data) });
  const { data: progress } = useQuery({ queryKey: ['cprogress'], queryFn: () => companyAPI.progress().then(r => r.data.data) });
  const { data: jobsData } = useQuery({ queryKey: ['myjobs'], queryFn: () => jobsAPI.mine().then(r => r.data.data) });

  const jobs = jobsData || [];
  const pct = progress?.progress || 0;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <CompanySidebar />
        <div className="app-main">
          <div className="page-head">
            <h1 className="page-title">{profile?.company_name || user?.full_name}</h1>
            <p className="page-sub">Recruiter dashboard</p>
          </div>

          {pct < 100 && (
            <div className="alert alert-blue" style={{ marginBottom: 20, justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span>Complete your company profile ({pct}%) to get 3× more applicants.</span>
              <button className="btn btn-xs btn-secondary" onClick={() => navigate('/company/profile')}>Complete profile →</button>
            </div>
          )}

          <div className="stats-grid">
            {[['Active jobs', stats?.activeJobs||0],['Total applicants', stats?.totalApps||0],['This week', stats?.newApps||0],['Total jobs', stats?.totalJobs||0]].map(([l,v]) => (
              <div key={l} className="stat-box"><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
            <div className="card">
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>Job postings</div>
                <button className="btn btn-sm btn-primary" onClick={() => navigate('/company/post')}>+ Post new job</button>
              </div>
              {jobs.length === 0
                ? <div className="empty"><h3>No jobs posted</h3><p>Post your first job to start receiving applications</p><button className="btn btn-sm btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/company/post')}>Post a job</button></div>
                : <div className="table-wrap">
                    <table>
                      <thead><tr><th>Title</th><th>Type</th><th>Applicants</th><th>Views</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {jobs.slice(0,8).map(j => (
                          <tr key={j._id}>
                            <td><div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{j.title}</div><div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2, textTransform: 'capitalize' }}>{j.location}</div></td>
                            <td style={{ textTransform: 'capitalize', fontSize: 12.5, color: 'var(--ink-3)' }}>{j.job_type}</td>
                            <td style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.5px' }}>{j.total_applications}</td>
                            <td style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{j.views}</td>
                            <td><span className={`st st-${j.status}`}>{j.status}</span></td>
                            <td><button className="btn btn-xs btn-secondary" onClick={() => navigate(`/company/applicants/${j._id}`)}>View →</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 13 }}>Setup progress</div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}><span style={{ color: 'var(--ink-3)' }}>Completion</span><span style={{ fontWeight: 700, color: pct === 100 ? 'var(--green)' : 'var(--amber)' }}>{pct}%</span></div>
                  <div className="pbar" style={{ marginBottom: 14 }}><div className="pbar-fill" style={{ width: `${pct}%` }} /></div>
                  {(progress?.steps || []).map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, marginBottom: 7, color: s.done ? 'var(--green)' : 'var(--ink-3)' }}>
                      <div style={{ width: 15, height: 15, borderRadius: '50%', border: `1.5px solid ${s.done ? 'var(--green)' : 'var(--line-2)'}`, background: s.done ? 'var(--green-dim)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 8, color: 'var(--green)', fontWeight: 900 }}>
                        {s.done ? '✓' : ''}
                      </div>
                      {s.name}
                    </div>
                  ))}
                  <button className="btn btn-sm btn-secondary btn-full" style={{ marginTop: 10 }} onClick={() => navigate('/company/profile')}>Edit profile</button>
                </div>
              </div>
              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 13 }}>Quick actions</div>
                <div style={{ padding: '4px 0' }}>
                  {[['Post a new job','/company/post'],['View all jobs','/company/jobs'],['Edit profile','/company/profile']].map(([l,h]) => (
                    <div key={l} onClick={() => navigate(h)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid var(--line)', cursor: 'pointer', fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {l}<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
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
