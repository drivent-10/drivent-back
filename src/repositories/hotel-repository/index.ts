import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelData(hotelId: number) {
  const { name, image } = await prisma.hotel.findUnique({ where: { id: hotelId } });
  return { name, image };
}

async function findHotel(hotelId: number) {
  const hotelRooms = await prisma.room.aggregate({
    _sum: {
      capacity: true,
    },
    where: {
      hotelId,
    },
  });
  return hotelRooms._sum.capacity;
}

async function findBooking(hotelId: number) {
  return prisma.room.findMany({
    include: {
      _count: {
        select: {
          Booking: true,
        },
      },
    },
    where: {
      hotelId,
    },
    orderBy: { id: 'asc' },
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findHotels,
  findHotel,
  findRoomsByHotelId,
  findBooking,
  findHotelData,
};

export default hotelRepository;
