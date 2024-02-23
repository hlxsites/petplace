# AEM EDS Reverse Proxy

This is a reverse proxy that will handle newsletter submissions and properly proxy the calls to the right backend.

# Development

Install Fastly CLI
Edit the `local_server` values in `fastly.toml`:
- specify the right backend URL
- specify the right secrets
Run `fastly compute serve --watch`

# Deployment

Set up an PAT token for the service in https://manage.fastly.com/account/personal/tokens
Run `fastly profile update` and switch to that PAT token
Run `fastly compute deploy`
And then `fastly compute publish` to make this live