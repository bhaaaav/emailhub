import { Router } from 'express';
import { EmailController } from '../controllers/emailController';
import { authenticateToken } from '../middleware/auth';
import { validateEmail } from '../middleware/validation';

const router = Router();

// All email routes require authentication
router.use(authenticateToken);

// Email management routes
router.post('/send', validateEmail, EmailController.sendEmail);
router.get('/', EmailController.getEmails);
router.get('/stats', EmailController.getEmailStats);
router.get('/:id', EmailController.getEmailById);

// AI and analysis routes
router.post('/score', EmailController.calculateSpamScore);
router.post('/refine', EmailController.refineEmail);

export default router;
