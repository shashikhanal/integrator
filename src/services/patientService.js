import Patient from '../models/Patients.js';

/**
 * Gets all patients' records on the basis of their consent
 */
export async function getAllPatientsWithConsent(value) {
    try {
        var result = await Patient.find({ 
            consent: value
        });
    } catch (e) {
        return {
            error: true,
            msg: 'Patients records could not be retrieved from the collection.' 
        }
    }

    return {
        error: false,
        msg: 'Patients records retrieved sucessfully.',
        data: result,
        count: result.length
    };
}

/**
 * Gets all patients' records
 */
 export async function getAllPatients(query, select) {
    select = (select != null && select != '') ? select : `program_identifier data_source card_number member_id first_name 
    last_name dob address_1 address_2 city state zip_code telephone email consent
    mobile -_id`;

    try {
        var result = await Patient.find(query)
        .select(select);
    } catch (e) {
        return {
            error: true,
            msg: 'Patients records could not be retrieved from the collection.' 
        }
    }

    return {
        error: false,
        msg: 'Patients records retrieved sucessfully.',
        data: result,
        count: result.length
    };
}