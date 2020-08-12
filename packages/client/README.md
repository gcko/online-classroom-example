A Sketch prototype of this app can be found [here](https://www.sketch.com/s/88f4743d-63e1-4699-ba46-fc1e52ffb7ac). 

## Overview

Please see the main [Readme](../../README.md) for the full overview of the application.

## 3rd Party Libraries

In order to realize the creation of this app within a reasonable timeframe, I have utilized
a few 3rd party libraries to cover certain tasks. For the front-end, these include the 
following:

* [Bootstrap](https://getbootstrap.com/) - A fully featured and modular styling package
 incorporating a number of best practices. It is fairly simple to pick and choose what to use.
 See [current implementation](src/index.sass).
* [React Bootstrap Icons](https://github.com/ismamz/react-bootstrap-icons) - Simple React
 module that allows you to easily add bootstrap icons to React components.
* [React-Ace](https://github.com/securingsincity/react-ace) - wraps the venerable 
 [Ace](https://ace.c9.io/) code editor, the primary editor for the 
 [Cloud9 IDE](https://c9.io/).
* [React Style Tag](https://github.com/planttheidea/react-style-tag) - Allows to inline css
 styles within React components. This is useful when you need to add a small change to a 
 parent component but don't want to break code encapsulation.
* [React Helment](https://github.com/nfl/react-helmet) - Ability to add modifications to 
 the `<head>` DOM element from any React component. Useful for programmatically changing 
 the `<title>` of the page.
* [Pluralize](https://github.com/blakeembrey/pluralize) - A simple plugin that adds the ability 
 to modify a singular to a plural, and vice-versa, based on a `count`.
* [React Router](https://reactrouter.com/) - Adds the ability to turn the app into a full
 SPA, hooking up `history` with React context. See [current implementation](src/index.js).

## Tests

In the project directory, you can run:

### `yarn test`

To see a brief list of tests, please check [Lobby.test.js](src/lobby/Lobby.test.js).
