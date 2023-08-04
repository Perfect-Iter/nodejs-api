import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

//dependancies
app.use(cors({
    credentials: true,
}))

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

//router
app.use('/', router())

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server listening on localhost:8080')
});

const MONGO_URL = 'mongodb://ruben:DxQ88ApW3B4Dgw22@ac-alt6jva-shard-00-00.tbiq9lz.mongodb.net:27017,ac-alt6jva-shard-00-01.tbiq9lz.mongodb.net:27017,ac-alt6jva-shard-00-02.tbiq9lz.mongodb.net:27017/?ssl=true&replicaSet=atlas-jodosl-shard-0&authSource=admin&retryWrites=true&w=majority'

//mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => {
    console.log(error)
})
