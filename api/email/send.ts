import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    // TODO: Implement actual email sending logic
    // For now, return a mock response
    res.json({
      message: 'Email sent successfully',
      id: 'mock-email-id'
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
