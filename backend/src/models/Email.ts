import pool from '../config/database';

export interface Email {
  id: number;
  user_id: number;
  recipient: string;
  subject: string;
  body: string;
  spam_score: number;
  delivered: boolean;
  sent_at: Date | null;
  created_at: Date;
}

export interface CreateEmailData {
  user_id: number;
  recipient: string;
  subject: string;
  body: string;
  spam_score?: number;
  delivered?: boolean;
}

export interface EmailWithUser extends Email {
  user_email: string;
}

export class EmailModel {
  static async create(emailData: CreateEmailData): Promise<Email> {
    const { user_id, recipient, subject, body, spam_score = 0, delivered = false } = emailData;
    
    const [result] = await pool.execute(
      'INSERT INTO emails (user_id, recipient, subject, body, spam_score, delivered) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, recipient, subject, body, spam_score, delivered]
    );
    
    const insertId = (result as any).insertId;
    return this.findById(insertId);
  }

  static async findById(id: number): Promise<Email> {
    const [rows] = await pool.execute(
      'SELECT * FROM emails WHERE id = ?',
      [id]
    );
    
    const emails = rows as Email[];
    if (emails.length === 0) {
      throw new Error('Email not found');
    }
    
    return emails[0];
  }

  static async findByUserId(userId: number, limit: number = 50, offset: number = 0): Promise<Email[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM emails WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    
    return rows as Email[];
  }

  static async updateDeliveryStatus(id: number, delivered: boolean): Promise<void> {
    await pool.execute(
      'UPDATE emails SET delivered = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
      [delivered, id]
    );
  }

  static async updateSpamScore(id: number, spamScore: number): Promise<void> {
    await pool.execute(
      'UPDATE emails SET spam_score = ? WHERE id = ?',
      [spamScore, id]
    );
  }

  static async getAllWithUsers(limit: number = 50, offset: number = 0): Promise<EmailWithUser[]> {
    const [rows] = await pool.execute(`
      SELECT e.*, u.email as user_email 
      FROM emails e 
      JOIN users u ON e.user_id = u.id 
      ORDER BY e.created_at DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return rows as EmailWithUser[];
  }

  static async getStatsByUserId(userId: number): Promise<{
    total: number;
    delivered: number;
    spam_count: number;
    avg_spam_score: number;
  }> {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN delivered = 1 THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN spam_score > 0.5 THEN 1 ELSE 0 END) as spam_count,
        AVG(spam_score) as avg_spam_score
      FROM emails 
      WHERE user_id = ?
    `, [userId]);
    
    const stats = (rows as any[])[0];
    return {
      total: stats.total || 0,
      delivered: stats.delivered || 0,
      spam_count: stats.spam_count || 0,
      avg_spam_score: parseFloat(stats.avg_spam_score) || 0
    };
  }
}
