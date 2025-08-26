import { Router } from "express";
import { initiateConnection, getConnectionStatus } from "../controllers/composio.controller.js";

const router = Router();

router.post("/api/composio/connect", initiateConnection);
router.get("/api/composio/status", getConnectionStatus);

export default router;