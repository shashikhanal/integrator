// helper functions for general tasks
import fs from 'fs';

/**
 * Writes email log
 * @param {*} log 
 * @returns 
 */
export async function writeEmailLog(log) {
    return fs.writeFileSync(process.env.LOG_FILE, JSON.stringify(log));
}

/**
 * Gets email log
 */
export async function getEmailLog() {
    return JSON.parse(fs.readFileSync(process.env.LOG_FILE, 'utf-8'))
}