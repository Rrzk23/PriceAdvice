import mongoose from 'mongoose';
import app  from './app';


// Load environment variables
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Function to start the server
export const startServer = async (): Promise<void>=> {
  mongoose.connect(process.env.DB_URL!).then( () => {
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
