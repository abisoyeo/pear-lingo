import { protectRoute, requireAdminRole } from "../auth/auth.middleware.js";
import * as adminController from "./admin.controller.js";

const router = express.Router();

router.use(protectRoute);
router.use(requireAdminRole);
router.post("/admins", adminController.createAdmin);
router.get("/users", adminController.getUsers);
router.put("/users/:id/role", adminController.changeRole);
router.put("/users/:id/suspend", adminController.suspend);
router.put("/users/:id/unsuspend", adminController.unsuspend);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/restore", adminController.restore);

export default router;
