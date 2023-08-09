import { prisma } from "@/config"

export async function getActivities() {
    return await prisma.activities.findMany()
}

const activitiesRepository = {
    getActivities
}

export default activitiesRepository