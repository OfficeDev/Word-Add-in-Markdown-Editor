// Polyfills
import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

if ('production' === process.env.ENV) {
    // Production
} else {
    // Development
    Error.stackTraceLimit = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}