const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Use EJS for templating
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use session middleware
app.use(session({
  secret: 'secret_key', // Use a strong secret for production
  resave: false,
  saveUninitialized: false,
}));

// MongoDB connection (skip if not needed for storing user data)
mongoose.connect('mongodb://localhost/task_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User Schema (only used for initial login, optional for hardcoded users)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Home Route (Redirect to login if not logged in)
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/tasks');
  }
  res.redirect('/login');
});

// Login Route - Show Login Form
app.get('/login', (req, res) => {
  res.render('login');
});

// Login POST Route - Validate credentials and redirect to tasks
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are 'asd' for this specific case
  if (username === 'asd' && password === 'asd') {
    req.session.userId = 'asd'; // You can store any session info like userId
    return res.redirect('/tasks'); // Redirect to task.ejs page
  } else {
    return res.render('login', { error: 'Invalid username or password' });
  }
});

// Tasks Route (Only accessible after login)
app.get('/tasks', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  // Render task page
  res.render('tasks');
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
});

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
