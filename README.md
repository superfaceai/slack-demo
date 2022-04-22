# Slack with Superface

This demo repository showcases the following integrations:

- [chat/channels](https://superface.ai/chat/channels)

## Setup

1. Run `npm install`
2. Copy `.env.example` to `.env`: `cp .env.example .env`
3. Setup HTTPS on localhost (see below)
4. Create a Slack app and set credentials in `.env` file (see below)
5. Get access token (see below)

### Setup HTTPS on localhost

Slack requires all callback URLs to be HTTPS, including to `localhost`.

You can use [mkcert](https://github.com/FiloSottile/mkcert) to generate a self-signed certificate:

```shell
mkcert -install
mkcert localhost
```

This will create `localhost.pem` and `localhost-key.pem` files in the current directory. Set the path to these files in `.env`:

```
HTTPS_KEY_PATH=localhost-key.pem
HTTPS_CERT_PATH=localhost.pem
```

<!-- FIXME
### Use a tunneling proxy

Alternatively you can use a tunneling proxy to receive a callback, e.g. [ngrok](https://ngrok.com/) or [localhost.run](https://localhost.run/). By default, the server listens on port 3000
-->

### Create Slack app

⚠ If possible, use a dedicated testing workspace for experiments.

1. Visit https://api.slack.com/apps and create a new app
2. Select "From an app manifest" and use the following app manifest:

   ```yaml
   display_information:
     name: Superface Test App
   features:
     bot_user:
       display_name: Superface Test App
       always_online: false
   oauth_config:
     redirect_urls:
       - https://localhost:3000/auth/slack/callback
     scopes:
       bot:
         - channels:read
         - chat:write
   settings:
     org_deploy_enabled: true
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

3. From Basic Information page, copy Client ID and Client Secret to `.env`:

   ```
   SLACK_CLIENT_ID=11111111.22222222
   SLACK_CLIENT_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
   ```

### Get access token

1. Run `npm start`
2. Visit `https://localhost:3000`
3. Authorize the application into your workspace
4. The `tokens.json` file should be created

Alternatively run `get-tokens.js` script and paste the generated JSON manually.

## Run demo scripts

- List public channels in the workspace: `node list-channels.js`
