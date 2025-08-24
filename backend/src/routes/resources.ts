import { Router, Request, Response } from "express";
import {
  getAllResources,
  getPendingResources,
  getUserResources,
  getResourceById,
  createResource,
  approveResource,
  rejectResource,
} from "../controllers/resourceController.js";
import {
  isSuperAdmin,
  isAdminOrSuperAdmin,
  requireAuth,
  requireRole,
} from "../middlewares/auth.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const router = Router();

// Public routes
router.get("/", getAllResources); // View approved resources (public)
router.get("/:id", getResourceById); // Get single resource details

// Admin/SuperAdmin routes
router.post("/", isAdminOrSuperAdmin, createResource); // Create resource (admin/superAdmin)
router.get(
  "/admin",
  requireAuth,
  requireRole(["admin", "superAdmin"]),
  getAllResources // Use getAllResources instead of getAllResourcesAdmin
);
router.get("/admin/mine", isAdminOrSuperAdmin, getUserResources); // See your own resources

// SuperAdmin only routes
router.get("/admin/pending", isSuperAdmin, getPendingResources); // See pending resources (superAdmin)
router.patch("/:id/approve", isSuperAdmin, approveResource); // Approve resource (superAdmin)
router.put("/:id/reject", isSuperAdmin, rejectResource); // Reject resource (superAdmin)

// Image upload (admin/superAdmin)
const upload = multer({ storage });
router.post(
  "/upload",
  isAdminOrSuperAdmin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (req.file && req.file.path) {
      res.json({ imageUrl: req.file.path });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  }
);

export default router;
