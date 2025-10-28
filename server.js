require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Connect to the database
connectDB();

// Use centralized routing
app.use('/api', routes);

app.get('/', (req, res) => res.send('CipherStudio backend is running'));

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT,
     () => console.log(`Server listening on port ${PORT}`));
}

// Export the app for testing (so tests can require the Express app without starting the server)
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  process.exit(1);
});
