import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}
async function findHotel(hotelId:number) {
  const hotelRooms = await prisma.room.aggregate({
    _sum:{
      capacity:true
    },
    where:{
      hotelId
    }
  });
  return hotelRooms._sum.capacity
}
async function findBooking(hotelId:number) {
  const bookings = await prisma.room.findMany({
    select:{
      _count:{
        select:{
          Booking: true,
        },
      }
    },
    where:{
      hotelId
    }
  });
  return bookings
}
async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelRepository = {
  findHotels,
  findHotel,
  findRoomsByHotelId,
  findBooking
};

export default hotelRepository;
