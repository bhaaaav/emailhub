import React, { useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import { useEmail } from '../contexts/EmailContext';
import { useAuth } from '../contexts/AuthContext';
import EmailForm from '../components/EmailForm';
import EmailTable from '../components/EmailTable';
import {
  Email,
  TrendingUp,
  Security,
  Send
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, fetchEmails } = useEmail();

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to EmailHub, {user?.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your emails with AI-powered spam detection and refinement.
        </Typography>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.total_emails}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Emails
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.delivery_rate.toFixed(1)}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security color="warning" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.spam_rate.toFixed(1)}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Spam Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Send color="info" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6">{stats.delivered_emails}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivered
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Email Form */}
      <EmailForm />

      {/* Email Table */}
      <EmailTable />
    </Container>
  );
};

export default Dashboard;
