import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login, register, clearError } from '../store/authSlice';
import Nav from '../components/Nav';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const { token, user, loading, error } = useSelector(s => s.auth);
  const [type, setType] = useState(params.get('type') || 'seeker');
  const { register: rf, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => { if (token) navigate(user?.userType === 'company' ? '/company' : '/seeker'); }, [token]);
  useEffect(() => { dispatch(clearError()); reset(); }, [mode]);

  const onSubmit = d => dispatch(isLogin ? login(d) : register({ ...d, userType: type }));

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh' }}>
      <Nav />
      <div className="auth-wrap">
        <div className="auth-box">
          <h1 className="auth-title">{isLogin ? 'Sign in' : 'Create account'}</h1>
          <p className="auth-sub">
            {isLogin ? "New here? " : "Already have an account? "}
            <span style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate(isLogin ? '/register' : '/login')}>
              {isLogin ? 'Create account' : 'Sign in'}
            </span>
          </p>

          {!isLogin && (
            <div className="auth-type-grid">
              {[['seeker','👤','I want a job'],['company','🏢','I\'m hiring']].map(([v, icon, label]) => (
                <div key={v} className={`type-card ${type === v ? 'on' : ''}`} onClick={() => setType(v)}>
                  <div className="type-card-icon">{icon}</div>
                  <div className="type-card-label">{label}</div>
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert alert-red" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(197,48,48,.2)', padding: '10px 13px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {!isLogin && (
              <div className="field">
                <label>Full name</label>
                <input className={`input input-lg ${errors.full_name ? 'input-error' : ''}`} placeholder="Rahul Sharma" {...rf('full_name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
                {errors.full_name && <span className="field-err">{errors.full_name.message}</span>}
              </div>
            )}
            <div className="field">
              <label>Email address</label>
              <input className={`input input-lg ${errors.email ? 'input-error' : ''}`} type="email" placeholder="you@example.com" {...rf('email', { required: 'Required', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' } })} />
              {errors.email && <span className="field-err">{errors.email.message}</span>}
            </div>
            <div className="field">
              <label>Password</label>
              <input className={`input input-lg ${errors.password ? 'input-error' : ''}`} type="password" placeholder={isLogin ? '••••••••' : 'Minimum 8 characters'} {...rf('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              {errors.password && <span className="field-err">{errors.password.message}</span>}
            </div>
            <button type="submit" className="btn btn-lg btn-primary btn-full" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
