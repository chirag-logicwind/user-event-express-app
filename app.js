import express from 'express';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import appRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import { sequelize } from './models/index.js';
 
dotenv.config();
const app = express();
app.use(express.json());

// error handling...
app.use((req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    next();
});

app.use('/api/auth', appRoutes);
app.use('/api/events', eventRoutes);

await sequelize.sync();

export default app;