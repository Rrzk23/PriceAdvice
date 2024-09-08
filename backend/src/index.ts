import 'dotenv/config.js';
import mongoose from 'mongoose';
import app  from './app';
import env from './utils/validateEnv';


// Load environment variables
const PORT: number = env.PORT;

// Function to start the server
export const startServer = async (): Promise<void>=> {
  mongoose.connect(env.DB_URL!).then( () => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

  }).catch(console.error);
};

// Start the server in production environment
if (process.env.NODE_ENV !== 'test') {
  startServer().catch(console.error);
}
