var commonjs = require('rollup-plugin-commonjs');
var istanbul = require('rollup-plugin-istanbul');
var resolve = require('rollup-plugin-node-resolve');

module.exports = function(karma) {
  var args = karma.args || {};

  karma.set({
    browsers: ['firefox'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'kjhtml'].concat(args.coverage ? ['coverage'] : []),

    files: [
      {pattern: './test/fixtures/**/*.js', included: false},
      {pattern: './test/fixtures/**/*.png', included: false},
      'node_modules/chart.js/dist/Chart.js',
      'test/index.js',
      'src/plugin.js'
    ].concat(args.inputs),

    // Explicitly disable hardware acceleration to make image
    // diff more stable when ran on Travis and dev machine.
    // https://github.com/chartjs/Chart.js/pull/5629
    customLaunchers: {
      firefox: {
        base: 'Firefox',
        prefs: {
          'layers.acceleration.disabled': true
        }
      }
    },

    preprocessors: {
      'test/fixtures/**/*.js': ['fixtures'],
      'test/specs/**/*.js': ['rollup'],
      'test/index.js': ['rollup'],
      'src/plugin.js': ['rollup']
    },

    rollupPreprocessor: {
      format: 'umd',
      plugins: [
        resolve(),
        commonjs(),
        istanbul({
          include: 'src/**/*.js'
        })
      ],
      external: [
        'chart.js'
      ],
      globals: {
        'chart.js': 'Chart'
      }
    },

    customPreprocessors: {
      fixtures: {
        base: 'rollup',
        options: {
          format: 'iife',
          name: 'fixture',
        }
      }
    },

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'lcovonly', subdir: '.'}
      ]
    }
  });
};