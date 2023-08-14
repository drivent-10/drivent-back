import { cannotBookingError, notFoundError } from '@/errors';
import roomRepository from '@/repositories/room-repository';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import tikectRepository from '@/repositories/ticket-repository';
import hotelRepository from '@/repositories/hotel-repository';

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookingError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(roomId: number) {
  const room = await roomRepository.findById(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= bookings.length) {
    throw cannotBookingError();
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function bookingRoomById(userId: number, roomId: number) {
  await checkEnrollmentTicket(userId);
  await checkValidBooking(roomId);

  return bookingRepository.create({ roomId, userId });
}

async function changeBookingRoomById(userId: number, roomId: number) {
  await checkValidBooking(roomId);
  const booking = await bookingRepository.findByUserId(userId);

  if (!booking || booking.userId !== userId) {
    throw cannotBookingError();
  }

  return bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
    userId,
  });
}

function getRoomSize(capacity: number) {
  if (capacity === 1) return 'Single';
  if (capacity === 2) return 'Double';
  return 'Triple';
}

function getRoomMessage(capacity: number, availability: number) {
  // TODO:  can't figure out the correct logic for capacity and availability!
  const diff = capacity - availability;
  return diff === 1 ? 'Somente você' : `Você e mais ${diff}`;
}

async function bookingInfo(userId: number) {
  const booking = await getBooking(userId);
  const room = await roomRepository.findById(booking.Room.id);
  const bookings = await bookingRepository.findByRoomId(booking.Room.id);
  const hotel = await hotelRepository.findHotelData(room.hotelId);

  return {
    hotelName: hotel.name,
    hotelImage: hotel.image,
    roomNumber: room.name,
    roomSize: getRoomSize(room.capacity),
    roomMessage: getRoomMessage(room.capacity, bookings.length),
  };
}

const bookingService = {
  bookingRoomById,
  getBooking,
  changeBookingRoomById,
  bookingInfo,
};

export default bookingService;
