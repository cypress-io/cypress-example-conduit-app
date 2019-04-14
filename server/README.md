# ![RealWorld Example App](.github/logo.png)
[![Build Status](https://travis-ci.org/devinivy/hapipal-realworld-example-app.svg?branch=master)](https://travis-ci.org/devinivy/hapipal-realworld-example-app)

> ### hapi pal codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://glitch.com/~hapipal-realworld)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged application backend built with [**hapi pal**](https://hapipal.com) including CRUD operations, authentication, routing, pagination, and more.  The functionality implemented in this project is specified by the [RealWorld API spec](https://github.com/gothinkster/realworld/tree/master/api).  See our Medium post ["Building real-world APIs with hapi pal"](https://medium.com/@hapipal/building-real-world-apis-with-hapi-pal-c0303fcef1c6) for an in-depth writeup about this project.

We've gone to great lengths to adhere to the **hapi pal** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## Getting started

The database used by this backend is [SQLite](https://github.com/mapbox/node-sqlite3), which is installed via `npm install`, so it's very simple to get started!

Just ensure you've installed a recent version of [nodejs](https://nodejs.org/en/download/) (v8.11+), which comes bundled with the npm package manager referenced in commands below.

> Note that the database is persisted to disk based upon the environment's `NODE_ENV`: `.test.db`, `.production.db`, etc., or `.tmp.db` by default.

##### Development installation
```sh
$ npm install
$ npm start
```

###### Test a route
```sh
$ npx hpal run debug:curl articles-list -v
```

###### Run test suite
```sh
$ npm test
```

##### Production installation

```sh
$ npm install --production
$ cp server/.env-keep server/.env
$ vi server/.env # Set APP_SECRET using your favorite editor
$ NODE_ENV=production npm start
```

## How it works

[hapi pal](https://hapipal.com/) is an ecosystem of tools and best practices for the [hapijs](https://hapijs.com/) web framework.  Lots of questions about this project are likely to be answered by following pal's [Getting Started](https://hapipal.com/getting-started) guide, but let's take a look at some of the highlights of this codebase.

### Directory structure

The codebase is based upon the [pal boilerplate](https://github.com/hapipal/boilerplate), which splits-up projects into two top-level directories: [`lib/`](lib) and [`server/`](server).

The `lib/` directory contains all the core functionality of the application.  Strictly speaking, it constitutes a [hapi plugin](https://hapijs.com/tutorials/plugins), which is a portable and well-encapsulated way to articulate a web service.  The sub-directories under `lib/` each define some pieces of the application: routes, models, services, other hapi plugins, etc.  Most of the contents of `lib/` are picked-up automatically by pal's file-based hapi plugin composer [haute-couture](https://github.com/hapipal/haute-couture), and were scaffolded using the [hpal CLI](https://github.com/hapipal/hpal).  Without haute-couture we would instead make many imperative calls to the hapi server interface; for example, we would call [`server.route()`](https://github.com/hapijs/hapi/tree/master/API.md#server.route()) rather than creating a file in `lib/routes/`, [`server.auth.strategy()`](https://github.com/hapijs/hapi/tree/master/API.md#server.auth.strategy()) rather than a file in `lib/auth/strategies/`, [`server.register()`](https://github.com/hapijs/hapi/tree/master/API.md#server.register()) rather than a file in `lib/plugins/`, etc.

The `server/` directory contains all configuration and code required to deploy the application.  Given that `lib/` exports a hapi plugin, `server/` is primarily responsible to create a hapi server and register the app's plugin with some configuration provided by `server/.env`.

The reasoning behind this separation of `lib/` and `server/` is explained in detail in an article: [The joys of server / plugin separation](https://hapipal.com/best-practices/server-plugin-separation).

### The model layer

This application's model is based upon [Objection ORM](https://github.com/Vincit/objection.js), which is integrated into hapi using the [schwifty](https://github.com/hapipal/schwifty) plugin.  Each model lives in [`lib/models/`](lib/models) and corresponds to a particular table in the SQLite database: `Users`, `Articles`, `Comments`, and `Tags`.

Our model layer is very light.  It represents a thin mapping between the application and the database, and enforces some basic rules related to data integrity: setting `createdAt` and `updatedAt` fields, computing an article's `slug` from its `title`, and validating column values when they are persisted to the database.  The models are used to interface with the database via Objection's wonderfully expressive SQL query builder which extends [knexjs](http://knexjs.org/).

You will find that models are used exclusively within the service layer, which is detailed below.

### The service layer

The service layer represents a sort of "headless" interface to all the actions and means of fetching data within the application.  You'll find a service method that causes one user to follow another, another to fetch a user's articles feed, etc.  In this way our route handlers/controllers have a means of sharing common logic ("how do I get an article by its id?") while hiding away the implementation details (e.g. details of the model) in a common library.  The service layer is actually generic enough that it could also be re-used to write a different interface to the exact same data and actions, such as a CLI.

We endow our application with a service layer using the [schmervice](https://github.com/hapipal/schmervice) hapi plugin.  Alongside the plugin, schmervice also ships with a base service class that provides some useful and convenient functionality, such as access to the hapi server and application configuration (plugin options), integration with the server's start/stop lifecycle, and the ability to leverage hapi's robust system for persistent caching.

This application has three services: the [`ArticleService`](lib/services/article.js), the [`UserService`](lib/services/user.js), and the [`DisplayService`](lib/services/display.js), all in the [`lib/services/`](lib/services) directory.  Each service is a class that extends schmervice's base class.  The `ArticleService` comes with methods such as `create()`, `findBySlug()`, and `addComment()`; it provides an interface to articles, comments, tags, and favorites.  The `UserService` comes with methods such as `signup()`, `findByUsername()`, and `login()`; it provides an interface to users, following, and authentication.

Lastly, the `DisplayService` is responsible for enriching and transforming user, article, comment, and tag models into objects transferred by the API endpoints.  This allows us to defer to the `ArticleService` and `UserService` to worry about the details of fetching/searching articles and users in various ways—which are complex in their own right—without having to also be concerned with composing the data in these equally complex API responses.  For example, the articles list (`GET /articles`) must be able to paginate while filtering by tag, author, or favorited status; then the API response must additionally include specially-formatted information about whether the author of each article is followed by the current user (if there's a logged-in user), and whether each article is favorited by the current user.  In the RealWorld specification there are also multiple representations of some models; for example, a user presents differently when the current user is acting on or asking for information about themselves, versus a separate user (a.k.a. a "profile").  That's a lot of responsibility, so we decided to decouple fetching from enriching/formatting!  Luckily, as you will see in the `DisplayService`, Objection's [`loadRelated()`](http://vincit.github.io/objection.js/#loadrelated) feature is especially well-suited to this approach.

The final point of interest in the service layer is its convention for transactions.  Objection's handling of SQL transactions is very ergonomic.  We take advantage of the fact that you may optionally specify a knex transaction object at query-time to any Objection query.  By convention, each of our database-backed service methods take a transaction object as an optional final argument.  That transaction object is simply passed down to any queries inside the method, and commits/rollbacks of a transaction are handled by the caller of the service method.  In this way _any_ database-backed service method may be composed into arbitrary transactions with other service methods without the caller having to understand the underlying queries being made.  More on this in the next section on routes!

### Routes

At the end of the day, we do all this work so that we can create some routes, or API endpoints.  Each route consists of a [hapi route configuration](https://github.com/hapijs/hapi/blob/master/API.md#server.route()) placed as a file in [`lib/routes/`](lib/routes).  These configurations provide information about the matching HTTP method and path; validation of incoming query, path, and payload parameters; authentication; and a handler or controller implementing the logic behind the route.

Validation is specified using hapi's robust [joi](https://github.com/hapijs/joi) validation library, which is the same means of validation used by our model layer.  Since the routes and models use the same means of validation, routes are able to refer to the model's validation.  For example, when a user logs-in the payload contains an `email` parameter that must be a valid email; in the route configuration we defer to the `User` model's definition of a valid email and mark it as a required field: [`User.field('email').required()`](lib/routes/users/signup.js#L16).

The route handlers themselves are relatively light.  They generally compose payload, query, and path parameters, and the user's authentication status into one or many calls into the service layer, then return a response.  Handlers are also responsible for the transactional integrity of their calls into the service layer.  For example, if a user makes requests in quick succession to favorite then unfavorite an article, each of those requests must come back reflecting the proper state: there should be no way for the request to unfavorite the article sneak its way in so that the request to favorite the article responds with `favorited: false`, or vice-versa.  So, handlers will often generate a transaction object using a thin helper around [`Objection.transaction()`](http://vincit.github.io/objection.js/#transaction]) (defined in [`lib/bind.js`](lib/bind.js)), then pass that transaction to the various service methods that it uses.   As mentioned in the previous section, handlers typically end with a call to the `DisplayService`, whose sole purpose is to format and enrich information about the model (users, articles, comments, and tags) for API responses.

### Authentication

Per the RealWorld API spec, authentication occurs via signed JSON Web Tokens (JWTs).  There are essentially two sides to this form of authentication:
 - The application must hand-out a JWT to a user when that user provides a matching email and password.
 - The application must verify the authenticity and contents of the JWT when it is passed with future requests.

In order to hand-out a JWT, we have a [login endpoint](lib/routes/users/login.js) that performs the process described above by calling into the service layer.  In particular, the [`UserService`](lib/services/user.js) has a [`login()`](lib/services/user.js#L96) method to lookup a user by their email and password, and a [`createToken()`](lib/services/user.js#L116) method to create a JWT containing the user's id.  Aside from the user id, `createToken()` also needs a "secret key" in order to sign the token.  In our case, we obtain the secret from our application's plugin options (`this.options.jwtKey`), which the `UserService` has access to because it extends the [schmervice](https://github.com/hapipal/schmervice) base class.  The `jwtKey` plugin option is set using the `APP_SECRET` environment variable inside our app's deployment, configured within [`server/`](server).

In order to verify the authenticity and contents of the JWTs passed with future requests, we utilize the [hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2) (registered via [haute-couture](https://github.com/hapipal/haute-couture) in [`lib/plugins`](lib/plugins)).  This plugin creates an "auth scheme" for JWTs which we configure into an auth strategy in [`lib/auth/strategies/jwt.js`](lib/auth/strategies/jwt.js).  The auth strategy determines the details underlying our JWT auth: tokens should be signed using a certain hashing algorithm, with a certain secret key (as described above); the token is further validated by looking-up the user whose id is stored on the token; etc.  One the auth strategy is created in this way, it's trivial to protect an API endpoint with JWT authentication using hapi's [`auth` route configuration](https://github.com/hapijs/hapi/blob/master/API.md#route.options.auth), as can be seen on [the route for article deletion](lib/routes/articles/delete.js#L16).

### Error handling

The RealWorld API Spec [is particular](https://github.com/gothinkster/realworld/tree/master/api#errors-and-status-codes) about the format and HTTP codes that our application responds with.  In order to meet those requirements we wrote a centralized hapi [request extension](https://github.com/hapijs/hapi/blob/master/API.md#server.ext.args()), which can be found in [`lib/extensions/error.js`](lib/extensions/error.js).  This request extension is a hook into hapi's [request lifecycle](https://github.com/hapijs/hapi/blob/master/API.md#request-lifecycle) to process all responses right before the server responds.  In hapi parlance this request extension point is called "`onPreResponse`".

There are a few different types of errors that are encountered in the app and pass through this request extension.  Whenever a route needs to express a standard HTTP error, its handler will throw a [boom](https://github.com/hapijs/boom) error, which is standard in the hapi ecosystem.  Other errors also may come from within the model layer (e.g. when a record is not found) or from a route's request validation (these are already considered "400 Bad Request" boom errors).  We interpret errors from the model with help from Objection's [objection-db-errors](https://github.com/Vincit/objection-db-errors) plugin—which normalizes database errors across the various flavors of SQL—and [avocat](https://github.com/PixulHQ/avocat) which further transforms them into hapi's preferred boom HTTP error objects; for example, a uniqueness violation may be transformed into a "409 Conflict" boom error.  Once the error is interpreted as an HTTP error, the final step is to simply format them into the shape preferred by the RealWorld specification.
