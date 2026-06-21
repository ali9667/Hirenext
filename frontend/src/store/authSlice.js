import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const saved = (() => { try { return JSON.parse(localStorage.getItem('hn') || 'null'); } catch { return null; } })();

export const login = createAsyncThunk('auth/login', async (d, { rejectWithValue }) => {
  try { return (await api.post('/auth/login', d)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});
export const register = createAsyncThunk('auth/register', async (d, { rejectWithValue }) => {
  try { return (await api.post('/auth/register', d)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

const save = s => localStorage.setItem('hn', JSON.stringify({ token: s.token, user: s.user, profile: s.profile }));

const slice = createSlice({
  name: 'auth',
  initialState: { token: saved?.token || null, user: saved?.user || null, profile: saved?.profile || null, loading: false, error: null },
  reducers: {
    logout(s) { s.token = s.user = s.profile = null; localStorage.removeItem('hn'); },
    clearError(s) { s.error = null; },
    setProfile(s, a) { s.profile = a.payload; save(s); },
  },
  extraReducers: b => {
    [login, register].forEach(thunk => {
      b.addCase(thunk.pending, s => { s.loading = true; s.error = null; })
       .addCase(thunk.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.user = a.payload.user; s.profile = a.payload.profile; save(s); })
       .addCase(thunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    });
  }
});

export const { logout, clearError, setProfile } = slice.actions;
export default slice.reducer;
