export function verifiedEmailHtml(name: string): string {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verified</title>
      <style>
          body {
              background-color: #f4f4f4;
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
              color: #4CAF50;
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
              background-color: #4CAF50;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>🎉 Email Verified!</h1>
          <p>Hi ${name}, your email has been successfully verified.</p>
          <a class="btn">Go to Rushly App</a>
      </div>
  </body>
  </html>
  `;
}
