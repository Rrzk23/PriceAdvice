import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators.js';

export default cleanEnv(process.env, {
  DB_URL : str(),
  PORT: port(),
  RAPIDAPI_KEY: str(),
  SESSION_SECRET: str(),
  NODE_ENV: str(),
});