# brologger-slack

Slack transport for simple logging library

# Installation

Npm
```javascript
npm install brologger-slack
```

Yarn
```javascript
yarn add brologger-slack
```

# Support

This library is quite fresh, and maybe has bugs. Write me an **email** to *natashkinsash@gmail.com* and I will fix the bug in a few working days.

# Quick start

```javascript
    import Loger from 'brolloger';
    import SlackTransport from 'brologger-slack';

    const transport = new SlackTransport({ webhookUrl: 'url' })
    const logger = new Loger({transports: [transport]});
   
```

# TypesScript

This library have typing in module.
