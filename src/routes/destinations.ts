import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  deleteDestination,
} from '../controllers/destinations.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', authenticate, createDestination);
router.delete('/:id', authenticate, deleteDestination);

export default router;