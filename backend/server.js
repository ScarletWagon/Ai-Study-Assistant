const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortenedUrl: String,
  clickCount: { type: Number, default: 0 },
});

const Url = mongoose.model('Url', urlSchema);

// API Route to create shortened URL
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortenedUrl = shortid.generate();

  const newUrl = new Url({
    originalUrl,
    shortenedUrl,
  });

  await newUrl.save();

  res.json({
    originalUrl,
    shortenedUrl: `${req.protocol}://${req.get('host')}/${shortenedUrl}`,
  });
});

// API Route to handle URL redirection
app.get('/:shortenedUrl', async (req, res) => {
  const shortenedUrl = req.params.shortenedUrl;
  const url = await Url.findOne({ shortenedUrl });

  if (!url) {
    return res.status(404).json({ error: 'URL not found' });
  }

  url.clickCount++;
  await url.save();

  res.redirect(url.originalUrl);
});

// API Route to get analytics
app.get('/api/analytics/:shortenedUrl', async (req, res) => {
  const shortenedUrl = req.params.shortenedUrl;
  const url = await Url.findOne({ shortenedUrl });

  if (!url) {
    return res.status(404).json({ error: 'URL not found' });
  }

  res.json({ clickCount: url.clickCount });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
