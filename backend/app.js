require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// OIDC client setup (Okta)
let client;
Issuer.discover(process.env.OKTA_ISSUER).then(oktaIssuer => {
  client = new oktaIssuer.Client({
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uris: [process.env.OKTA_REDIRECT_URI],
    response_types: ['code'],
  });
});

// Login: redirect to Okta SSO
app.get('/login', (req, res) => {
  const state = generators.state();
  const nonce = generators.nonce();
  req.session.state = state;
  req.session.nonce = nonce;
  const url = client.authorizationUrl({
    scope: 'openid profile email groups',
    state,
    nonce
  });
  res.redirect(url);
});

// Okta callback
app.get('/callback', async (req, res) => {
  const params = client.callbackParams(req);
  try {
    const tokenSet = await client.callback(
      process.env.OKTA_REDIRECT_URI,
      params,
      { state: req.session.state, nonce: req.session.nonce }
    );
    req.session.user = tokenSet.claims();
    req.session.access_token = tokenSet.access_token;
    req.session.id_token = tokenSet.id_token;
    res.redirect('http://localhost:3001'); // or your frontend URL
  } catch (err) {
    res.status(401).send('Login failed: ' + err.message);
  }
});

// Logout (Okta SSO and local session)
app.get('/logout', (req, res) => {
  const idTokenHint = req.session.id_token;
  req.session.destroy(() => {
    const oktaLogout = `${process.env.OKTA_ISSUER}/v1/logout?id_token_hint=${idTokenHint}&post_logout_redirect_uri=http://localhost:3001/`;
    res.redirect(oktaLogout);
  });
});

// Mount API routes (RBAC, email, profile, etc)
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send(`<a href="/login">Login with Okta (SSO)</a>`);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
