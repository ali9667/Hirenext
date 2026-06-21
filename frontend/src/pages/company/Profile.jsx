import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Nav from '../../components/Nav';
import CompanySidebar from '../../components/CompanySidebar';
import { companyAPI } from '../../api/index';
import { setProfile } from '../../store/authSlice';
import toast from 'react-hot-toast';

const STEPS = ['Company info','Industry & size','Contact & social'];

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const { data, isLoading } = useQuery({ queryKey: ['cprofile'], queryFn: () => companyAPI.profile().then(r => r.data.data) });
  const { data: progress } = useQuery({ queryKey: ['cprogress'], queryFn: () => companyAPI.progress().then(r => r.data.data) });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (data) reset({ ...data, social_links: data.social_links || {} }); }, [data]);

  const mut = useMutation({ mutationFn: companyAPI.update, onSuccess: r => { toast.success('Saved!'); dispatch(setProfile(r.data.data)); qc.invalidateQueries(['cprofile']); qc.invalidateQueries(['cprogress']); } });

  const pct = progress?.progress || 0;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <CompanySidebar />
        <div className="app-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div className="page-head" style={{ marginBottom: 0 }}><h1 className="page-title">Company Profile</h1><p className="page-sub">Setup: {pct}%</p></div>
            <button className="btn btn-md btn-primary" onClick={handleSubmit(d => mut.mutate(d))} disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save changes'}</button>
          </div>

          <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}><span style={{ color: 'var(--ink-3)' }}>Completion</span><span style={{ fontWeight: 700 }}>{pct}%</span></div>
            <div className="pbar"><div className="pbar-fill" style={{ width: `${pct}%` }} /></div>
          </div>

          <div className="tabs">
            {STEPS.map((s, i) => (
              <div key={s} className={`tab ${step === i ? 'on' : ''}`} onClick={() => { handleSubmit(d => mut.mutate(d))(); setTimeout(() => setStep(i), 300); }}>{s}</div>
            ))}
          </div>

          <form onSubmit={handleSubmit(d => mut.mutate(d))}>
            {step === 0 && (
              <div className="form-block">
                <div className="form-block-title">Company information</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                  <div className="field"><label>Company name</label><input className="input" {...register('company_name')} /></div>
                  <div className="field"><label>Tagline</label><input className="input" placeholder="One sentence about what you do" {...register('tagline')} /></div>
                  <div className="field"><label>About company</label><textarea className="input textarea" rows={6} placeholder="Tell candidates who you are, what you build, and why it matters..." {...register('about_company')} /></div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="form-block">
                <div className="form-block-title">Industry & size</div>
                <div className="form-grid" style={{ gap: 13 }}>
                  <div className="field"><label>Industry type</label>
                    <select className="input select" {...register('industry_type')}>
                      <option value="">Select</option>
                      {['Fintech','Engineering','Software & IT','Edtech','Healthcare','E-Commerce','Quick Commerce','SaaS','Gaming','Other'].map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Organization type</label>
                    <select className="input select" {...register('organizations_type')}>
                      <option value="">Select</option>
                      {['Private Limited','Public Limited','Startup','Non-Profit','Government'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Team size</label>
                    <select className="input select" {...register('team_size')}>
                      <option value="">Select</option>
                      {['1–10','11–50','51–200','201–500','501–1,000','1,001–5,000','5,000+'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Location / HQ</label><input className="input" placeholder="Bengaluru, Karnataka" {...register('location')} /></div>
                  <div className="field"><label>Company website</label><input className="input" placeholder="https://yourcompany.com" {...register('company_website')} /></div>
                  <div className="field"><label>Careers page</label><input className="input" placeholder="https://yourcompany.com/careers" {...register('careers_link')} /></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="form-block">
                <div className="form-block-title">Contact & social links</div>
                <div className="form-grid" style={{ gap: 13 }}>
                  <div className="field"><label>HQ Email</label><input className="input" type="email" placeholder="hr@company.com" {...register('headquarter_mail_id')} /></div>
                  <div className="field"><label>HQ Phone</label><input className="input" placeholder="+91-80-12345678" {...register('headquarter_phone_no')} /></div>
                  <div className="field"><label>LinkedIn</label><input className="input" placeholder="linkedin.com/company/..." {...register('social_links.linkedin')} /></div>
                  <div className="field"><label>Twitter / X</label><input className="input" placeholder="twitter.com/..." {...register('social_links.twitter')} /></div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {step > 0 && <button type="button" className="btn btn-md btn-secondary" onClick={() => setStep(s => s-1)}>← Previous</button>}
              </div>
              {step < STEPS.length - 1
                ? <button type="button" className="btn btn-md btn-primary" onClick={() => { handleSubmit(d => mut.mutate(d))(); setTimeout(() => setStep(s => s+1), 300); }}>Save & next →</button>
                : <button type="submit" className="btn btn-md btn-primary" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save & finish'}</button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
