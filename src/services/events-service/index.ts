import redis from "@/config/redis";
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = 'currentEvent';
  const cacheEvent = await redis.get(cacheKey);
  if(cacheEvent) return JSON.parse(cacheEvent);

  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  const eventReturn = exclude(event, "createdAt", "updatedAt");
  await redis.setEx(cacheKey, 30, JSON.stringify(eventReturn));
  return eventReturn;
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
