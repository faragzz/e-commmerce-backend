export function verifyEmailTemplate(
    verificationToken: string,
    name: string,
    email: string,
    role: string,
): string {
    const DOMAIN = "localhost:3000";
    const verificationUrl = `http://${DOMAIN}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`;

    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <table align="center" width="600" style="background-color: #ffffff; border-radius: 8px; padding: 30px; border: 1px solid #e0e0e0;">
      <tr>
        <td align="center">
          <h2 style="color: #4CAF50;">Welcome to Rushly 🎉</h2>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-size: 16px;">Hi ${name},</p>
          <p style="font-size: 16px;">Thanks for signing up! Please confirm your email address by clicking the button below:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               target="_blank"
               style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; cursor: pointer;">
              Verify My Email
            </a>
          </p>
          <p style="font-size: 13px; color: #777;">If you didn’t create an account, you can safely ignore this email.</p>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">© 2025 Rushly, All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    return htmlContent;
}
