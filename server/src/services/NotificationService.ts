import { prisma } from '../prisma';
import { WhatsAppService } from './WhatsAppService';

export class NotificationService {
  static async sendWhatsApp(leadId: string, payload: any) {
    // 1. Create a Pending Notification record
    const notification = await prisma.notification.create({
      data: {
        leadId,
        type: 'WHATSAPP',
        status: 'PENDING'
      }
    });

    try {
      // 2. Attempt to send
      const success = await WhatsAppService.sendLeadNotification(payload);
      
      if (success) {
        await prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'SUCCESS' }
        });
      } else {
        throw new Error('WhatsApp API returned false');
      }
    } catch (error: any) {
      // 3. Log failure and increment retry count
      await prisma.notification.update({
        where: { id: notification.id },
        data: { 
          status: 'FAILED',
          errorLog: error.message,
          retryCount: { increment: 1 }
        }
      });
      
      // In a production app, we would push this to a retry queue (e.g., BullMQ)
      // For now, we will just log it.
      console.error(`Notification ${notification.id} failed.`);
    }
  }
}
