module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    files: [
      { pattern: 'src/assets/**/*.svg', included: false, served: true }
    ],
    browsers: ['Chrome'],
    browserNoActivityTimeout: 60000, // 60 segundos
    singleRun: false,
    restartOnFileChange: true,
  });
};
