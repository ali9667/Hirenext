import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import JobsPage from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import SeekerHome from './pages/seeker/Home';
import SeekerJobs from './pages/seeker/Jobs';
import SeekerApps from './pages/seeker/Applications';
import SeekerProfile from './pages/seeker/Profile';
import CompanyHome from './pages/company/Home';
import PostJob from './pages/company/PostJob';
import ManageJobs from './pages/company/ManageJobs';
import Applicants from './pages/company/Applicants';
import CompanyProfile from './pages/company/Profile';

function Guard({ type, children }) {
  const { token, user } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (type && user?.userType !== type) return <Navigate to={user?.userType === 'company' ? '/company' : '/seeker'} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/seeker" element={<Guard type="seeker"><SeekerHome /></Guard>} />
        <Route path="/seeker/jobs" element={<Guard type="seeker"><SeekerJobs /></Guard>} />
        <Route path="/seeker/applications" element={<Guard type="seeker"><SeekerApps /></Guard>} />
        <Route path="/seeker/profile" element={<Guard type="seeker"><SeekerProfile /></Guard>} />
        <Route path="/company" element={<Guard type="company"><CompanyHome /></Guard>} />
        <Route path="/company/post" element={<Guard type="company"><PostJob /></Guard>} />
        <Route path="/company/jobs" element={<Guard type="company"><ManageJobs /></Guard>} />
        <Route path="/company/applicants/:jobId" element={<Guard type="company"><Applicants /></Guard>} />
        <Route path="/company/profile" element={<Guard type="company"><CompanyProfile /></Guard>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
