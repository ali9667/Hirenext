import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector(s => s.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const is = p => pathname === p || pathname.startsWith(p + '/');

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">Hire<em>Next</em></Link>

        {token ? <>
          <div className={`nav-link ${is('/jobs') ? 'on' : ''}`} onClick={() => navigate('/jobs')}>Jobs</div>
          {user?.userType === 'seeker' && <>
            <div className={`nav-link ${is('/seeker/jobs') ? 'on' : ''}`} onClick={() => navigate('/seeker/jobs')}>Browse</div>
            <div className={`nav-link ${is('/seeker/applications') ? 'on' : ''}`} onClick={() => navigate('/seeker/applications')}>Applications</div>
            <div className={`nav-link ${pathname === '/seeker' ? 'on' : ''}`} onClick={() => navigate('/seeker')}>Dashboard</div>
          </>}
          {user?.userType === 'company' && <>
            <div className={`nav-link ${pathname === '/company' ? 'on' : ''}`} onClick={() => navigate('/company')}>Dashboard</div>
            <div className={`nav-link ${is('/company/jobs') ? 'on' : ''}`} onClick={() => navigate('/company/jobs')}>Jobs</div>
            <div className={`nav-link ${is('/company/post') ? 'on' : ''}`} onClick={() => navigate('/company/post')}>Post job</div>
          </>}
        </> : <>
          <div className={`nav-link ${is('/jobs') ? 'on' : ''}`} onClick={() => navigate('/jobs')}>Browse jobs</div>
          <div className="nav-link" onClick={() => navigate('/register?type=company')}>For employers</div>
        </>}

        <div className="nav-right">
          {!token ? <>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn btn-sm btn-primary" onClick={() => navigate('/register')}>Get started</button>
          </> : (
            <div className="drop" ref={ref}>
              <div className="nav-avatar" onClick={() => setOpen(v => !v)}>{user?.full_name?.charAt(0)}</div>
              <div className={`drop-menu ${open ? 'open' : ''}`}>
                <div style={{ padding: '7px 9px 5px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{user?.full_name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>{user?.email}</div>
                </div>
                <div className="drop-sep" />
                {user?.userType === 'seeker' && <>
                  <div className="drop-item" onClick={() => { navigate('/seeker'); setOpen(false); }}>Dashboard</div>
                  <div className="drop-item" onClick={() => { navigate('/seeker/profile'); setOpen(false); }}>Profile</div>
                </>}
                {user?.userType === 'company' && <>
                  <div className="drop-item" onClick={() => { navigate('/company'); setOpen(false); }}>Dashboard</div>
                  <div className="drop-item" onClick={() => { navigate('/company/profile'); setOpen(false); }}>Company profile</div>
                </>}
                <div className="drop-sep" />
                <div className="drop-item red" onClick={() => { dispatch(logout()); toast('Signed out'); navigate('/'); setOpen(false); }}>Sign out</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
