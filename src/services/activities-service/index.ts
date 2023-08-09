import activitiesRepository from "@/repositories/activities-repository"
import { Activities } from "@prisma/client"
import ticketService from "../tickets-service"


type ActivitiesOrganized = {
    mainAuditorium: Activities[],
    sideAuditorium: Activities[],
    workShop: Activities[],
    userActivities: number[],
}
async function getActivities(userId:number) {
    const activities = await activitiesRepository.getActivities()
    const activitiesOrganized: ActivitiesOrganized= {
        mainAuditorium: [],
        sideAuditorium: [],
        workShop: [],
        userActivities: []
    }
    activities.forEach(o =>{
        if(o.local === "Auditório Principal") activitiesOrganized.mainAuditorium.push(o)
        else if(o.local === "Auditório Lateral") activitiesOrganized.sideAuditorium.push(o)
        else activitiesOrganized.workShop.push(o)
    })
    const userTicket = await ticketService.getTicketByUserId(userId)
    const UserActivity = await activitiesRepository.getUserActivity(userTicket.id)
    UserActivity.forEach(o =>{
        activitiesOrganized.userActivities.push(o.id)
    })
    return activitiesOrganized
}

const activitiesService = {
    getActivities
}

export default activitiesService