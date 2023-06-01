import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as fs from 'fs';
import data from './database/data.json'

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is started')
});

const listAll = (req: Request, res: Response) => {
  try {
    const {page, pageSize} = req.query
    if(!page || !pageSize) return res.send({ message: "page or pageSize is not founded"})

    const fromIndex = Number(page) * Number(pageSize)
    const toIndex = (Number(page) + 1) * Number(pageSize)

    res.send(data.slice(fromIndex, toIndex));
  } catch (err) {
    console.log(err)
    res.send([])
  }
}

app.get('/api/todos', listAll)

const createTask = (req: Request, res: Response) => {
  try {
    const newItem = req.body

    data.push(newItem)

    fs.writeFileSync('src/database/data.json', JSON.stringify(data))
    res.send(true)
  } catch (err) {
    console.log(err)
    res.send(false)
  }
}

app.post('/api/todos', createTask)

const updateTask = (req: Request, res: Response) => {
  try {
    const payload = req.body
    const { id } = req.params

    const updatedItem = data.findIndex((item) => item.id.toString() === id)
    if (updatedItem === -1) {
      return res.send(false)
    }

    data[updatedItem] = Object.assign(data[updatedItem], payload)

    fs.writeFileSync('src/database/data.json', JSON.stringify(data))

    res.send(true)
  } catch (err) {
    console.log(err)
    res.send(false)
  }
}

app.patch('/api/todos/:id', updateTask)


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
