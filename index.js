const sgMail = require('@sendgrid/mail');
const dotenv = require("dotenv");
dotenv.config();
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

console.log('Lambda initialized');

// Helper function to fetch secrets from AWS Secrets Manager
async function getSecret(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return data.SecretString;  // No need to parse, since it's plain text
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}:`, error);
    throw error;
  }
}

// Lambda handler
exports.handler = async (event) => {
  try {
    // Fetch secrets for SendGrid API Key and From Email
    const sendgridApiKeySecret = 'sendgrid_ApiKeySecret'; 
    const sendgridFromEmailSecret = 'sendgrid_FromEmailSecret'; 

    // Retrieve API Key and From Email
    const sendgridApiKey = (await getSecret(sendgridApiKeySecret));
    const sendgridFromEmail = (await getSecret(sendgridFromEmailSecret));

    // Set SendGrid API Key
    sgMail.setApiKey(sendgridApiKey);

    // Extract the message from the SNS event
    const snsMessage = event.Records[0].Sns.Message;
    const { email, token } = JSON.parse(snsMessage);

    // Generate the verification link
    const verificationLink = `${process.env.BASE_URL}/verify?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`;

    // Send the email using SendGrid
    const emailResponse = await sgMail.send({
      to: email,
      from: sendgridFromEmail, // Verified sender email
      subject: 'Email Verification',
      html: `<p>Hi,</p>
             <p>Thank you for signing up. Please click the link below to verify your email:</p>
             <p><a href="${verificationLink}">Verify Email</a></p>
             <p>This link will expire in 2 minutes.</p>`,
    });

    console.log(`Verification email sent to ${email}:`, emailResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Verification email sent to ${email}`,
      }),
    };
  } catch (error) {
    console.error('Error in Lambda function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error sending email verification',
        error: error.message,
      }),
    };
  }
};
