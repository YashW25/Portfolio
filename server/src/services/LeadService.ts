import { prisma } from '../prisma';
import { WhatsAppService } from './WhatsAppService';
import { NotificationService } from './NotificationService';

export class LeadService {
  static async createLead(data: {
    visitorId?: string;
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    page?: string;
    ip?: string;
    country?: string;
    city?: string;
    browser?: string;
    device?: string;
    referrer?: string;
  }) {
    // 1. Create Lead in DB
    const lead = await prisma.lead.create({
      data: {
        visitorId: data.visitorId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        page: data.page,
        messages: data.message ? {
          create: {
            message: data.message
          }
        } : undefined
      },
      include: {
        messages: true
      }
    });

    // 2. Format WhatsApp Payload
    const whatsappPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      ip: data.ip,
      country: data.country,
      city: data.city,
      browser: data.browser,
      device: data.device,
      page: data.page,
      referrer: data.referrer,
      timestamp: new Date().toISOString()
    };

    // 3. Send Notification via NotificationService (which handles retries/logging)
    await NotificationService.sendWhatsApp(lead.id, whatsappPayload);

    return lead;
  }
}
