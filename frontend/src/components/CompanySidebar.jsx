import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const items = [
  { to: '/company', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/company/post', label: 'Post a job', icon: 'M12 4v16m8-8H4' },
  { to: '/company/jobs', label: 'Manage jobs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/company/profile', label: 'Company profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
];
export default function CompanySidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="app-sidebar">
      {items.map(i => (
        <div key={i.to} className={`sidebar-item ${pathname === i.to ? 'on' : ''}`} onClick={() => navigate(i.to)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={i.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
          {i.label}
        </div>
      ))}
    </aside>
  );
}
