import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators.js';

const validateEnv = () => {
  if (process.env.CI === 'true') {
    console.log('Running in CI environment, skipping strict validation');
    return {
      DB_URL: 'mongodb+srv://mock:QNsZWok9HjBTYdly@cluster0.rxrjtdf.mongodb.net/cool_price_app?retryWrites=true&w=majority&appName=Cluster0',
      PORT: 3000,
      RAPIDAPI_KEY: 'mock_api_key',
      SESSION_SECRET: 'mock_session_secret',
      NODE_ENV: 'test',
    };
  }

  return cleanEnv(process.env, {
    DB_URL: str(),
    PORT: port(),
    RAPIDAPI_KEY: str(),
    SESSION_SECRET: str(),
    NODE_ENV: str(),
  });
};

export default validateEnv();