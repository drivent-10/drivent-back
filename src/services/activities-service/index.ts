import activitiesRepository from "@/repositories/activities-repository"
import { Activities } from "@prisma/client"
import getMinute from "@/utils/activities-utils";
import hotelService from "../hotels-service";
import ticketService from "../tickets-service";
import { conflictError, notFoundError, paymentRequiredError } from "../../errors";

type NewActivities = Activities & { activityTime: number; available: number; }
type ActivitiesOrganized = {
    mainAuditorium: NewActivities[],
    sideAuditorium: NewActivities[],
    workShop: NewActivities[],
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
        if(o.local === "Auditório Principal") activitiesOrganized.mainAuditorium.push({...o, activityTime: Number(o.endsAt.getHours()) - Number(o.startsAt.getHours()) + getMinute(o.endsAt), available:o.capacity - o._count.ticket})
        else if(o.local === "Auditório Lateral") activitiesOrganized.sideAuditorium.push({...o, activityTime: Number(o.endsAt.getHours()) - Number(o.startsAt.getHours()) + getMinute(o.endsAt), available:o.capacity - o._count.ticket })
        else activitiesOrganized.workShop.push({...o, activityTime: Number(o.endsAt.getHours()) - Number(o.startsAt.getHours()) + getMinute(o.endsAt), available:o.capacity - o._count.ticket })
    })
    const userTicket = await hotelService.listHotels(userId)
    const UserActivity = await activitiesRepository.getUserActivity(userTicket.id)
    UserActivity.forEach(o =>{
        activitiesOrganized.userActivities.push(o.id)
    })
    return activitiesOrganized
}
async function createUserActivity(userId:number, activityId: number){
    const ticket = await ticketService.getTicketByUserId(userId);
    const activity = await activitiesRepository.getActivityById(activityId);
    if (!ticket || !activity) {
        throw notFoundError();
    }
    if (ticket.status !== 'PAID') {
        throw paymentRequiredError();
    }
    if (activity.capacity <= activity.ticket.length) {
        throw conflictError('Activity is already fully occupied');
    }
    return await activitiesRepository.createUserActivity(activityId, ticket.id);
}

const activitiesService = {
    getActivities,
    createUserActivity
}

export default activitiesService