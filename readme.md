# router-test

[![poi](https://img.shields.io/badge/powered%20by-poi-808080.svg)](https://poi.js.org/)

Still very much a work in progress. I was just curious would it would take to write a bare-bones router using the native browser history.

To use:

```
# to install packages
yarn

# to run the code
yarn run start
```

Then open the URL in your browser and in the developer console:

```
window.router.start();

history.replaceState({page: 2}, "title 2", "/hello?page=2");

history.pushState({page: 3}, "title 3", "/hello?page=3");
```

You'll see some state change output on the page. Use the browser's back and forward buttons to see more state changes. To stop the router using `window.router.stop()`.
