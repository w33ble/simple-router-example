import createLogger from './logger';
import createEmitter from './emitter';

(function (root, options = {}) {
  if (!root) return;

  const logger = createLogger(root);
  const emitter = createEmitter();

  const location = options.location || root.history.location || root.location;

  const routerState = {
    running: false,
    options: {
      hashType: false,
      listen: true,
    },
    history: {},
  }

  const wrappedHistoryMethods = ['pushState', 'replaceState'];

  const wrapHistory = () => {
    wrappedHistoryMethods.forEach((method) => {
      // save reference to the original method
      routerState.history[method] = root.history[method];

      // override the method to emit custom event
      root.history[method] = (...args) => {
        routerState.history[method].call(root.history, ...args);
        emitter.emit('pushstate', args);
      };
    });
  };

  const resetHistory = () => {
    wrappedHistoryMethods.forEach((method) => {
      // restory the history methods
      root.history[method] = routerState.history[method];
    });
  };

  const popstateEmitter = (...args) => emitter.emit('popstate', args);
  const hashchangeEmitter = (...args) => emitter.emit('hashchange', args);

  const router = {
    start(opts) {
      if (routerState.running) return;
      Object.assign(routerState.options, opts);
      routerState.running = true;

      const onStateChange = payload => logger.log('statechange', payload);

      if (routerState.options.listen) {
        if (routerState.options.hashType !== false) {
          emitter.on('hashchange', ([p]) => {
            onStateChange([{}, '', location.hash.replace(routerState.options.hashType, '')]);
          });

          root.addEventListener('hashchange', hashchangeEmitter, false);
        } else {
          wrapHistory();

          emitter.on('pushstate', onStateChange).on('popstate', ([p]) => {
            const loc = `${location.pathname}${location.search}${location.hash}`;
            onStateChange([p.state, '', loc]);
          });

          root.addEventListener('popstate', popstateEmitter, false);
        }
      }

      logger.log(routerState)
    },

    stop() {
      if (!routerState.running) return;

      if (routerState.options.listen) {
        if (routerState.options.hashType !== false) {
          root.removeEventListener('hashchange', hashchangeEmitter, false);
          emitter.off('hashchange');
        } else {
          root.removeEventListener('popstate', popstateEmitter, false);
          emitter.off('pushstate').off('popstate');
        }
      }

      resetHistory();
      routerState.running = false;

      logger.log(routerState)
    },

    push(route, state = {}) {
      if (!routerState.running) return;

      logger.log('push route', route, state);
    },
  };

  root.router = router;

  return router;
}(window));
