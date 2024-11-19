
const sgMail = require('@sendgrid/mail');
console.log('INSIDE')
const dotenv = require("dotenv");
dotenv.config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('Fail')

// Lambda handler
exports.handler = async (event) => {
  try {
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
      from: process.env.SENDGRID_FROM_EMAIL, // Verified sender email
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
