import mongoose from 'mongoose';
import validator from 'validator';

/**
 * Collection schema for Emails
 */
let EmailsSchema = new mongoose.Schema({
    id: String,
    name: String,
    scheduled_date: Date,
    email: {
        type: String,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    body: String
})

export default mongoose.model('Email', EmailsSchema);