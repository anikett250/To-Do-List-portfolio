const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();

// Use EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Make sure views are loaded from this folder

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use session middleware
app.use(session({
  secret: 'secret_key', // Use a strong secret for production
  resave: false,
  saveUninitialized: false,
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/task_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define User Schema (not used here, but keep for future reference)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Create User Model (not used in this test)
const User = mongoose.model('User', userSchema);

// Home Route (Redirect to login if not logged in)
app.get('/', (req, res) => {
  if (req.session.loggedIn) {  // Check the session for loggedIn status
    return res.redirect('/task');  // Redirect to task.ejs
  }
  res.redirect('/login');
});

// Login Route
app.get('/login', (req, res) => {
  res.render('login');  // Render login page
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'asd' && password === 'asd') {
      req.session.loggedIn = true;  // Set the session flag to indicate the user is logged in
      req.session.username = username;  // Optionally store the username
      res.redirect('/task');  // Redirect to task.ejs after successful login
    } else {
      res.send('Wrong username or password');  // Send error if the credentials are incorrect
    }
});

// Tasks Route (Protected)
app.get('/task', (req, res) => {
  if (!req.session.loggedIn) {  // Check if the user is logged in before accessing tasks
    return res.redirect('/login');  // Redirect to login if not logged in
  }

  res.render('task');  // Render task page when logged in
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');  // Redirect to login after logout
  });
});

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
