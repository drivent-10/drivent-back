import { PrismaClient, Room } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
  const ticketType = await prisma.ticketType.findFirst();
  if (!ticketType) {
    // language=SQL format=false
    await prisma.$queryRaw`
        INSERT INTO "TicketType" (name, price, "isRemote", "includesHotel", "createdAt", "updatedAt")
        VALUES ('Online', 100, true, false, NOW(), NOW()),
              ('Presencial', 250, false, false, NOW(), NOW()),
              ('Presencial', 600, false, true, NOW(), NOW());
    `;
  }

  const findHotel = await prisma.hotel.findFirst();
  if (!findHotel) {
    const hotel1 = await prisma.hotel.create({
      data: {
        name: 'Hotel 1',
        image:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRO8qRkar6F2JPBN5wtwWzV1nQ9ImwTVQ9EUkPAB4j9KrxZTexN',
      },
    });

    const hotel2 = await prisma.hotel.create({
      data: {
        name: 'Hotel 2',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9gmTInrhcZeavIcTtRLst2nlLdbo4W0phtrzp3NDvzETfKwI9',
      },
    });

    const hotel3 = await prisma.hotel.create({
      data: {
        name: 'Hotel 3',
        image:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSRWERh24IrYDll3HAw_YvRwupr_G9mRIRHj3DfN-Iw_dj2aC-A',
      },
    });

    await createRandomRooms(hotel1.id, 20);
    await createRandomRooms(hotel2.id, 20);
    await createRandomRooms(hotel3.id, 20);

    async function createRandomRooms(hotelId: number, numberOfRooms: number) {
      const rooms: Room[] = [];
      for (let i = 0; i < numberOfRooms; i++) {
        const room = await prisma.room.create({
          data: {
            name: `Quarto ${i + 1}`,
            capacity: Math.floor(Math.random() * 3) + 1,
            hotelId: hotelId,
          },
        });
        rooms.push(room);
      }
      return rooms;
    }
    await prisma.booking.createMany({
      data: [
        { userId: 1, roomId: 20 },
        { userId: 1, roomId: 16 },
        { userId: 1, roomId: 10 },
        { userId: 1, roomId: 7 },
        { userId: 1, roomId: 14 },
        { userId: 1, roomId: 16 },
        { userId: 1, roomId: 34 },
        { userId: 1, roomId: 34 },
        { userId: 1, roomId: 34 },
        { userId: 1, roomId: 56 },
        { userId: 1, roomId: 45 },
        { userId: 1, roomId: 46 },
        { userId: 1, roomId: 37 },
        { userId: 1, roomId: 34 },
        { userId: 1, roomId: 12 },
        { userId: 1, roomId: 55 },
        { userId: 1, roomId: 32 },
        { userId: 1, roomId: 20 },
        { userId: 1, roomId: 19 },
        { userId: 1, roomId: 28 },
        { userId: 1, roomId: 28 },
      ],
    });
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
