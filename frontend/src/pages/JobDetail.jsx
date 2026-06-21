import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Nav from '../components/Nav';
import { jobsAPI, appsAPI } from '../api/index';
import { formatDistanceToNow } from 'date-fns';

const fmtSal = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`;
const COLORS = ['#0070F3','#18794E','#C53030','#7C3AED','#B45309','#0369A1'];
const color = n => COLORS[(n?.charCodeAt(0) || 0) % COLORS.length];

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(s => s.auth);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm();

  const { data: job, isLoading } = useQuery({ queryKey: ['job', id], queryFn: () => jobsAPI.get(id).then(r => r.data.data) });

  const doApply = async d => {
    if (!token) return navigate('/login');
    if (user?.userType === 'company') return toast.error('Switch to a seeker account to apply');
    setSubmitting(true);
    try {
      await appsAPI.apply({ job_id: id, cover_letter: d.cover_letter });
      toast.success('Application sent!');
      setModal(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to apply'); }
    finally { setSubmitting(false); }
  };

  if (isLoading) return <><Nav /><div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>Loading...</div></>;
  if (!job) return null;

  const co = job.company_id;
  const c = color(co?.company_name);
  const ago = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="container-sm" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, border: '1px solid var(--line)', background: c + '12', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                    {co?.company_name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.4px', marginBottom: 4 }}>{job.title}</h1>
                    <div style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {co?.company_name}
                      {co?.is_verified && <span className="pill pill-green">✓ Verified</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      <span className="tag">{job.location || 'India'}</span>
                      <span className="tag" style={{ textTransform: 'capitalize' }}>{job.job_type}</span>
                      <span className="tag" style={{ textTransform: 'capitalize' }}>{job.experience_level}</span>
                      {job.is_urgent && <span className="pill pill-red">🔥 Urgent</span>}
                      {job.is_featured && <span className="pill pill-blue">Featured</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 10 }}>
                      {job.total_applications} applicants · {job.views} views · Posted {ago}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  {job.salary_min && job.salary_visible
                    ? <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px' }}>{fmtSal(job.salary_min)} – {fmtSal(job.salary_max)} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-4)' }}>/ year</span></div>
                    : <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Salary negotiable</div>
                  }
                </div>
                <button className="btn btn-md btn-primary" onClick={() => { if (!token) navigate('/login'); else if (user?.userType === 'company') toast.error('Switch to seeker account'); else setModal(true); }}>
                  Apply now
                </button>
              </div>
            </div>

            <div className="card">
              {[
                ['About the role', 'p', job.description],
                ['Requirements', 'ul', job.requirements],
                ['Responsibilities', 'ul', job.responsibilities],
                ['Skills & tools', 'tags', job.skills_required],
              ].filter(([,, v]) => v?.length).map(([title, type, content]) => (
                <div key={title} style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>{title}</div>
                  {type === 'p' && <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>{content}</p>}
                  {type === 'ul' && <ul style={{ paddingLeft: 18 }}>{content.map((r, i) => <li key={i} style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 3 }}>{r}</li>)}</ul>}
                  {type === 'tags' && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{content.map(s => <span key={s} className="skill">{s}</span>)}</div>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'sticky', top: 72 }}>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)', fontSize: 11, fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Job overview</div>
              <div style={{ padding: '4px 0' }}>
                {[['Department', job.department || 'Engineering'],['Experience', job.experience_years || job.experience_level],['Job type', job.job_type],['Openings', job.openings]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 18px', borderBottom: '1px solid var(--line)', fontSize: 12.5 }}>
                    <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                    <span style={{ color: 'var(--ink)', fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {co && (
              <div className="card">
                <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)', fontSize: 11, fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>About {co.company_name}</div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 7, background: c + '12', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                      {co.company_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{co.company_name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{co.industry_type} · {co.team_size}</div>
                    </div>
                  </div>
                  {co.about_company && <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{co.about_company}</p>}
                  {co.company_website && <a href={co.company_website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: 'var(--blue)', fontWeight: 600 }}>Visit website →</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <div className="modal-title">Apply for {job.title}</div>
              <button className="modal-x" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-blue" style={{ marginBottom: 16 }}>
                Your profile and resume will be shared with {co?.company_name}. Make sure your profile is complete.
              </div>
              <div className="field">
                <label>Cover letter <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="input textarea" rows={5} placeholder={`Tell ${co?.company_name} why you're a great fit...`} {...register('cover_letter')} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-sm btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-sm btn-primary" onClick={handleSubmit(doApply)} disabled={submitting}>{submitting ? 'Sending...' : 'Submit application'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
