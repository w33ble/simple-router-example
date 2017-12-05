export default function createLogger(root, selector = 'body') {
  if (!root || !root.document.querySelector) return {};

  const target = root.document.querySelector(selector);

  const logger = {
    log(...msgs) {
      const log = document.createElement('div');

      const line = msgs.reduce((logline, msg) => {
        const part = ('object' === typeof msg) ? JSON.stringify(msg) : msg;
        return `${logline} ${part}`;
      }, '');

      log.innerHTML = `${(new Date()).toString()}: ${line}`;

      target.appendChild(log);
    }
  };

  return logger;
}