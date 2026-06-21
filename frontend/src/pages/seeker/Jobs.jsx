import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Nav from '../../components/Nav';
import SeekerSidebar from '../../components/SeekerSidebar';
import JobCard from '../../components/JobCard';
import { jobsAPI, appsAPI, seekerAPI } from '../../api/index';
import toast from 'react-hot-toast';

export default function SeekerJobs() {
  const qc = useQueryClient();
  const [q, setQ] = useState(''); const [type, setType] = useState(''); const [level, setLevel] = useState(''); const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ['sjobs', q, type, level, page], queryFn: () => jobsAPI.list({ q, job_type: type, experience_level: level, page, limit: 15 }).then(r => r.data) });
  const { data: savedData } = useQuery({ queryKey: ['saved'], queryFn: () => seekerAPI.saved().then(r => r.data.data) });
  const savedIds = new Set((savedData || []).map(j => j._id));
  const saveMut = useMutation({ mutationFn: appsAPI.save, onSuccess: (r) => { toast.success(r.data.saved ? 'Saved!' : 'Removed'); qc.invalidateQueries(['saved']); } });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <SeekerSidebar />
        <div className="app-main">
          <div className="page-head"><h1 className="page-title">Browse Jobs</h1><p className="page-sub">Find your next opportunity</p></div>
          <div className="search-wrap">
            <div className="search-field" style={{ flex: 2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
            </div>
            <select className="input select" value={type} onChange={e => { setType(e.target.value); setPage(1); }} style={{ flex: 1 }}>
              <option value="">All types</option>
              {['full-time','part-time','remote','hybrid','contract','internship'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
            </select>
            <select className="input select" value={level} onChange={e => { setLevel(e.target.value); setPage(1); }} style={{ flex: 1 }}>
              <option value="">All levels</option>
              {['fresher','junior','mid','senior','lead'].map(l => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 10 }}>{data?.total || 0} jobs found</div>
          <div className="card">
            {isLoading ? [...Array(5)].map((_, i) => <div key={i} className="shimmer" style={{ height: 80, margin: '1px 0' }} />) :
              !data?.data?.length ? <div className="empty"><h3>No jobs found</h3><p>Try adjusting filters</p></div> :
              data.data.map(j => <JobCard key={j._id} job={j} onSave={() => saveMut.mutate(j._id)} saved={savedIds.has(j._id)} />)
            }
          </div>
          {data?.pages > 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {[...Array(data.pages)].map((_, i) => <button key={i} className={`btn btn-sm ${page === i+1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setPage(i+1); window.scrollTo(0,0); }}>{i+1}</button>)}
          </div>}
        </div>
      </div>
    </div>
  );
}
