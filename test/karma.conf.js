module.exports = (config) => {
  config.set({
    logLevel: config.LOG_INFO, // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    singleRun: true,
    colors: true,
    autoWatch: false,
    exclude: [],
    port: 9999,
    basePath: '../',
    browsers: ['PhantomJS'],
    frameworks: [
      'mocha',
      'chai',
      'jspm'
    ],
    reporters: [
      'progress',
      'mocha'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chai',
      'karma-jspm'
    ],
    jspm: {
      config: 'jspm.conf.js',
      serveFiles: [
        'src/*.js',
        'src/*.js.map',
        'src/**/*.js',
        'src/**/*.js.map',
        'test/spec/*.js.map'
      ],
      loadFiles: [
        'test/spec/*.js'
      ]
    },
    mochaReporter: {
      output: 'minimal',
      showDiff: 'unified'
    }
  });
};
