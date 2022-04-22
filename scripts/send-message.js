const { inspect } = require('util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens');

const sdk = new SuperfaceClient();

async function sendMessage(destination, text) {
  const profile = await sdk.getProfile('chat/send-message');

  const result = await withAccessToken((accessToken) =>
    profile.getUseCase('SendMessage').perform(
      {
        destination,
        text: 'Lorem **ipsum** dolor',
      },
      {
        parameters: {
          accessToken,
        },
      }
    )
  );

  result.match(
    (value) => console.log(inspect(value, false, Infinity, true)),
    (err) => console.error(inspect(err, false, Infinity, true))
  );
}

const channel = process.argv[2];
const text = process.argv[3];

if (!channel || !text) {
  console.error('Usage: node send-message.js <channel ID> <text>');
}

sendMessage(channel, text);
