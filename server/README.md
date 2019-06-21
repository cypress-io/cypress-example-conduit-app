# server

## Getting started

1. First, you install the npm dependencies:

```sh
npm ci
```

This will `npm ci` both the backend and the frontend

1. Then, build the code:

```sh
npm run build
```

This is not formally needed for running in dev, as it builds the production build for the frontend

1. Last, start the frontend and backend server:

```sh
npm start
```

1. To see the application, goto http://localhost:4100

## Copyright Notices

- Code under `client` directory was copied from [here](https://github.com/gothinkster/react-redux-realworld-example-app).
  There is no License in that directory, but this is part of [RealWorld](https://github.com/gothinkster/realworld),
  so it should be OK.
- Code under `server` directory was copied from [here](https://github.com/devinivy/hapipal-realworld-example-app).
  There is no License in that directory, but this is part of [RealWorld](https://github.com/gothinkster/realworld),
  so it should be OK.
