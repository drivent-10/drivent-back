import { ApplicationError } from "@/protocols";

export function cannotListHotelsError(error:string): ApplicationError {
  return {
    name: "cannotListHotelsError",
    message: "Cannot list hotels!",
    type: error,
  };
}
