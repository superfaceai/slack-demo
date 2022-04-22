const { inspect } = require('util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens');
const { paginated } = require('../utils/paginated');

const sdk = new SuperfaceClient();

async function listChannels() {
  const profile = await sdk.getProfile('chat/channels');

  try {
    const results = paginated((page) =>
      withAccessToken((accessToken) =>
        profile.getUseCase('GetChannels').perform(
          {
            visibility: 'public',
            page,
          },
          {
            parameters: {
              accessToken,
            },
          }
        )
      )
    );
    for await (const result of results) {
      console.log(inspect(result, false, Infinity, true));
    }
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
}

listChannels();
