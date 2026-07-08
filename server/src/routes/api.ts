import { Router } from 'express';
import { LeadService } from '../services/LeadService';
import { prisma } from '../prisma';

const router = Router();

router.post('/leads', async (req, res) => {
  try {
    const lead = await LeadService.createLead(req.body);
    res.status(201).json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Routes (Would normally be protected by auth middleware)
router.get('/admin/stats', async (req, res) => {
  try {
    const totalVisitors = await prisma.visitor.count();
    const totalLeads = await prisma.lead.count();
    const cookieAcceptance = await prisma.cookieConsent.count({ where: { analytics: true } });
    
    res.json({
      success: true,
      data: {
        totalVisitors,
        totalLeads,
        cookieAcceptance,
        conversionRate: totalVisitors > 0 ? (totalLeads / totalVisitors) * 100 : 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ success: true, data: leads });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
