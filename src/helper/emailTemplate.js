const emailTemplates = {
  generatedPassword: (email, password) => ({
    from: `"IMM Remember" <friilim19@gmail.com>`,
    to: email,
    subject: "Your Akun IRemember",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #0078D4;">Hello,</h2>
          <p>Your new password has been generated:</p>
          <p><strong>${password}</strong></p>
          <p>Please log in using this password and update it as soon as possible.</p>
          <p>Thank you,<br>Team Your App Name</p>
        </div>
      `,
  }),

  generalMessage: (to, subject, messageContent) => ({
    from: `"Your App Name" <no-reply@yourdomain.com>`,
    to,
    subject,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #0078D4;">Hello,</h2>
          <p>${messageContent}</p>
          <p>Thank you,<br>Team Your App Name</p>
        </div>
      `,
  }),
};

module.exports = emailTemplates;
