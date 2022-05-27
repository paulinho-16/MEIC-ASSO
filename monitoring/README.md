# NAGIOS Monitoring

To add new hosts and endpoints to be monitored you can either extend the `uni4all.cfg` configuration file with new services or create a new one. If you create a new configuration file you need to update the `nagios.cfg` file with its path as exemplified for the `uni4all.cfg` and `monitoring.cfg` files.

## Currently being monitored

The endpoints that have [HTTP] before are being monitored for HTTP error codes or delays longer than 10 seconds.

- uni4all.servehttp.com

  - PING
  - SSL Certificate expiration date (if less than 60 days gives WARNING)

- [HTTP] uni4all.servehttp.com/status
- [HTTP] uni4all.servehttp.com/jobs
- [HTTP] uni4all.servehttp.com/associations
- [HTTP] uni4all.servehttp.com/library
- [HTTP] uni4all.servehttp.com/news
