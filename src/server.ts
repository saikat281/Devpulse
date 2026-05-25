import express, { type Application, type Request, type Response } from "express"
import config from "./config"
import { Pool } from "pg"
// import {Pool, pool} from "pg"
const app : Application = express()
const port = config.port

app.use(express.json())
// app.use(express.text())
// app.use(express.urlencoded({extended:true}))


const pool = new Pool({
    connectionString: config.connection_string
})

const initDB = async()=>{
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(40) UNIQUE NOT NULL,
        password VARCHAR(40) NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

        )
        `)  
         console.log("Database connected successfully")
    } catch (error) {
        console.log(error)
    }
   
}
initDB()

app.get('/', (req : Request, res:Response)  => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})