module.exports = function (wallaby) {

  // add any needed environment variables here
  process.env.PORT = 3000;
  process.env.APP_SECRET = 'SecretCodeForTests';

  return {

    files: ['src/**/*.js', 'src/**/*.txt', 'tests/supergoose.js'],

    tests: ['tests/**/*.test.js'],

    env: {

      type: 'node',

      runner: 'node',

      params: {

        runner: '--harmony',

      },

    },

    testFramework: 'jest',

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },

    setup: function () {
      require('dotenv').config();
      require('babel-core');
    },

  };

};