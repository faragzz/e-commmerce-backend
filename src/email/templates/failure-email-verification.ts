export function verificationFailedHtml(email:string,role:string): string {
    const domain="localhost:3000";
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verification Failed</title>
      <style>
          body {
              background-color: #fcebea;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              text-align: center;
          }
          .container {
              max-width: 600px;
              background: #fff;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              margin: auto;
          }
          h1 {
              color: #e53935;
              margin-bottom: 10px;
          }
          p {
              font-size: 16px;
              color: #444;
          }
          .btn {
              margin-top: 30px;
              display: inline-block;
              padding: 12px 24px;
              background-color: #e53935;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>⚠️ Verification Failed</h1>
          <p>Sorry, the verification link is invalid or has expired.</p>
          <a class="btn" href="http://${domain}/auth/send-verification-email?email=${email}&role=${role}">Resend Email</a>
      </div>
  </body>
  </html>
  `;
}
