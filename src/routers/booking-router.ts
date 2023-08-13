import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, listBooking, changeBooking, bookingInfo } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/info', bookingInfo)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
