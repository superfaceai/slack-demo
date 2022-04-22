const util = require('util');
const express = require('express');
const passport = require('passport');
const SlackStrategy = require('passport-slack-oauth2');
const session = require('express-session');

require('dotenv').config();

const SCOPES = ['channels:read', 'chat:write'];

const EXIT_ON_SUCCESS = true;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function onAuthSuccess({ accessToken, refreshToken }) {
  if (process.stdout.isTTY) {
    console.error(`\nPaste this into "tokens.json" file:`);
  }
  console.log(JSON.stringify({ accessToken, refreshToken }));
  if (EXIT_ON_SUCCESS) {
    setTimeout(() => {
      process.exit();
    }, 1000);
  }
}

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      skipUserProfile: true,
      scope: SCOPES,
    },
    (accessToken, refreshToken, profile, done) => {
      onAuthSuccess({ accessToken, refreshToken });
      return done(null, {
        displayName: profile.displayName,
      });
    }
  )
);

const app = express();

app.use(passport.initialize());
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);

app.get('/', function (req, res) {
  res.redirect('/auth/slack');
});

app.get('/auth/slack', passport.authenticate('slack'));

app.get(
  '/auth/slack/callback',
  passport.authenticate('slack', {
    failureRedirect: '/error?login',
    failureMessage: true,
  }),
  function (req, res) {
    res.end(
      '<h1>Authentication succeeded</h1>See the console for the initial access and refresh tokens.<br>You can close this page.'
    );
  }
);

app.get('/error', (req, res, next) => {
  res.send(
    `<h1>Login error</h1>${req.session.messages?.join(
      '<br>'
    )}<br><a href='/'>Try again?</a>`
  );
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.end(
    `<h1>Error</h1><pre>${util.format(err)}</pre><a href='/'>Try again?</a>`
  );
});

app.listen(3000, () => {
  console.error(`👉 Visit ${process.env.BASE_URL}`);
});
