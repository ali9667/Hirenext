import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Nav from '../../components/Nav';
import CompanySidebar from '../../components/CompanySidebar';
import { jobsAPI } from '../../api/index';
import toast from 'react-hot-toast';
const fmtSal = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`;

export default function ManageJobs() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['myjobs'], queryFn: () => jobsAPI.mine().then(r => r.data.data) });
  const delMut = useMutation({ mutationFn: jobsAPI.del, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['myjobs']); } });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div className="app-shell">
        <CompanySidebar />
        <div className="app-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div className="page-head" style={{ marginBottom: 0 }}><h1 className="page-title">Manage Jobs</h1><p className="page-sub">{data?.length || 0} jobs posted</p></div>
            <button className="btn btn-md btn-primary" onClick={() => navigate('/company/post')}>+ Post new job</button>
          </div>
          {isLoading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>Loading...</div>
          : !data?.length ? <div className="empty card" style={{ padding: '60px 40px' }}><h3>No jobs yet</h3><p>Post your first job to start receiving applications</p><button className="btn btn-sm btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/company/post')}>Post a job</button></div>
          : <div className="card table-wrap">
              <table>
                <thead><tr><th>Job title</th><th>Type</th><th>Level</th><th>Salary</th><th>Applicants</th><th>Views</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {data.map(j => (
                    <tr key={j._id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {j.title}
                          {j.is_urgent && <span className="pill pill-red">Urgent</span>}
                          {j.is_featured && <span className="pill pill-blue">Featured</span>}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{j.location} · {j.openings} opening{j.openings > 1 ? 's' : ''}</div>
                      </td>
                      <td style={{ fontSize: 12.5, color: 'var(--ink-3)', textTransform: 'capitalize' }}>{j.job_type}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--ink-3)', textTransform: 'capitalize' }}>{j.experience_level}</td>
                      <td style={{ fontSize: 13, fontWeight: 700 }}>{j.salary_min ? `${fmtSal(j.salary_min)}–${fmtSal(j.salary_max)}` : '—'}</td>
                      <td style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px' }}>{j.total_applications}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{j.views}</td>
                      <td><span className={`st st-${j.status}`}>{j.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-xs btn-secondary" onClick={() => navigate(`/company/applicants/${j._id}`)}>Applicants</button>
                          <button className="btn btn-xs btn-danger" onClick={() => { if (confirm('Delete this job?')) delMut.mutate(j._id); }}>Delete</button>
                        </div>
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
