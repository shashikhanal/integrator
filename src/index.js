'use strict';

import '../env.js';
import './db.js';
import * as fileService from './services/fileService.js';
import * as emailService from './services/emailService.js';
import * as patientService from './services/patientService.js';

const inputFile = process.env.INPUT_FILE;

/**
 * Loads content from the file and saves into the collection
*/
let result = await fileService.loadData(inputFile);
console.log(result);

if (result.error) {
    console.log(result.msg);
    process.exit(0);
}

// gets all patients' records with CONSENT = Y
let patientsRecords = await patientService.getAllPatientsWithConsent('Y');

if (patientsRecords.error) {
    console.log(patientsRecords.msg);
    process.exit(0);
}

// creates emails
result = await emailService.prepareAndSaveEmails(patientsRecords.data);
console.log(result);

if (result.error) {
    console.log(result.msg);
    process.exit(0);
}

// UNCOMMENT to this runs cron job every second, used for testing
// const cronRuntime = ''*/1 * * * * *''
// this runs cron job for all days in the week
const cronRuntime = '* * * * * 0,1,2,3,4,5,6'
result = await emailService.scheduleEmails(cronRuntime);

console.log(result);
