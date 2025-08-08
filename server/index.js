const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const cvRoutes = require('./routes/cvRoutes');

dotenv.config();

// --- Environment Variable Validation ---
const requiredEnvVars = ['MONGO_URI', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1); // Exit the process with an error code
}
// ------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Use Routes
app.use('/api/cv', cvRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
