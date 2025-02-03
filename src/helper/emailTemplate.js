const emailTemplates = {
  generatedPassword: (email, password, name) => ({
    from: `"IMM Remember" <friilim19@gmail.com>`,
    to: email,
    subject: "Your Akun iRemember",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Akun IRemember</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #d1cdcd; font-family: Arial, sans-serif;">
    <table style="width: 100%; background-color: #d1cdcd; text-align: center; padding: 20px;">
      <tr>
        <td>
          <table style="background: #ffffff; margin: 0 auto; width: 320px; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png?updatedAt=1737896281354"
                     style="width: 100%; height: auto; display: block;">
              </td>
            </tr>
            <!-- Divider Line -->
            <tr>
              <td style="background-color: #482f92; height: 4px;"></td>
            </tr>
            <!-- Email Content -->
            <tr>
              <td style="padding: 20px; color: #637381; font-size: 14px;">
                <h2 style="margin: 0 0 16px; color: #000;">Akun iRemember</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Dear ${name},</p>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Kami telah membuatkan akun untuk Anda di aplikasi iRemember. Berikut detail akun Anda :</p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width: 30%; color: #000; font-size: 12px; padding-bottom: 8px;"><strong>Email</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;">: ${email}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;"><strong>Password</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;">: ${password}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Pastikan Anda segera login menggunakan email dan password di atas, lalu ubah password Anda untuk keamanan.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">Login</a>
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Kami berkomitmen untuk membantu Anda mengelola Permit dan pengingat dengan lebih efisien.
                </p>
                <p style="margin: 0; font-size: 12px; color: #637381;">Salam hangat,<br>
                  <strong style="color: #000;margin: 0 0 16px;">Tim IRemember</strong>
                </p>
                <p style="font-size: 10px; color: #637381;">
                  <i>Note: Email ini dikirim secara otomatis oleh sistem iRemember<i>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
  }),

  resetPassword: (email, password, name) => ({
    from: `"IMM Remember" <friilim19@gmail.com>`,
    to: email,
    subject: "Reset Your Account Password iRemember",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Reset Password Akun IRemember</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #d1cdcd; font-family: Arial, sans-serif;">
    <table style="width: 100%; background-color: #d1cdcd; text-align: center; padding: 20px;">
      <tr>
        <td>
          <table style="background: #ffffff; margin: 0 auto; width: 320px; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png?updatedAt=1737896281354"
                     style="width: 100%; height: auto; display: block;">
              </td>
            </tr>
            <!-- Divider Line -->
            <tr>
              <td style="background-color: #482f92; height: 4px;"></td>
            </tr>
            <!-- Email Content -->
            <tr>
              <td style="padding: 20px; color: #637381; font-size: 14px;">
                <h2 style="margin: 0 0 16px; color: #000; font-size:16px">Reset Password Akun iRemember</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Dear ${name},</p>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Kami telah mereset password akun anda di aplikasi iRemember. Berikut detail akun Anda :</p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width: 30%; color: #000; font-size: 12px; padding-bottom: 8px;"><strong>Email</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;">: ${email}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;"><strong>Password</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;">: ${password}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Pastikan Anda segera login menggunakan email dan password di atas, lalu ubah password Anda untuk keamanan.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">Login</a>
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Kami berkomitmen untuk membantu Anda mengelola Permit dan pengingat dengan lebih efisien.
                </p>
                <p style="margin: 0; font-size: 12px; color: #637381;">Salam hangat,<br>
                  <strong style="color: #000;margin: 0 0 16px;">Tim IRemember</strong>
                </p>
                <p style="font-size: 10px; color: #637381;">
                  <i>Note: Email ini dikirim secara otomatis oleh sistem iRemember<i>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
  }),

  rememberObligation: (
    to,
    ObligationId,
    ObligationName,
    obligationType,
    obligationCategory,
    institution,
    description,
    dueDate,
    status,
    latestUpdate,
    cc
  ) => ({
    from: `IMM Remember" <friilim19@gmail.com>`,
    to,
    cc,
    subject: `Remember: Your ${obligationCategory} ${obligationType} is in ${status}`,
    html: `
          <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Remember: Your ${obligationCategory} ${obligationType} is in ${status}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #d1cdcd; font-family: Arial, sans-serif;">
    <table style="width: 100%; background-color: #d1cdcd; text-align: center; padding: 20px;">
      <tr>
        <td>
          <table style="background: #ffffff; margin: 0 auto; width: auto; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018s.png"
                     style="width: 100%; height: 100px; object-fit: contain; display: block;">
              </td>
            </tr>
            <!-- Divider Line -->
            <tr>
              <td style="background-color: #482f92; height: 4px;"></td>
            </tr>
            <!-- Email Content -->
            <tr>
              <td style="padding: 20px; color: #637381; font-size: 14px;">
                <h2 style="margin: 0 0 16px; color: #000;">Remember: Your ${obligationCategory} ${obligationType} is in ${status}</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">
                  Berikut adalah detail obligasi Anda:
                </p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width:140px;color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Name</strong></td>
                    <td style="width:auto;color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${ObligationName}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Type</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${obligationType}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Category</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${obligationCategory}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Institution</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${institution}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Description</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${description}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Due Date</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${dueDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Status</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${status}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Latest Update</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${latestUpdate}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 12px; color: #637381;">
                  Terima kasih atas perhatian Anda terhadap obligasi ini.
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Silakan klik tombol di bawah ini untuk melihat detail obligasi Anda.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com/${ObligationId}" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">View</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #637381;">Salam hangat,<br>
                  <strong style="color: #000;margin: 0 0 16px;">Tim IRemember</strong>
                </p>
                <p style="font-size: 10px; color: #637381;">
                  <i>Catatan: Email ini dikirim secara otomatis oleh sistem iRemember. Harap tidak membalas email ini.</i>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        `,
  }),

  actionObligation: (
    to,
    action,
    ObligationId,
    ObligationName,
    obligationType,
    obligationCategory,
    institution,
    description,
    dueDate,
    status,
    cc
  ) => ({
    from: `IMM Remember" <friilim19@gmail.com>`,
    to,
    cc,
    subject: `Your ${obligationCategory} ${obligationType} has been ${action}`,
    html: `
          <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Your ${obligationCategory} ${obligationType} has been ${action}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #d1cdcd; font-family: Arial, sans-serif;">
    <table style="width: 100%; background-color: #d1cdcd; text-align: center; padding: 20px;">
      <tr>
        <td>
          <table style="background: #ffffff; margin: 0 auto; width: auto; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018s.png"
                     style="width: 100%; height: 100px; object-fit: contain; display: block;">
              </td>
            </tr>
            <!-- Divider Line -->
            <tr>
              <td style="background-color: #482f92; height: 4px;"></td>
            </tr>
            <!-- Email Content -->
            <tr>
              <td style="padding: 20px; color: #637381; font-size: 14px;">
                <h2 style="margin: 0 0 16px; color: #000;">Your ${obligationCategory} ${obligationType} has been ${action}</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">
                  Berikut adalah detail obligasi Anda:
                </p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width:140px;color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Name</strong></td>
                    <td style="width:auto;color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${ObligationName}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Type</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${obligationType}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Obligation Category</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${obligationCategory}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Institution</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${institution}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Description</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${description}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Due Date</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${dueDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Status</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${status}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 12px; color: #637381;">
                  Terima kasih atas perhatian Anda terhadap obligasi ini.
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Silakan klik tombol di bawah ini untuk melihat detail obligasi Anda.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com/${ObligationId}" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">View</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #637381;">Salam hangat,<br>
                  <strong style="color: #000;margin: 0 0 16px;">Tim IRemember</strong>
                </p>
                <p style="font-size: 10px; color: #637381;">
                  <i>Catatan: Email ini dikirim secara otomatis oleh sistem iRemember. Harap tidak membalas email ini.</i>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        `,
  }),
};

module.exports = emailTemplates;
