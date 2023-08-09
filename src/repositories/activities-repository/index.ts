import { prisma } from "@/config"
import { Ticket } from "@prisma/client"

async function getActivities() {
    return await prisma.activities.findMany()
}
async function getUserActivity(userTicket:number) {
    return await prisma.activities.findMany({
        select:{
            id: true
        },
        where:{
            ticket: {
                some:{
                    id:userTicket
                }
            }
        }
    })
}
const activitiesRepository = {
    getActivities,
    getUserActivity
}

export default activitiesRepository