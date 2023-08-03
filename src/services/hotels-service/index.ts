import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { Hotel } from "@prisma/client";
import roomRepository from "@/repositories/room-repository";
import createText from "@/utils/hotels-utils";
import { exclude } from "@/utils/prisma-utils";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}
type HotelsWithRooms = Hotel & { availability?:number , accommodationType?:string}
async function getHotels(userId: number) {
  await listHotels(userId);
  const hotels:HotelsWithRooms[] = await hotelRepository.findHotels();
  await Promise.all(
    hotels.map(async (o, i) => {
      const bookings = await hotelRepository.findBooking(o.id)
      hotels[i].availability = await hotelRepository.findHotel(o.id) - bookings.reduce((acc, { _count: { Booking: booking } }) => acc + booking, 0)
      const roomsCapacity = await roomRepository.findAllByHotelId(o.id)
      const single = roomsCapacity.some((o,i)=>o.capacity===1)
      const double = roomsCapacity.some((o,i)=>o.capacity===2)
      const triple = roomsCapacity.some((o,i)=>o.capacity===3)
      const newArray:string[] = []
      if(single) newArray.push("Single")
      if(double) newArray.push("Double")
      if(triple) newArray.push("Triple")
      hotels[i].accommodationType = createText(newArray)
      //exclude(hotels[i], "createdAt", "updatedAt")
    })
  )
  return hotels
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
