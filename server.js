require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const empRoutes = require('./routes/empRoutes');

app.use('/api/v1', authRoutes);
app.use('/api/v1', empRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status:false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
  });
