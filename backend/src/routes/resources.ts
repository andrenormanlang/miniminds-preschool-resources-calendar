import { Router, Request, Response } from "express";
import {
  getAllResources,
  getAllResourcesAdmin,
  getPendingResources,
  getUserResources,
  getResourceById,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
  bulkCreateResources,
  bulkUpdateResources,
  bulkDeleteResources,
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
  getAllResourcesAdmin
); // See all resources as admin/superAdmin
router.get("/admin/mine", isAdminOrSuperAdmin, getUserResources); // See your own resources

// SuperAdmin only routes
router.get("/admin/pending", isSuperAdmin, getPendingResources); // See pending resources (superAdmin)
router.patch("/:id/approve", isSuperAdmin, approveResource); // Approve/reject resource (superAdmin)

// Update/delete routes (auth check is in the controller)
router.put("/:id", isAdminOrSuperAdmin, updateResource);
router.delete("/:id", isAdminOrSuperAdmin, deleteResource);

// Bulk operations (SuperAdmin only)
router.post("/bulk", isSuperAdmin, bulkCreateResources);
router.post("/bulk-update", isSuperAdmin, bulkUpdateResources);
router.delete("/", isSuperAdmin, bulkDeleteResources);

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
