**Email Verification Lambda Function**

This Lambda function is designed to send email verification links to users upon sign-up. It leverages SendGrid for email delivery and relies on environment variables for API keys and base URLs.

**Prerequisites**

- **SendGrid API Key:** Obtain a SendGrid API key and set it as the `SENDGRID_API_KEY` environment variable.
- **Base URL:** Set the `BASE_URL` environment variable to the base URL of your application.
- **Sender Email:** Set the `SENDGRID_FROM_EMAIL` environment variable to a verified sender email address.

**How it Works**

1. **Trigger:** The Lambda function is triggered by an SNS message containing the user's email and verification token.
2. **Verification Link Generation:** The function constructs a verification link using the base URL, email, and token.
3. **Email Sending:** The verification link is embedded in an HTML email and sent to the user's email address using SendGrid.
4. **Response:** The function returns a success or failure response based on the email sending outcome.

**Environment Variables**

- **SENDGRID_API_KEY:** Your SendGrid API key.
- **BASE_URL:** The base URL of your application.
- **SENDGRID_FROM_EMAIL:** A verified sender email address.

**Deployment**

1. **Configure Environment Variables:** Ensure the environment variables are set correctly in your Lambda function's configuration.
2. **Deploy to AWS:** Deploy the Lambda function to AWS, associating it with the appropriate SNS topic.
3. **Test:** Trigger the function with a test SNS message to verify email delivery and link functionality.

**Troubleshooting**

- **Missing Environment Variables:** Check if the environment variables are set correctly and accessible by the Lambda function.
- **SendGrid API Key:** Verify the validity and permissions of the SendGrid API key.
- **Sender Email Verification:** Ensure that the sender email address is verified with SendGrid.
- **Email Delivery Issues:** Consult SendGrid's documentation for troubleshooting email delivery problems.
- **Lambda Function Errors:** Check the Lambda function logs for any error messages.
