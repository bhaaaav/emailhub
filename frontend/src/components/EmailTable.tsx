import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useEmail } from '../contexts/EmailContext';

const EmailTable: React.FC = () => {
  const { emails, stats, loading, fetchEmails } = useEmail();
  const [page, setPage] = useState(1);
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchEmails();
  };

  const getSpamScoreColor = (score: number) => {
    if (score > 0.7) return 'error';
    if (score > 0.4) return 'warning';
    return 'success';
  };

  const getSpamScoreLabel = (score: number) => {
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading emails...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📬 Email History
      </Typography>

      {stats && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`Total: ${stats.total_emails}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Delivered: ${stats.delivered_emails}`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`Spam: ${stats.spam_emails}`}
            color="error"
            variant="outlined"
          />
          <Chip
            label={`Delivery Rate: ${stats.delivery_rate.toFixed(1)}%`}
            color="info"
            variant="outlined"
          />
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Spam Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => (
              <React.Fragment key={email.id}>
                <TableRow>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{truncateText(email.subject)}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${(email.spam_score * 100).toFixed(1)}%`}
                      color={getSpamScoreColor(email.spam_score)}
                      size="small"
                    />
                    <Typography variant="caption" display="block">
                      {getSpamScoreLabel(email.spam_score)} Risk
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {email.delivered ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Delivered"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<Cancel />}
                        label="Failed"
                        color="error"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(email.created_at)}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => setExpandedEmail(
                          expandedEmail === email.id ? null : email.id
                        )}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {expandedEmail === email.id && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" gutterBottom>
                          Email Details
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Subject: {email.subject}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Recipient: {email.recipient}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Sent: {email.sent_at ? formatDate(email.sent_at) : 'Not sent'}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Body:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            p: 2,
                            bgcolor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: 1
                          }}
                        >
                          {email.body}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {emails.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No emails found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by composing your first email!
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil((stats?.total_emails || 0) / 20)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Paper>
  );
};

export default EmailTable;
