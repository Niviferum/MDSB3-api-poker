import {Request} from "express";

export interface JWTPayload {
  userId: string;
  username?: string;
}

export interface IJWTRequest extends Request {
  user: JWTPayload; // ← Au lieu de `any`
}