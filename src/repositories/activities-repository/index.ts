import { prisma } from "@/config"
import { Ticket } from "@prisma/client"

async function getActivities() {
    return await prisma.activities.findMany({
        include: {
            _count: {
                select: {
                    ticket: true
                }
            }
        },
        orderBy: {
            id: 'asc'
        }
    })
}
async function getUserActivity(userTicket: number) {
    return await prisma.activities.findMany({
        select: {
            id: true
        },
        where: {
            ticket: {
                some: {
                    id: userTicket
                }
            }
        }
    })
}
async function createUserActivity(activityId: number, ticketId: number) {
    return await prisma.activities.update({
        where: { id: activityId },
        data: {
            ticket: {
                connect: { id: ticketId },
            },
        },
    });
}
async function getActivityById(activityId: number) {
    return await prisma.activities.findUnique({
        where: { id: activityId },
        include: { ticket: true },
      });
}
async function getUserActivities(ticketId: number) {
    return await prisma.activities.findMany({
        where: {
            ticket: {
                some: {
                    id: ticketId
                }
            }
        }
    });
}
const activitiesRepository = {
    getActivities,
    getUserActivity,
    createUserActivity,
    getActivityById,
    getUserActivities
}

export default activitiesRepository