import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const cors = require('cors');
import { userRouter } from './user';
import { linkRouter } from './link';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

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
    AppDataSource.initialize()
        .then(async () => {
            console.log("Data Source init!")
            console.log("Inserting a new user into the database...")
            const user = new User()
            user.firstName = "Timber"
            user.lastName = "Saw"
            user.age = 25
            await AppDataSource.manager.save(user)
            console.log("Saved a new user with id: " + user.id)

            console.log("Loading users from the database...")
            const users = await AppDataSource.manager.find(User)
            console.log("Loaded users: ", users)

            console.log("Here you can setup and run express / fastify / any other framework.")

        })
        .catch(err => {
            console.log(err)
        })
})
