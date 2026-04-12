import express, {Request,Response} from 'express';
import { registerRoutes } from './routes';
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(express.json());
registerRoutes(app);

app.get('/', (req:Request, res:Response) => {
    res.send("APIs running");
});


app.listen(3000, () => {
    console.log("Server running on port 3000")
});
