export enum LogLevel {
    SILENT = 0,
    ERROR = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4,
}

let currentLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel) {
    currentLevel = level;
}

export function getLogLevel(): LogLevel {
    return currentLevel;
}

// Capture real stdio functions so we can keep logging even after the CLI
// overrides `console.log` to silence protocol-level debug noise.
const realStdout = process.stdout.write.bind(process.stdout);
const realStderr = process.stderr.write.bind(process.stderr);

function fmt(args: any[]): string {
    return args.map(a => typeof a === 'string' ? a : (a instanceof Error ? a.message : JSON.stringify(a))).join(' ') + '\n';
}

export const log = {
    error: (...args: any[]) => { if (currentLevel >= LogLevel.ERROR) realStderr(fmt(args)); },
    info:  (...args: any[]) => { if (currentLevel >= LogLevel.INFO)  realStdout(fmt(args)); },
    debug: (...args: any[]) => { if (currentLevel >= LogLevel.DEBUG) realStdout(fmt(args)); },
    trace: (...args: any[]) => { if (currentLevel >= LogLevel.TRACE) realStdout(fmt(args)); },
};
