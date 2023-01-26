import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const cors = require('cors');
import { userRouter } from './user';
import { linkRouter } from './link';

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000;

const corsOptions = {
    methods: ['GET', 'PUT', 'PORT'],
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'API_KEY'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
//app.use(bodyParser)
app.use('/api', userRouter)
app.use('/api', linkRouter)

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})
