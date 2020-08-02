/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Babel config.
 */

module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false
            }
        ],
        "@babel/preset-typescript"
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-optional-chaining",
            {
                "loose": true
            }
        ],
        "@babel/plugin-external-helpers"
    ]
};
