import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Send, AutoFixHigh, Security } from '@mui/icons-material';
import { useEmail } from '../contexts/EmailContext';

const EmailForm: React.FC = () => {
  const { sendEmail, calculateSpamScore, refineEmail } = useEmail();
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [spamScore, setSpamScore] = useState<number | null>(null);
  const [refinedContent, setRefinedContent] = useState<{
    subject: string;
    body: string;
    suggestions: string[];
    aiAvailable: boolean;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setSpamScore(null);
    setRefinedContent(null);
  };

  const handleSendEmail = async () => {
    if (!formData.recipient || !formData.subject || !formData.body) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await sendEmail(formData.recipient, formData.subject, formData.body);
      setMessage({ type: 'success', text: 'Email sent successfully!' });
      setFormData({ recipient: '', subject: '', body: '' });
      setSpamScore(null);
      setRefinedContent(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send email' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSpamScore = async () => {
    if (!formData.subject || !formData.body) {
      setMessage({ type: 'error', text: 'Please enter subject and body first' });
      return;
    }

    try {
      const score = await calculateSpamScore(formData.subject, formData.body);
      setSpamScore(score);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to calculate spam score' });
    }
  };

  const handleRefineEmail = async () => {
    if (!formData.subject || !formData.body) {
      setMessage({ type: 'error', text: 'Please enter subject and body first' });
      return;
    }

    try {
      const refined = await refineEmail(formData.subject, formData.body);
      setRefinedContent(refined);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to refine email' });
    }
  };

  const applyRefinedContent = () => {
    if (refinedContent) {
      setFormData(prev => ({
        ...prev,
        subject: refinedContent.subject,
        body: refinedContent.body
      }));
      setRefinedContent(null);
    }
  };

  const getSpamScoreColor = (score: number) => {
    if (score > 0.7) return 'error';
    if (score > 0.4) return 'warning';
    return 'success';
  };

  const getSpamScoreLabel = (score: number) => {
    if (score > 0.7) return 'High Risk';
    if (score > 0.4) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        📧 Compose Email
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Recipient Email"
          type="email"
          value={formData.recipient}
          onChange={handleChange('recipient')}
          fullWidth
          required
        />

        <TextField
          label="Subject"
          value={formData.subject}
          onChange={handleChange('subject')}
          fullWidth
          required
        />

        <TextField
          label="Email Body"
          multiline
          rows={6}
          value={formData.body}
          onChange={handleChange('body')}
          fullWidth
          required
        />

        {/* Spam Score Section */}
        <Accordion>
          <AccordionSummary expandIcon={<Security />}>
            <Typography>Spam Score Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCalculateSpamScore}
                startIcon={<Security />}
              >
                Calculate Spam Score
              </Button>
              
              {spamScore !== null && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Spam Score: {(spamScore * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={spamScore * 100}
                    color={getSpamScoreColor(spamScore)}
                    sx={{ mb: 1 }}
                  />
                  <Chip
                    label={getSpamScoreLabel(spamScore)}
                    color={getSpamScoreColor(spamScore)}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* AI Refinement Section */}
        <Accordion>
          <AccordionSummary expandIcon={<AutoFixHigh />}>
            <Typography>AI Email Refinement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleRefineEmail}
                startIcon={<AutoFixHigh />}
              >
                Refine with AI
              </Button>
              
              {refinedContent && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Refined Email:
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Subject:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: 'grey.100' }}>
                      {refinedContent.subject}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Body:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: 'grey.100', whiteSpace: 'pre-wrap' }}>
                      {refinedContent.body}
                    </Typography>
                  </Box>
                  
                  {refinedContent.suggestions.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Suggestions:
                      </Typography>
                      {refinedContent.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={applyRefinedContent}
                    sx={{ mr: 1 }}
                  >
                    Apply Refined Content
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setRefinedContent(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Button
          variant="contained"
          onClick={handleSendEmail}
          disabled={loading}
          startIcon={<Send />}
          size="large"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmailForm;
