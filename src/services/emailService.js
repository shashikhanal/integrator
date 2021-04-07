import nodemailer from 'nodemailer';
import cron from 'node-cron';
import Email from '../models/Emails.js';
import * as generalHelper from '../helpers/generalHelper.js';

/**
 * Prepares and saves emails into the `Emails` collection
 * @param {*} patientRecords 
 * @returns 
 */
export async function prepareAndSaveEmails(patientRecords) {
    let emails = prepareEmails(patientRecords);

    try {
        var result = await saveIntoEmailsCollection(emails);
    } catch (e) {
        console.log('Error occured while saving into the Emails collection!');

        return {
            error: true,
            msg: 'Error occured while saving into the Emails collection!'
        };
    }

    return {
        error: false,
        msg: 'Emails successfully saved in emails collection.',
        count: result.insertedCount
    };
}

/**
 * Prepares emails with new scheduled time
 * @param {*} patientRecords 
 * @returns 
 */
function prepareEmails(patientRecords) {
    let emails = [];
    const days = {'Day 1' : 1, 'Day 2' : 2, 'Day 3' : 3, 'Day 4' : 4};

    patientRecords.forEach(record => {
        {
            for(const day in days) {
                let date = new Date();
                // set future date as scheduled date
                date.setDate(date.getDate() + days[day])

                emails.push({
                    id: record._id,
                    name: day,
                    scheduled_date: date,
                    email: record.email,
                    body: 'This is random email body.'
                });
            }
        }
    });

    return emails;
}

/**
 * Saves emails in bulk
 * @param {*} emails 
 */
 function saveIntoEmailsCollection(emails) {
    return Email.collection.insertMany(emails);
}

/**
 * Gets emails from `emails` collection
 */
export async function getEmails(query) {
    try {
        var result = await Email.find({query});
    } catch (e) {
        return {
            error: true,
            msg: 'Emails could not be retrieved from the collection.' 
        }
    }

    return {
        error: false,
        msg: 'Emails retrieved sucessfully.',
        data: result,
        count: result.length
    };
}

/**
 * Gets emails based on their distinct values from `emails` collection
 */
 export async function getDistinctEmails(query, select) {
    try {
        var result = await Email.find().distinct(query);
    } catch (e) {
        return {
            error: true,
            msg: 'Emails could not be retrieved from the collection.' 
        }
    }

    return {
        error: false,
        msg: 'Emails retrieved sucessfully.',
        data: result,
        count: result.length
    };
}

/**
 * Gets all emails according to the date interval passed
 */
export async function getEmailsInInterval(startDate, endDate) {
    try {
        var result = await Email.find({ 
            scheduled_date: {
                $gte: new Date(startDate.year, startDate.month, startDate.date), 
                $lt: new Date(endDate.year, endDate.month, endDate.date)
            },
            email: {
                $exists: true,
                $ne: ''
            }
        });
    } catch (e) {
        return {
            error: true,
            msg: 'Emails could not be retrieved from the collection.' 
        }
    }

    return {
        error: false,
        msg: 'Emails retrieved sucessfully.',
        data: result,
        count: result.length
    };
}

/**
 * Gets emails which are scheduled for today
 * @returns 
 */
async function getTodaysEmails() {
    const date = new Date();
    
    // TODO: for now 1 and 2 are added in start and end date respectively so that emails could be sent
    // today so that it gives some output and is tested
    // TODO: if needs to be deployed in production delete the 1 and replace 2 with 1.

    // start data and end date is calculated so that all emails in this range (i.e today's email) can be retrieved from the database
    const startDate = { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() + 1 };
    const endDate = { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() + 2 };

    return await getEmailsInInterval(startDate, endDate);
}

/**
 * Schedules emails
 */
export async function scheduleEmails(cronRuntime, stop = false) {
    try {
        // schedule the cron job to get todays emails and send them
        let job = cron.schedule(cronRuntime, async () => {
            const todaysEmails = await getTodaysEmails();
            console.log(`READY: ${todaysEmails.count} emails were retrieved for today.`);
            // counter for sent email
            let sentEmailCount = 0;

            todaysEmails.data.forEach(async email => {
                // send email only if the record has email address in it
                if (email.email !== null && email.email !== '') {
                    sentEmailCount++;
                    await sendEmail(email);
                }
            });

            console.log(`SENT: ${sentEmailCount} emails were sent today.`);
            // writes to email log
            await generalHelper.writeEmailLog({ 
                "ready_email_count": todaysEmails.count, 
                "sent_email_count": sentEmailCount
            });
        });

        job.start();

        // stop the cron job after 1 second if stop flag is set
        if(stop) {
            setTimeout(function() { job.stop(); }, 1000);
        }
    } catch (e) {
        console.log('Error occured while creating cron job.');

        return {
            error: true,
            msg: 'Error occured while creating cron job.'
        }
    }

    return {
        error: false,
        msg: 'Emails are scheduled as required!'
    }
}

/**
 * Sends email with user specified transport channel
 * @param {*} email 
 */
async function sendEmail(email) {
    let testAccount = process.env.EMAIL_ACCOUNT || await nodemailer.createTestAccount();

     // creates reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE || false, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_USER || testAccount.user, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD || testAccount.pass, // generated ethereal password
        },
    });

    // sends mail with defined transport object
    let info = await transporter.sendMail({
        from: `Tester ${process.env.SENDER_EMAIL}`,
        to: email.email,
        subject: email.name,
        text: email.body,
    });

    // console.log("MESSAGE SENT:", info.messageId);

    // preview available when sending through an Ethereal test account
    if (process.env.EMAIL_ACCOUNT == null || process.env.EMAIL_ACCOUNT == '') {
        // console.log("PREVIEW URL:", nodemailer.getTestMessageUrl(info));
    }
}
