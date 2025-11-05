import express from 'express';
import e, {Application, Request, Response} from 'express';
import cors from 'cors';

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => { 
    res.send('Dua express backend is running');
});

app.get('/api/duas', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'ok',
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;