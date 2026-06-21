import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import JobCard from '../components/JobCard';
import { jobsAPI } from '../api/index';

export default function JobsPage() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', q, loc, type, level, page],
    queryFn: () => jobsAPI.list({ q, location: loc, job_type: type, experience_level: level, page, limit: 15 }).then(r => r.data)
  });

  const clear = () => { setQ(''); setLoc(''); setType(''); setLevel(''); setPage(1); };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>

        <div className="search-wrap">
          <div className="search-field" style={{ flex: 2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Job title, skill, or company..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>
          <div className="search-field" style={{ flex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <input placeholder="Location..." value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} />
          </div>
          <select className="input select" value={type} onChange={e => { setType(e.target.value); setPage(1); }} style={{ flex: 1, maxWidth: 150 }}>
            <option value="">All types</option>
            {['full-time','part-time','remote','hybrid','contract','internship'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
          </select>
          <select className="input select" value={level} onChange={e => { setLevel(e.target.value); setPage(1); }} style={{ flex: 1, maxWidth: 150 }}>
            <option value="">All levels</option>
            {['fresher','junior','mid','senior','lead'].map(l => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l}</option>)}
          </select>
          {(q || loc || type || level) && <button className="btn btn-sm btn-ghost" onClick={clear}>Clear</button>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[['remote','Remote'],['full-time','Full Time'],['hybrid','Hybrid'],['fresher','Fresher'],['senior','Senior']].map(([v, l]) => {
              const isType = ['remote','full-time','hybrid'].includes(v);
              const isOn = isType ? type === v : level === v;
              return <div key={v} className={`chip ${isOn ? 'on' : ''}`} onClick={() => { if (isType) setType(isOn ? '' : v); else setLevel(isOn ? '' : v); setPage(1); }}>{l}</div>;
            })}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{isLoading ? '...' : `${(data?.total || 0).toLocaleString('en-IN')} jobs`}</div>
        </div>

        <div className="card">
          {isLoading
            ? [...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 80, margin: '1px 0' }} />)
            : !data?.data?.length
            ? <div className="empty"><h3>No jobs found</h3><p>Try different keywords or remove filters</p><button className="btn btn-sm btn-primary" style={{ marginTop: 14 }} onClick={clear}>Clear filters</button></div>
            : data.data.map(j => <JobCard key={j._id} job={j} />)
          }
        </div>

        {data?.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            {[...Array(data.pages)].map((_, i) => (
              <button key={i} className={`btn btn-sm ${page === i+1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setPage(i+1); window.scrollTo(0,0); }}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
