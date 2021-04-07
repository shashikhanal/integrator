import fs from 'fs';
import csv from 'csv-parser';
import Patient from '../models/Patients.js';

/**
 * @param filepath
 * @returns Object
 */
export async function loadData(inputFilePath) {
    let records = await parseDataFromFile(inputFilePath);

    // save the data into the collection
    try {
        var result = await saveIntoPatientsCollection(records);
    } catch (e) {
        console.log('Error occured while saving into the Patients collection!');

        return {
            error: true,
            msg: 'Error occured while saving into the Patients collection!'
        };
    }

    return {
        error: false,
        msg: 'Data successfully saved in collection.',
        count: result.insertedCount
    };
}

/**
 * Parses data from flat file
 * @returns 
 */
export async function parseDataFromFile(inputFilePath) {
    let records = [];
    const readStream = fs.createReadStream(inputFilePath);
    
    // parse the data and preprocess it
    try {
        // parse the data from the stream
        for await (const chunk of readStream.pipe(csv({ separator: '|' }))) {
            records.push(preprocessData(chunk));
        }
    } catch (e) {
        console.log('Error occured while creating read stream!');
        
        return {
            error: true,
            msg: 'Error occured while creating read stream!'
        };
    }

    return records;
}

/**
 * Saves documents in bulk
 * @param {*} records 
 */
function saveIntoPatientsCollection(records) {
    return Patient.collection.insertMany(records);
}

/**
 * Preprocess the records
 * @param {*} document 
 * @returns 
 */
function preprocessData(document) {
    return {
        program_identifier: !isNaN(parseInt(document['Program Identifier'])) ? parseInt(document['Program Identifier']) : '',
        data_source: document['Data Source'] !== '' ? document['Data Source'] : '',
        card_number: !isNaN(parseInt(document['Card Number'])) ? parseInt(document['Card Number']) : '',
        member_id: !isNaN(parseInt(document['Member ID'])) ? parseInt(document['Member ID']) : '',
        first_name: document['First Name'] !== '' ? document['First Name'] : '',
        last_name: document['Last Name'] !== '' ? document['Last Name'] : '',
        dob: document['Date of Birth'] !== '' ? document['Date of Birth'] : '',
        address_1: document['Address 1'] !== '' ? document['Address 1'] : '',
        address_2: document['Address 2'] !== '' ? document['Address 2'] : '',
        city: document['City'] !== '' ? document['City'] : '',
        state: document['State'] !== '' ? document['State'] : '',
        zip_code: !isNaN(parseInt(document['Zip code'])) ? parseInt(document['Zip code']) : '',
        telephone: document['Telephone number'] !== '' ? document['Telephone number'] : '',
        email: document['Email Address'] !== '' ? document['Email Address'] : '',
        consent: document['CONSENT'] !== '' ? document['CONSENT'] : '',
        mobile: !isNaN(parseInt(document['Mobile Phone'])) ? parseInt(document['Mobile Phone']) : ''
    }
}