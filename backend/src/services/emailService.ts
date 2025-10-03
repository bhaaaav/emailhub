import nodemailer from 'nodemailer';
import { EmailModel, CreateEmailData } from '../models/Email';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(emailData: CreateEmailData): Promise<EmailResult> {
    try {
      // Create email record in database
      const email = await EmailModel.create(emailData);

      // Calculate spam score
      const spamScore = await this.calculateSpamScore(emailData.subject, emailData.body);
      await EmailModel.updateSpamScore(email.id, spamScore);

      // Send email
      const mailOptions = {
        from: `"EmailHub" <${process.env.SMTP_USER}>`,
        to: emailData.recipient,
        subject: emailData.subject,
        text: emailData.body,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>${emailData.subject}</h2>
          <div style="white-space: pre-wrap;">${emailData.body}</div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Sent via EmailHub | Spam Score: ${(spamScore * 100).toFixed(1)}%
          </p>
        </div>`
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Update delivery status
      await EmailModel.updateDeliveryStatus(email.id, true);

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info) || undefined
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async calculateSpamScore(subject: string, body: string): Promise<number> {
    const spamWords = [
      'free', 'win', 'winner', 'congratulations', 'urgent', 'act now',
      'limited time', 'click here', 'buy now', 'discount', 'offer',
      'cash', 'money', 'earn', 'income', 'profit', 'investment',
      'guarantee', 'risk-free', 'no obligation', 'call now'
    ];

    const text = `${subject} ${body}`.toLowerCase();
    let spamScore = 0;

    // Check for spam words
    spamWords.forEach(word => {
      if (text.includes(word)) {
        spamScore += 0.1;
      }
    });

    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.3) {
      spamScore += 0.2;
    }

    // Check for excessive punctuation
    const punctuationRatio = (text.match(/[!]{2,}/g) || []).length;
    if (punctuationRatio > 0) {
      spamScore += 0.15;
    }

    // Check for suspicious patterns
    if (text.includes('http://') || text.includes('https://')) {
      spamScore += 0.1;
    }

    // Check for phone number patterns
    if (/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text)) {
      spamScore += 0.05;
    }

    return Math.min(spamScore, 1.0); // Cap at 1.0
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return false;
    }
  }
}
