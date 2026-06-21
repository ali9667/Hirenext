import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import SeekerSidebar from '../../components/SeekerSidebar';
import { appsAPI } from '../../api/index';
import { formatDistanceToNow } from 'date-fns';

const TABS = [['all','All'],['applied','Applied'],['reviewing','In Review'],['interview','Interview'],['offer','Offer'],['rejected','Not selected']];
const ST_CLS = { applied:'st-applied', reviewing:'st-reviewing', shortlisted:'st-shortlisted', interview:'st-interview', offer:'st-offer', rejected:'st-rejected', withdrawn:'st-withdrawn' };
const ST_LBL = { applied:'Applied', reviewing:'In review', shortlisted:'Shortlisted', interview:'Interview', offer:'🎉 Offer', rejected:'Not selected', withdrawn:'Withdrawn' };
const fmtSal = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`;

export default function SeekerApps() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const { data, isLoading } = useQuery({ queryKey: ['myapps'], queryFn: () => appsAPI.mine().then(r => r.data.data) });
  const all = data || [];
  const shown = tab === 'all' ? all : all.filter(a => a.status === tab);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <SeekerSidebar />
        <div className="app-main">
          <div className="page-head"><h1 className="page-title">Applications</h1><p className="page-sub">{all.length} total</p></div>
          <div className="tabs">
            {TABS.map(([v, l]) => {
              const count = v === 'all' ? all.length : all.filter(a => a.status === v).length;
              return <div key={v} className={`tab ${tab === v ? 'on' : ''}`} onClick={() => setTab(v)}>{l} {count > 0 && <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, background: tab === v ? 'var(--blue-dim)' : 'var(--bg-2)', color: tab === v ? 'var(--blue)' : 'var(--ink-4)' }}>{count}</span>}</div>;
            })}
          </div>
          {isLoading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>Loading...</div>
          : shown.length === 0 ? <div className="empty card"><h3>Nothing here</h3><p>No applications in this category</p></div>
          : <div className="card table-wrap">
              <table>
                <thead><tr><th>Job</th><th>Company</th><th>Salary</th><th>Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {shown.map(a => (
                    <tr key={a._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${a.job_id?._id}`)}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13 }}>{a.job_id?.title || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1, textTransform: 'capitalize' }}>{a.job_id?.job_type} · {a.job_id?.location}</div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{a.company_id?.company_name}</td>
                      <td style={{ fontSize: 13, fontWeight: 700 }}>
                        {a.job_id?.salary_min ? `${fmtSal(a.job_id.salary_min)}–${fmtSal(a.job_id.salary_max)}` : '—'}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</td>
                      <td><span className={`st ${ST_CLS[a.status]}`}>{ST_LBL[a.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
