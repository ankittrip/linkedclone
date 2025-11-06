import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js'; 
import uploadRoutes from './routes/upload.routes.js';


dotenv.config();

const app = express();


app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);



app.get('/', (req, res) => {
  res.send('LinkedClone API is running:)');
});


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
