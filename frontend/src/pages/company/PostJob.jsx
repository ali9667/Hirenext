import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Nav from '../../components/Nav';
import CompanySidebar from '../../components/CompanySidebar';
import { jobsAPI } from '../../api/index';
import toast from 'react-hot-toast';

const SKILLS = ['React','Vue.js','Angular','Node.js','Python','Java','Go','TypeScript','MongoDB','PostgreSQL','AWS','Docker','Kubernetes','Figma','Product Management','Data Science','ML','DevOps','Redis','GraphQL','Next.js','Android','iOS','Kotlin','Swift'];

export default function PostJob() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { openings: 1 } });
  const [skills, setSkills] = useState([]);
  const toggleSkill = s => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const mut = useMutation({
    mutationFn: d => jobsAPI.create(d),
    onSuccess: () => { toast.success('Job posted!'); qc.invalidateQueries(['myjobs']); navigate('/company/jobs'); }
  });

  const onSubmit = d => {
    mut.mutate({
      ...d,
      skills_required: skills,
      requirements: d.requirements_raw?.split('\n').map(s => s.trim()).filter(Boolean) || [],
      responsibilities: d.responsibilities_raw?.split('\n').map(s => s.trim()).filter(Boolean) || [],
    });
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <CompanySidebar />
        <div className="app-main">
          <div className="page-head"><h1 className="page-title">Post a Job</h1><p className="page-sub">Fill in the details to attract the best candidates</p></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
              <div>
                <div className="form-block">
                  <div className="form-block-title">Job details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                    <div className="field"><label>Job title *</label><input className={`input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Senior React Developer" {...register('title', { required: 'Required' })} />{errors.title && <span className="field-err">{errors.title.message}</span>}</div>
                    <div className="field"><label>Description *</label><textarea className={`input textarea ${errors.description ? 'input-error' : ''}`} rows={6} placeholder="Describe the role, the team, and what the person will own..." {...register('description', { required: 'Required' })} />{errors.description && <span className="field-err">{errors.description.message}</span>}</div>
                    <div className="field"><label>Requirements <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(one per line)</span></label><textarea className="input textarea" rows={5} placeholder={"4+ years React\nTypeScript proficiency\nREST API experience"} {...register('requirements_raw')} /></div>
                    <div className="field"><label>Responsibilities <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(one per line)</span></label><textarea className="input textarea" rows={5} placeholder={"Build features end-to-end\nCode reviews\nWork with design"} {...register('responsibilities_raw')} /></div>
                  </div>
                </div>
                <div className="form-block">
                  <div className="form-block-title">Required skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {SKILLS.map(s => <span key={s} className={`skill ${skills.includes(s) ? 'on' : ''}`} onClick={() => toggleSkill(s)}>{s}</span>)}
                  </div>
                  {skills.length > 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{skills.join(', ')}</div>}
                </div>
              </div>

              <div style={{ position: 'sticky', top: 72, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-block" style={{ margin: 0 }}>
                  <div className="form-block-title">Job info</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                    <div className="field"><label>Job type *</label>
                      <select className={`input select ${errors.job_type ? 'input-error' : ''}`} {...register('job_type', { required: true })}>
                        <option value="">Select type</option>
                        {['full-time','part-time','remote','hybrid','contract','internship'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Experience level *</label>
                      <select className={`input select ${errors.experience_level ? 'input-error' : ''}`} {...register('experience_level', { required: true })}>
                        <option value="">Select level</option>
                        {['fresher','junior','mid','senior','lead'].map(l => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Location</label><input className="input" placeholder="Bengaluru / Remote" {...register('location')} /></div>
                    <div className="field"><label>Department</label><input className="input" placeholder="Engineering / Product" {...register('department')} /></div>
                    <div className="field"><label>Experience required</label><input className="input" placeholder="e.g. 3–6 years" {...register('experience_years')} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="field"><label>Min salary (₹)</label><input className="input" type="number" placeholder="2000000" {...register('salary_min', { valueAsNumber: true })} /></div>
                      <div className="field"><label>Max salary (₹)</label><input className="input" type="number" placeholder="3500000" {...register('salary_max', { valueAsNumber: true })} /></div>
                    </div>
                    <div className="field"><label>Openings</label><input className="input" type="number" min="1" {...register('openings', { valueAsNumber: true })} /></div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)', cursor: 'pointer' }}><input type="checkbox" {...register('is_urgent')} />Urgent</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)', cursor: 'pointer' }}><input type="checkbox" {...register('is_featured')} />Featured</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-lg btn-primary btn-full" disabled={mut.isPending}>{mut.isPending ? 'Posting...' : '→ Post job'}</button>
                <button type="button" className="btn btn-md btn-secondary btn-full" onClick={() => navigate('/company/jobs')}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
