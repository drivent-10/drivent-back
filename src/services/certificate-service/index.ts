import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventsService from "@/services/events-service";
import dayjs from "dayjs";
async function getCertificationData(userId: number) {
  const isActive = await eventsService.isCurrentEventActive();
  if (isActive) {
    throw notFoundError();
  }
  const [{ title, startsAt, endsAt }, { name, cpf, Ticket: [{ TicketType: { name: ticketTypeName }, status }] }] = await Promise.all([eventsService.getFirstEvent(), enrollmentRepository.findWithTicketTypeByUserId(userId)]);
  if (status !=="PAID") {
    throw notFoundError();
  }
  const certificationData =  { ticketTypeName, name, cpf, title, startsAt: dayjs(startsAt).format("DD/MM/YYYY"), endsAt: dayjs(endsAt).format("DD/MM/YYYY")  };
  
  return certificationData;
}
const certificateService = {
  getCertificationData,
};

export default certificateService;
