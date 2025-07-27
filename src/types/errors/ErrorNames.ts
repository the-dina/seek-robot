export const ErrorNames = {
  INVALID_ARGUMENT: "InvalidArgumentError",
} as const;

export type ErrorName = (typeof ErrorNames)[keyof typeof ErrorNames];
