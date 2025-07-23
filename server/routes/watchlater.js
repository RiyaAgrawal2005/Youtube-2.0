import express from "express"
import { handlewatchlater, getallwatchlater } from "../controllers/watchlater.js"

const routes = express.Router()
routes.get("/:userId", getallwatchlater)
routes.post("/:videoId", handlewatchlater)
export default routes