module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! VelocityJS.org (1.1.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */\n' +
            '/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */\n'
        },
        build: {
            src: 'velocity.js',
            dest: 'velocity.min.js'
        }
    };
};