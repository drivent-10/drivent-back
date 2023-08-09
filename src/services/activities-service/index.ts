import activitiesRepository from "@/repositories/activities-repository"
import { Activities } from "@prisma/client"


type ActivitiesOrganized = {
    mainAuditorium: Activities[],
    sideAuditorium: Activities[],
    workShop: Activities[]
}
async function getActivities(userId:number) {
    const activities = await activitiesRepository.getActivities()
    const activitiesOrganized: ActivitiesOrganized= {
        mainAuditorium: [],
        sideAuditorium: [],
        workShop: []
    }
    activities.forEach(o =>{
        if(o.local === "Auditório Principal") activitiesOrganized.mainAuditorium.push(o)
        else if(o.local === "Auditório Lateral") activitiesOrganized.sideAuditorium.push(o)
        else activitiesOrganized.workShop.push(o)
    })
    return activitiesOrganized
}

const activitiesService = {
    getActivities
}

export default activitiesService