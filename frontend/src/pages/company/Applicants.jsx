import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Nav from '../../components/Nav';
import CompanySidebar from '../../components/CompanySidebar';
import { appsAPI } from '../../api/index';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['applied','reviewing','shortlisted','interview','offer','rejected'];
const ST_CLS = { applied:'st-applied', reviewing:'st-reviewing', shortlisted:'st-shortlisted', interview:'st-interview', offer:'st-offer', rejected:'st-rejected' };

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['applicants', jobId], queryFn: () => appsAPI.forJob(jobId).then(r => r.data.data) });
  const mut = useMutation({ mutationFn: ({ id, s }) => appsAPI.status(id, s), onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['applicants', jobId]); } });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <CompanySidebar />
        <div className="app-main">
          <button className="btn btn-sm btn-ghost" onClick={() => navigate('/company/jobs')} style={{ marginBottom: 16 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to jobs
          </button>
          <div className="page-head"><h1 className="page-title">Applicants</h1><p className="page-sub">{(data || []).length} applications received</p></div>
          {isLoading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>Loading...</div>
          : !(data || []).length ? <div className="empty card" style={{ padding: 60 }}><h3>No applications yet</h3><p>Share the job link to attract candidates</p></div>
          : <div className="card table-wrap">
              <table>
                <thead><tr><th>Applicant</th><th>Applied</th><th>Cover letter</th><th>Current status</th><th>Update status</th></tr></thead>
                <tbody>
                  {data.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{a.applicant_id?.full_name?.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{a.applicant_id?.full_name}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{a.applicant_id?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</td>
                      <td style={{ maxWidth: 220 }}>
                        {a.cover_letter
                          ? <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.cover_letter}</div>
                          : <span style={{ color: 'var(--ink-4)', fontSize: 12 }}>—</span>}
                      </td>
                      <td><span className={`st ${ST_CLS[a.status]}`}>{a.status}</span></td>
                      <td>
                        <select className="input select" value={a.status} onChange={e => mut.mutate({ id: a._id, s: e.target.value })} style={{ height: 30, fontSize: 12, padding: '0 26px 0 9px', minWidth: 120, cursor: 'pointer' }}>
                          {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
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
