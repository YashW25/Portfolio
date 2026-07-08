import 'dotenv/config';

interface WhatsAppPayload {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  ip?: string;
  country?: string;
  city?: string;
  browser?: string;
  device?: string;
  page?: string;
  referrer?: string;
  timestamp: string;
}

export class WhatsAppService {
  private static API_URL = process.env.OPENWA_API_URL || 'https://openwa-refj.onrender.com';
  private static SESSION_ID = process.env.OPENWA_SESSION_ID || '16b913e6-074a-4332-987d-dcd78501e39b';
  private static API_KEY = process.env.OPENWA_API_KEY || 'owa_k1_ca0fe81ad07a13437b7299cf6415b352cd4bf75e98114727acc0d99790e1c140';
  private static TARGET_NUMBER = process.env.WHATSAPP_NUMBER || '9561485909';

  static async sendLeadNotification(data: WhatsAppPayload): Promise<boolean> {
    const text = `━━━━━━━━━━━━━━━━━━━━━━━
🚀 New Website Lead

Name:
${data.name}

Phone:
${data.phone || 'N/A'}

Email:
${data.email || 'N/A'}

Message:
${data.message || 'N/A'}

IP:
${data.ip || 'N/A'}

Location:
${data.country || 'Unknown'}, ${data.city || 'Unknown'}

Browser:
${data.browser || 'N/A'}

Device:
${data.device || 'N/A'}

Page:
${data.page || 'N/A'}

Referrer:
${data.referrer || 'N/A'}

Submitted:
${data.timestamp}
━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      const response = await fetch(`${this.API_URL}/api/sessions/${this.SESSION_ID}/messages/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.API_KEY,
        },
        body: JSON.stringify({
          chatId: `91${this.TARGET_NUMBER}@c.us`,
          text: text
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
      return false;
    }
  }
}
