import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const items = [
  { to: '/seeker', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/seeker/jobs', label: 'Browse jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/seeker/applications', label: 'Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { to: '/seeker/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];
export default function SeekerSidebar() {
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
