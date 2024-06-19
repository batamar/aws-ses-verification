const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

ses = new AWS.SES({
    apiVersion: 'latest',
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});

// Step 1: Create an Email Template
const templateParams = {
  Template: {
    TemplateName: 'CustomVerification',
    HtmlPart: '<html><body><h1>Email Verification</h1><p>Hello,</p><p>Please verify your email address by clicking the link below:</p><a href="{{verificationUrl}}">Verify Email</a><p>Thank you!</p></body></html>',
    SubjectPart: 'Verify Your Email Address',
    TextPart: 'Hello, Please verify your email address by clicking the link below: {{verificationUrl}} Thank you!'
  }
};

ses.createTemplate(templateParams, (err, data) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Create template data', data);
  }

  // Step 2: Verify Email Identity with Custom Template
  const verifyParams = {
    EmailAddress: process.env.EMAIL_TO_VERIFY,
    TemplateName: 'CustomVerification'
  };

  ses.sendCustomVerificationEmail(verifyParams, (verifyErr, verifyData) => {
    if (verifyErr) console.log(verifyErr);

    else console.log(verifyData);
  });
});