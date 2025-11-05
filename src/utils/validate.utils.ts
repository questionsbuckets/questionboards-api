import { type } from "arktype";

export const pageValidate = type("number.integer >= 0");
export const limitValidate = type("number.integer >= 0");
export const mongoIdValidate = /^[a-f\d]{24}$/i;
