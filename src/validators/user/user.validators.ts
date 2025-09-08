import { ZodSafeParseResult } from "zod";
import { userIdSchema, UserInput, userInputSchema } from "../../validation";

/**
 * 例外を投げる関数を限定するという意図のもと、
 * parse系関数では例外を投げず、呼び出しもとで例外処理を行う
 */

export const parseUserId = (
  id: string | undefined
): ZodSafeParseResult<{
  id: number;
}> => {
  const parsedUserIdResult = userIdSchema.safeParse({ id });
  return parsedUserIdResult;
};

export const parseUserInput = (
  input: UserInput | undefined
): ZodSafeParseResult<{
  name: string;
}> => {
  const parsedInput = userInputSchema.safeParse(input);
  return parsedInput;
};

export const parseCreateUserInput = (
  input: UserInput | undefined
): ZodSafeParseResult<{
  name: string;
}> => {
  const parsedInput = userInputSchema.safeParse(input);
  return parsedInput;
};
