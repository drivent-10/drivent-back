import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { Hotel, Room } from '@prisma/client';
import roomRepository from '@/repositories/room-repository';
import createText from '@/utils/hotels-utils';
import { exclude } from '@/utils/prisma-utils';

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED') {
    throw cannotListHotelsError("unpaid");
  }
  else if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
    throw cannotListHotelsError("unavailable");
  }
}
type HotelsWithRooms = Hotel & { availability?: number; accommodationType?: string };
async function getHotels(userId: number) {
  // FIXME: uncomment following line
  await listHotels(userId);
  const hotels: HotelsWithRooms[] = await hotelRepository.findHotels();
  await Promise.all(
    hotels.map(async (o, i) => {
      const bookings = await hotelRepository.findBooking(o.id);
      hotels[i].availability =
        (await hotelRepository.findHotel(o.id)) -
        bookings.reduce((acc, { _count: { Booking: booking } }) => acc + booking, 0);
      const roomsCapacity = await roomRepository.findAllByHotelId(o.id);
      const single = roomsCapacity.some((o, i) => o.capacity === 1);
      const double = roomsCapacity.some((o, i) => o.capacity === 2);
      const triple = roomsCapacity.some((o, i) => o.capacity === 3);
      const newArray: string[] = [];
      if (single) newArray.push('Single');
      if (double) newArray.push('Double');
      if (triple) newArray.push('Triple');
      hotels[i].accommodationType = createText(newArray);
      //exclude(hotels[i], "createdAt", "updatedAt")
    }),
  );
  return hotels;
}

type HotelRooms = (Room & { _count: { Booking: number }; availability?: number })[];
async function getHotelRooms(userId: number, hotelId: number) {
  // FIXME: uncomment following line
  await listHotels(userId);
  const rooms: HotelRooms = await hotelRepository.findBooking(hotelId);

  if (!rooms) {
    throw notFoundError();
  }

  await Promise.all(
    rooms.map(async (o) => {
      o.availability = o.capacity - o._count.Booking;
    }),
  );
  return rooms;
}

const hotelService = {
  getHotels,
  getHotelRooms,
};

export default hotelService;
