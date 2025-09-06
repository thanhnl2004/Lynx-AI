import { Router } from "express";
import composioController from "../controllers/composio.controller.js";

const router = Router();

router.post("/api/composio/connect", composioController.initiateConnection);
router.get("/api/composio/status", composioController.checkConnectionStatus);
router.delete("/api/composio/delete", composioController.deleteConnection);

export default router;