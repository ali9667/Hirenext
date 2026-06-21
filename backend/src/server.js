require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/seeker', require('./routes/seeker'));
app.use('/api/company', require('./routes/company'));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || 'Server error' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));
