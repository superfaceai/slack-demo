const { join } = require('path');
require('dotenv').config();

module.exports = {
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  tokensFile: join(__dirname, '..', 'tokens.json'),
};
