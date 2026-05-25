import express, { type Application, type Request, type Response } from "express"
import { authRoute } from "./modules/auth/auth.route";




const app : Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))


app.use('/api/auth',authRoute)


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Devpulse",
  });
});

export default app; 

