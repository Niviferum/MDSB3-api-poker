import {Request} from "express";

export interface IJWTRequest extends Request{
    user: any
}