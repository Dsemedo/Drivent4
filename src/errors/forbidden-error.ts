import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
  return {
    name: "Forbidden",
    message: "This room is unavailable!",
  };
}
