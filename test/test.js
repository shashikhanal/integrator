import assert from 'assert';
import chai from 'chai';
const expect = chai.expect;

import '../env.js';
import '../src/db.js';
import * as fileService from '../src/services/fileService.js';
import * as patientService from '../src/services/patientService.js';
import * as emailService from '../src/services/emailService.js';
import * as emailHelper from '../src/helpers/emailHelper.js';
import * as generalHelper from '../src/helpers/generalHelper.js';

//  verify the data in flat file matches the data in Patients collection'
describe('DataFrom_FlatFile_And_PatientsCollection_Be_Same', function() {
  describe('#fileService', function() {
    it('should return true when content from flat file is compared with content from Patients collection', async function() {
      const contentFromFile = await fileService.parseDataFromFile(process.env.INPUT_FILE);
      const contentFromPatientsCollection  = await patientService.getAllPatients({});

      expect(JSON.stringify(contentFromFile)).to.equal(JSON.stringify(contentFromPatientsCollection.data));
    });
  });
});

// print out all Patient IDs where the first name is missing
describe('Print_All_Patients_IDs_Where_FirstName_Is_Missing', function() {
  describe('#patientService without first name', function() {
    it('should print out all the Patient IDs where the first name is missing', async function() {
      // create query to extract patients ids if their first name is blank
      const query = { 'first_name': '' };
      const select = `_id`;
      const patientIds = await patientService.getAllPatients(query, select);
      
      console.log(patientIds.data);
    });
  });
});

// print out all Patient IDs where the email address is missing, but consent is Y
describe('Print_All_Patients_IDs_Where_Email_Is_Missing_But_Consent_Is_Y', function() {
  describe('#patientService and #emailService without email but consent is Y', function() {
    it('should print out all the Patient IDs where the email is missing but consent is Y', async function() {
      // create query to extract patients ids if their first name is blank
      const query = { 'email': '', consent: 'Y' };
      const select = '_id';
      const patientIds = await patientService.getAllPatients(query, select);
      
      console.log(patientIds.data);
    });
  });
});

// verify Emails were created in Emails Collection for patients who have CONSENT as Y
describe('Emails_Created_In_EmailsCollection_Are_For_Patients_Whose_Consent_Is_Y', function() {
  describe('#emailService', function() {
    it('should create emails in Emails Collection for patients who have consent as Y', async function() {
      // also create query to extract patients records if their consent is Y
      const patientsIds = await patientService.getAllPatients({ 'consent': 'Y' }, '_id');
      const emailIds = await emailService.getDistinctEmails( 'id' , 'id');
      
      expect(emailHelper.toArray(patientsIds.data)).to.eql(emailIds.data);
    });
  });
});

// verify emails for each patient are scheduled correctly
describe('Emails_ForEach_Patient_Are_Scheduled_Correctly', function() {
  describe('#emailService', function() {
    it('should schedule emails correctly', async function() {
      this.timeout(0);
      // schedule emails every second
      const cronRuntime = '*/1 * * * * *'
      await emailService.scheduleEmails(cronRuntime, true); // true flag denotes the cron job stops after single execution
      
      // wait for log to be written and then get the log
      await new Promise(resolve => setTimeout(resolve, 2000));
      const emailLog = await generalHelper.getEmailLog();

      // match if prepared email count and sent email count for the day is same
      expect(emailLog.ready_email_count).to.equal(emailLog.sent_email_count);
    });
  });
});