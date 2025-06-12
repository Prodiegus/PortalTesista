module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [ /* ... */ ],

    client: {
      clearContext: false,
      jasmine: { random: false, stopOnSpecFailure: false, random: false },
      captureConsole: true,
      useIframe: false,
      runInParent: true
    },

    // Timeouts
    browserDisconnectTimeout: 30000,
    browserNoActivityTimeout: 60000,

    // Modo CI
    singleRun: true,
    autoWatch: false,
    restartOnFileChange: false,

    // Browser headless
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ]
      }
    },

    coverageReporter: { /* ... */ },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  });
};
