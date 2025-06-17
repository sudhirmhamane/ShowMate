import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

await connectDb();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


// api routes
app.get('/', (req,res)=>
    res.send('server is Live')
);

app.use('/api/inngest',serve({ client: inngest, functions }));

app.listen(port,() => console.log(`server listen at http://localhost:${port}`));