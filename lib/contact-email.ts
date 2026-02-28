interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export function buildContactEmailHtml(data: ContactEmailData): string {
  const { name, email, message } = data;
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message — Wanderbites</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2D2A26;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color: #2D2A26; padding: 28px 32px; text-align: center;">
              <span style="font-size: 28px; line-height: 1;">🍜</span>
              <span style="font-size: 20px; font-weight: 700; color: #ffffff; margin-left: 8px; vertical-align: middle;">Wanderbites</span>
            </td>
          </tr>

          <!-- Title Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #C75B39, #A84832); padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.3px;">
                ✉️ New Contact Message
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">

              <!-- Sender Info -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #FAF8F5; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #9B8E82; margin-bottom: 4px;">From</span>
                          <span style="font-size: 16px; font-weight: 600; color: #2D2A26;">${escapedName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #9B8E82; margin-bottom: 4px;">Email</span>
                          <a href="mailto:${escapedEmail}" style="font-size: 15px; color: #C75B39; text-decoration: none; font-weight: 500;">${escapedEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="margin-bottom: 8px;">
                <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #9B8E82; margin-bottom: 8px;">Message</span>
                <div style="font-size: 15px; line-height: 1.7; color: #4A4543; border-left: 3px solid #C75B39; padding-left: 16px;">
                  ${escapedMessage}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #2D2A26; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9B8E82;">
                This message was sent via the Wanderbites contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}