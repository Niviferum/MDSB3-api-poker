import { config } from 'dotenv';
config();
export const jwtConstants = {
  secret: process.env.SECRET_KEY // use the SECRET_KEY from environment variables
};
