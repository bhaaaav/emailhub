import React, { createContext, useContext, useState, ReactNode } from 'react';
import { emailAPI } from '../api/email';

interface Email {
  id: number;
  user_id: number;
  recipient: string;
  subject: string;
  body: string;
  spam_score: number;
  delivered: boolean;
  sent_at: string | null;
  created_at: string;
}

interface EmailStats {
  total_emails: number;
  delivered_emails: number;
  spam_emails: number;
  average_spam_score: number;
  delivery_rate: number;
  spam_rate: number;
}

interface EmailContextType {
  emails: Email[];
  stats: EmailStats | null;
  loading: boolean;
  fetchEmails: () => Promise<void>;
  sendEmail: (recipient: string, subject: string, body: string) => Promise<void>;
  calculateSpamScore: (subject: string, body: string) => Promise<number>;
  refineEmail: (subject: string, body: string) => Promise<{
    refinedSubject: string;
    refinedBody: string;
    suggestions: string[];
    aiAvailable: boolean;
  }>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await emailAPI.getEmails();
      setEmails(response.emails);
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (recipient: string, subject: string, body: string) => {
    try {
      await emailAPI.sendEmail(recipient, subject, body);
      // Refresh emails after sending
      await fetchEmails();
    } catch (error) {
      throw error;
    }
  };

  const calculateSpamScore = async (subject: string, body: string): Promise<number> => {
    try {
      const response = await emailAPI.calculateSpamScore(subject, body);
      return response.spamScore;
    } catch (error) {
      console.error('Failed to calculate spam score:', error);
      return 0;
    }
  };

  const refineEmail = async (subject: string, body: string) => {
    try {
      return await emailAPI.refineEmail(subject, body);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    emails,
    stats,
    loading,
    fetchEmails,
    sendEmail,
    calculateSpamScore,
    refineEmail
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};
