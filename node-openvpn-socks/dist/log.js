"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.LogLevel = void 0;
exports.setLogLevel = setLogLevel;
exports.getLogLevel = getLogLevel;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["SILENT"] = 0] = "SILENT";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
    LogLevel[LogLevel["TRACE"] = 4] = "TRACE";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let currentLevel = LogLevel.INFO;
function setLogLevel(level) {
    currentLevel = level;
}
function getLogLevel() {
    return currentLevel;
}
// Capture real stdio functions so we can keep logging even after the CLI
// overrides `console.log` to silence protocol-level debug noise.
const realStdout = process.stdout.write.bind(process.stdout);
const realStderr = process.stderr.write.bind(process.stderr);
function fmt(args) {
    return args.map(a => typeof a === 'string' ? a : (a instanceof Error ? a.message : JSON.stringify(a))).join(' ') + '\n';
}
exports.log = {
    error: (...args) => { if (currentLevel >= LogLevel.ERROR)
        realStderr(fmt(args)); },
    info: (...args) => { if (currentLevel >= LogLevel.INFO)
        realStdout(fmt(args)); },
    debug: (...args) => { if (currentLevel >= LogLevel.DEBUG)
        realStdout(fmt(args)); },
    trace: (...args) => { if (currentLevel >= LogLevel.TRACE)
        realStdout(fmt(args)); },
};
