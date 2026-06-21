import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const fmtSal = n => n >= 100000 ? `₹${(n / 100000).toFixed(0)}L` : `₹${(n / 1000).toFixed(0)}K`;

const COLORS = ['#0070F3','#18794E','#C53030','#7C3AED','#B45309','#0369A1'];
const color = name => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

export default function JobCard({ job, onSave, saved }) {
  const navigate = useNavigate();
  const co = job.company_id;
  const c = color(co?.company_name);
  const ago = job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : '';

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-logo" style={{ background: c + '12', color: c }}>
        {co?.company_logo_url
          ? <img src={co.company_logo_url} alt={co.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : (co?.company_name?.substring(0, 2) || '??').toUpperCase()}
      </div>
      <div className="jc-info">
        <div className="jc-title">{job.title}</div>
        <div className="jc-company">
          {co?.company_name}
          {co?.is_verified && <span className="pill pill-green" style={{ fontSize: 10 }}>✓ Verified</span>}
        </div>
        <div className="jc-tags">
          <span className="tag">{job.location || 'India'}</span>
          <span className="tag" style={{ textTransform: 'capitalize' }}>{job.job_type}</span>
          <span className="tag" style={{ textTransform: 'capitalize' }}>{job.experience_level}</span>
          {job.is_urgent && <span className="pill pill-red">Urgent</span>}
          {job.is_featured && <span className="pill pill-blue">Featured</span>}
        </div>
      </div>
      <div className="jc-right">
        <div className="jc-salary">
          {job.salary_min && job.salary_visible
            ? `${fmtSal(job.salary_min)} – ${fmtSal(job.salary_max)}`
            : 'Competitive'}
        </div>
        <div className="jc-time">{ago}</div>
        {onSave && (
          <button
            className={`btn btn-xs ${saved ? 'btn-primary' : 'btn-secondary'}`}
            onClick={e => { e.stopPropagation(); onSave(job._id); }}
          >
            {saved ? '★ Saved' : '☆ Save'}
          </button>
        )}
      </div>
    </div>
  );
}
