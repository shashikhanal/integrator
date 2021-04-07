import mongoose from 'mongoose';
import validator from 'validator';

/**
 * Collection schema for Patients
 */
let PatientsSchema = new mongoose.Schema({
    program_identifier: Number,
    data_source: String,
    card_number: Number,
    member_id: Number,
    first_name: String,
    last_name: String,
    dob: String,
    address_1: String,
    address_2: String,
    city: String,
    state: String,
    zip_code: Number,
    telephone: String,
    email: {
        type: String,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    consent: String,
    mobile: Number
})

export default mongoose.model('Patient', PatientsSchema);