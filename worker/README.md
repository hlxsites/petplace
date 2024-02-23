# AEM EDS Reverse Proxy

This is a reverse proxy that will handle newsletter submissions and properly proxy the calls to the right backend.

# Development

Install Fastly CLI
Edit the `local_server` values in `fastly.toml`:
- specify the right backend URL
- specify the right secrets
Run `fastly compute serve --watch`

# Deployment

Run `fastly compute deploy`
And then `fastly compute publish` to make this live