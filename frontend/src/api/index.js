import api from './axios';
export const jobsAPI = {
  list: p => api.get('/jobs', { params: p }),
  get: id => api.get(`/jobs/${id}`),
  create: d => api.post('/jobs', d),
  update: (id, d) => api.put(`/jobs/${id}`, d),
  del: id => api.delete(`/jobs/${id}`),
  mine: () => api.get('/jobs/my'),
};
export const appsAPI = {
  apply: d => api.post('/applications', d),
  mine: () => api.get('/applications/my'),
  forJob: jid => api.get(`/applications/job/${jid}`),
  status: (id, s) => api.patch(`/applications/${id}/status`, { status: s }),
  save: jid => api.post(`/applications/save/${jid}`),
};
export const seekerAPI = {
  profile: () => api.get('/seeker/profile'),
  update: d => api.put('/seeker/profile', d),
  saved: () => api.get('/seeker/saved'),
};
export const companyAPI = {
  profile: () => api.get('/company/profile'),
  update: d => api.put('/company/profile', d),
  stats: () => api.get('/company/stats'),
  progress: () => api.get('/company/progress'),
};
