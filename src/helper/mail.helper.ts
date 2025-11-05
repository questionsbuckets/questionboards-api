import nodemailer from "nodemailer";
import ejs from "ejs";

const frontendUrl = process.env.FRONTEND_BASE_URL;
const commonUrls = {
  termsUrl: frontendUrl + "/terms-and-conditions",
  privacyUrl: frontendUrl + "/privacy-policy",
  agreementUrl: frontendUrl + "/agreement",
};

export const SendMail = async (
  recipient: string,
  subject: string,
  templatePath: string,
  data: any
) => {
  try {
    const host = process.env.EMAIL_HOST;
    const port = +process.env.EMAIL_PORT!;
    const email = process.env.EMAIL_ADDRESS;
    const pswd = process.env.EMAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: email,
        pass: pswd,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection configuration
    await transporter.verify();

    const renderData = { ...data, ...commonUrls };

    // Render email template
    const html = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(templatePath, renderData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Send email
    const mailOptions = {
      from: email,
      to: recipient,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error(`Failed to send email: ${(err as Error).message}`);
  }
};
