import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the onboarding process
  app.get('/api/industry-options', (req, res) => {
    const industries = [
      { value: 'tech', label: 'Software & Technology' },
      { value: 'finance', label: 'Finance & Banking' },
      { value: 'healthcare', label: 'Healthcare & Medical' },
      { value: 'education', label: 'Education' },
      { value: 'retail', label: 'Retail & E-commerce' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'marketing', label: 'Marketing & Advertising' },
      { value: 'hospitality', label: 'Hospitality & Tourism' },
      { value: 'entertainment', label: 'Entertainment & Media' },
      { value: 'nonprofit', label: 'Nonprofit & NGO' },
      { value: 'other', label: 'Other' }
    ];
    
    res.json(industries);
  });

  // Mock endpoint for email verification
  app.post('/api/send-verification', (req, res) => {
    const { email } = req.body;
    
    // Simulate email sending
    // In a real app, this would send an actual email with a verification code
    
    res.json({ success: true, message: `Verification code sent to ${email}` });
  });

  // Mock endpoint for verifying code
  app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    
    // Always accept 123456 as a valid code for testing
    const isValid = code === '123456';
    
    res.json({ success: isValid });
  });

  // Mock endpoint for submitting the completed onboarding form
  app.post('/api/submit-onboarding', (req, res) => {
    // In a real app, would process the form data, save files, etc.
    res.json({ success: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
