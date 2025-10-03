import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { EmailModel } from '../models/Email';
import { EmailService } from '../services/emailService';
import { AIService } from '../services/aiService';

export class EmailController {
  private static emailService = new EmailService();
  private static aiService = new AIService();

  static async sendEmail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recipient, subject, body } = req.body;
      const userId = req.user!.id;

      const emailData = {
        user_id: userId,
        recipient,
        subject,
        body
      };

      const result = await this.emailService.sendEmail(emailData);

      if (result.success) {
        res.json({
          message: 'Email sent successfully',
          messageId: result.messageId,
          previewUrl: result.previewUrl
        });
      } else {
        res.status(500).json({
          error: 'Failed to send email',
          details: result.error
        });
      }
    } catch (error) {
      console.error('Send email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEmails(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const emails = await EmailModel.findByUserId(userId, limit, offset);
      const stats = await EmailModel.getStatsByUserId(userId);

      res.json({
        emails,
        pagination: {
          page,
          limit,
          total: stats.total,
          pages: Math.ceil(stats.total / limit)
        },
        stats
      });
    } catch (error) {
      console.error('Get emails error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEmailById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const email = await EmailModel.findById(parseInt(id));

      // Check if email belongs to user
      if (email.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json({ email });
    } catch (error) {
      console.error('Get email error:', error);
      if (error instanceof Error && error.message === 'Email not found') {
        res.status(404).json({ error: 'Email not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async calculateSpamScore(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subject, body } = req.body;
      const spamScore = await this.emailService.calculateSpamScore(subject, body);

      res.json({
        spamScore,
        riskLevel: spamScore > 0.7 ? 'high' : spamScore > 0.4 ? 'medium' : 'low',
        suggestions: this.getSpamScoreSuggestions(spamScore)
      });
    } catch (error) {
      console.error('Spam score calculation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async refineEmail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subject, body } = req.body;
      const result = await this.aiService.refineEmail(subject, body);

      if (result.success) {
        res.json({
          refinedSubject: result.refinedSubject,
          refinedBody: result.refinedBody,
          suggestions: result.suggestions,
          aiAvailable: await this.aiService.isAvailable()
        });
      } else {
        res.status(500).json({
          error: 'Failed to refine email',
          details: result.error
        });
      }
    } catch (error) {
      console.error('Email refinement error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEmailStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const stats = await EmailModel.getStatsByUserId(userId);

      res.json({
        stats: {
          total_emails: stats.total,
          delivered_emails: stats.delivered,
          spam_emails: stats.spam_count,
          average_spam_score: stats.avg_spam_score,
          delivery_rate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
          spam_rate: stats.total > 0 ? (stats.spam_count / stats.total) * 100 : 0
        }
      });
    } catch (error) {
      console.error('Get email stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private static getSpamScoreSuggestions(spamScore: number): string[] {
    const suggestions: string[] = [];

    if (spamScore > 0.7) {
      suggestions.push('High spam risk detected');
      suggestions.push('Consider removing promotional language');
      suggestions.push('Avoid excessive capitalization');
      suggestions.push('Remove multiple exclamation marks');
    } else if (spamScore > 0.4) {
      suggestions.push('Medium spam risk detected');
      suggestions.push('Consider toning down promotional language');
      suggestions.push('Check for excessive punctuation');
    } else {
      suggestions.push('Low spam risk - email looks good');
    }

    return suggestions;
  }
}
