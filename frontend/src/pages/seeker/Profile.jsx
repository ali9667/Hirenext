import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Nav from '../../components/Nav';
import SeekerSidebar from '../../components/SeekerSidebar';
import { seekerAPI } from '../../api/index';
import toast from 'react-hot-toast';

const SKILLS = ['React','Vue.js','Angular','Node.js','Python','Java','Go','TypeScript','MongoDB','PostgreSQL','AWS','Docker','Kubernetes','Figma','Product Management','Data Science','Machine Learning','DevOps','Redis','GraphQL','Next.js','Android','iOS'];
const LEVELS = ['fresher','junior','mid','senior','lead'];
const TYPES = ['full-time','part-time','remote','hybrid','contract','internship'];

export default function SeekerProfile() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['sp'], queryFn: () => seekerAPI.profile().then(r => r.data.data) });
  const { register, handleSubmit, watch, setValue, reset } = useForm({ defaultValues: { skills: [], job_type_pref: [], open_to_work: true } });

  useEffect(() => { if (data) reset(data); }, [data]);

  const mut = useMutation({ mutationFn: seekerAPI.update, onSuccess: () => { toast.success('Saved!'); qc.invalidateQueries(['sp']); } });

  const skills = watch('skills') || [];
  const prefs = watch('job_type_pref') || [];
  const otw = watch('open_to_work');
  const toggle = (k, v, curr) => setValue(k, curr.includes(v) ? curr.filter(x => x !== v) : [...curr, v]);

  if (isLoading) return <><Nav /><div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Loading...</div></>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <SeekerSidebar />
        <div className="app-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div className="page-head" style={{ marginBottom: 0 }}>
              <h1 className="page-title">My Profile</h1>
              <p className="page-sub">Completion: {data?.profile_completion || 0}%</p>
            </div>
            <button className="btn btn-md btn-primary" onClick={handleSubmit(d => mut.mutate(d))} disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save changes'}</button>
          </div>

          <div className="card" style={{ padding: '14px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>Open to work</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Let recruiters know you're looking</div>
              </div>
              <div className="toggle" onClick={() => setValue('open_to_work', !otw)}>
                <div className={`toggle-track ${otw ? 'on' : ''}`} />
                <div className="toggle-knob" style={{ left: otw ? 20 : 3 }} />
              </div>
            </div>
          </div>

          <form>
            <div className="form-block">
              <div className="form-block-title">Basic information</div>
              <div className="form-grid" style={{ gap: 12 }}>
                <div className="form-full field"><label>Professional headline</label><input className="input" placeholder="e.g. Senior React Developer · 4 YOE · Open to Remote" {...register('headline')} /></div>
                <div className="form-full field"><label>Bio</label><textarea className="input textarea" rows={4} placeholder="Tell recruiters about yourself..." {...register('bio')} /></div>
                <div className="field"><label>Location</label><input className="input" placeholder="Mumbai, Maharashtra" {...register('location')} /></div>
                <div className="field"><label>Phone</label><input className="input" placeholder="+91 98765 43210" {...register('phone')} /></div>
                <div className="field"><label>Experience level</label>
                  <select className="input select" {...register('experience_level')}>
                    {LEVELS.map(l => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div className="field"><label>Expected salary</label><input className="input" placeholder="e.g. 20–30 LPA" {...register('expected_salary')} /></div>
                <div className="field"><label>Current salary</label><input className="input" placeholder="e.g. 15 LPA" {...register('current_salary')} /></div>
                <div className="field"><label>Notice period</label><input className="input" placeholder="e.g. 30 days" {...register('notice_period')} /></div>
              </div>
            </div>

            <div className="form-block">
              <div className="form-block-title">Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {SKILLS.map(s => <span key={s} className={`skill ${skills.includes(s) ? 'on' : ''}`} onClick={() => toggle('skills', s, skills)}>{s}</span>)}
              </div>
              {skills.length > 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}>{skills.length} selected</div>}
            </div>

            <div className="form-block">
              <div className="form-block-title">Job preferences</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {TYPES.map(t => <span key={t} className={`skill ${prefs.includes(t) ? 'on' : ''}`} onClick={() => toggle('job_type_pref', t, prefs)} style={{ textTransform: 'capitalize' }}>{t}</span>)}
              </div>
            </div>

            <div className="form-block">
              <div className="form-block-title">Social links</div>
              <div className="form-grid" style={{ gap: 12 }}>
                {[['LinkedIn','social_links.linkedin','linkedin.com/in/...'],['GitHub','social_links.github','github.com/...'],['Portfolio','social_links.portfolio','yoursite.com'],['Twitter','social_links.twitter','twitter.com/...']].map(([l,n,p]) => (
                  <div key={n} className="field"><label>{l}</label><input className="input" placeholder={p} {...register(n)} /></div>
                ))}
              </div>
            </div>
          </form>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-lg btn-primary" onClick={handleSubmit(d => mut.mutate(d))} disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save all changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
