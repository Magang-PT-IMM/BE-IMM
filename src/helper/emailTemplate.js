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
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png"
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
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png"
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

  rememberNotification: (
    to,
    ticketId,
    name,
    permitName,
    lastStatus,
    lastStatusDescription,
    lastUpdate,
    lastUpdateBy,
    cc
  ) => ({
    from: `IMM Remember" <friilim19@gmail.com>`,
    to,
    cc,
    subject: `Ticket ${ticketId} Notification`,
    html: `
        <!DOCTYPE html>
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
          <table style="background: #ffffff; margin: 0 auto; width: auto; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png"
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
                <h2 style="margin: 0 0 16px; color: #000;">Remember Ticket ${ticketId}</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Dear ${name},</p>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Berikut status terakhir dari ticket yang telah dibuat pada aplikasi iRemember,</p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width:140px;color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Ticket Number</strong></td>
                    <td style="width:auto;color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${ticketId}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Name</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitName}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Last Status</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${lastStatus}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Last Status Description</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${lastStatusDescription}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Last Update</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${lastUpdate}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 0px; vertical-align: top;white-space: nowrap;"><strong>Last Update By</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 0px;max-width: 800px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${lastUpdateBy}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 12px; color: #637381;">
                  Diharapkan para PIC untuk rutin melakukan pembaharuan status tiket pada aplikasi hingga statusnya <strong>Complete</strong>.
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Silahkan klik button dibawah ini untuk melakukan pembaharuan status pada tiket <strong>${ticketId}</strong>.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">Update</a>
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

  createTicket: (
    to,
    ticketId,
    department,
    permitName,
    permitCategory,
    institution,
    externalRelation,
    description,
    cc
  ) => ({
    from: `IMM Remember" <friilim19@gmail.com>`,
    to,
    cc,
    subject: `Create Ticket ${ticketId}`,
    html: `
        <!DOCTYPE html>
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
          <table style="background: #ffffff; margin: 0 auto; width: auto; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
            <!-- Header Image -->
            <tr>
              <td>
                <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png"
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
                <h2 style="margin: 0 0 16px; color: #000;">Create Ticket ${ticketId}</h2>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Dear ${externalRelation},</p>
                <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Tiket telah dibuat oleh Departemen <strong>${department}</strong> melalui aplikasi IRemember. Berikut adalah detail tiket tersebut:</p>
                <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                  <tr>
                    <td style="width:140px;color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Ticket Number</strong></td>
                    <td style="width:auto;color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${ticketId}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Name</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitName}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Category</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitCategory}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Institution</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${institution}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Owner Permit</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${department}</td>
                  </tr>
                  <tr>
                    <td style="color: #000; font-size: 12px; padding-bottom: 0px; vertical-align: top;white-space: nowrap;"><strong>Description (optional)</strong></td>
                    <td style="color: #000; font-size: 12px; padding-bottom: 0px;max-width: 800px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${description}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 12px; color: #637381;">
                  Mohon menunggu informasi lebih lanjut dari Departemen ${department} yang akan dikirim melalui email aplikasi iRemember.
                </p>
                <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                  Silahkan klik button dibawah ini untuk melihat tiket <strong>${ticketId}</strong>.
                </p>
                <!-- Button -->
                <p style="text-align: center; margin: 0 0 20px;">
                  <a href="https://your-login-link.com" 
                     style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">View</a>
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

  createPermit: (
    permitId,
    permitNumber,
    permitName,
    permitCategory,
    institution,
    department,
    issueDate,
    validityPeriod,
    expireDate,
    status,
    description,
    to,
    cc
  ) => ({
    from: `IMM Remember" <friilim19@gmail.com>`,
    to,
    cc,
    subject: `Create Permit ${permitId}`,
    html: `
          <!DOCTYPE html>
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
            <table style="background: #ffffff; margin: 0 auto; width: auto; text-align: left; border-spacing: 0; border-collapse: collapse; overflow: hidden; border-radius: 8px;">
              <!-- Header Image -->
              <tr>
                <td>
                  <img src="https://ik.imagekit.io/vyck38py3/Group%2018.png?updatedAt=1737896281354"
                       style="width: 100%; height: 150px; object-fit: contain; display: block;">
                </td>
              </tr>
              <!-- Divider Line -->
              <tr>
                <td style="background-color: #482f92; height: 4px;"></td>
              </tr>
              <!-- Email Content -->
              <tr>
                <td style="padding: 20px; color: #637381; font-size: 14px;">
                  <h2 style="margin: 0 0 16px; color: #000;">Create Permit ${permitId}</h2>
                  <p style="margin: 0 0 12px; color: #637381; font-size: 12px;">Permit telah dibuat melalui aplikasi IRemember. Berikut adalah detail permit tersebut:</p>
                  <table style="width: 100%; margin: 16px 0; border-spacing: 0;">
                    <tr>
                      <td style="width:140px;color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Number</strong></td>
                      <td style="width:auto;color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitNumber}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Name</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitName}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Permit Category</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${permitCategory}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Institution</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${institution}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Owner Permit</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${department}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Issue Date</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${issueDate}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Validity Period</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${validityPeriod}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Expire Date</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${expireDate}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;vertical-align: top;white-space: nowrap;"><strong>Status</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 8px;max-width: 400px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${status}</td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 12px; padding-bottom: 0px; vertical-align: top;white-space: nowrap;"><strong>Description (optional)</strong></td>
                      <td style="color: #000; font-size: 12px; padding-bottom: 0px;max-width: 800px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">: ${description}</td>
                    </tr>
                  </table>
                  <p style="margin: 0 0 8px; font-size: 12px; color: #637381;">
                    Terimakasih atas kontribusinya dalam pembuatan permit <strong>${permitName}</strong>.
                  </p>
                  <p style="margin: 0 0 16px; font-size: 12px; color: #637381;">
                    Silahkan klik button dibawah ini untuk melihat permit.
                  </p>
                  <!-- Button -->
                  <p style="text-align: center; margin: 0 0 20px;">
                    <a href="https://your-login-link.com" 
                       style="display: inline-block; background-color: #482f92; color: #ffffff; padding: 10px 30px; text-decoration: none; border-radius: 4px; font-size: 14px;">View</a>
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
};

module.exports = emailTemplates;
