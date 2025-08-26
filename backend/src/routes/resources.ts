import { Router, Request, Response } from "express";
import {
  getAllResources,
  getPendingResources,
  getUserResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
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
router.put("/:id", isAdminOrSuperAdmin, updateResource); // Update resource (admin/superAdmin)
router.delete("/:id", isAdminOrSuperAdmin, deleteResource); // Delete resource (admin/superAdmin)
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
    try {
      console.log("Upload request received:", {
        file: req.file ? "File present" : "No file",
        fileName: req.file?.originalname,
        fileSize: req.file?.size,
        cloudinaryConfig: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
          api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
          api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "Not set",
        }
      });

      // Check if all required Cloudinary env vars are set
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("Missing Cloudinary configuration");
        return res.status(500).json({ 
          message: "Server configuration error: Missing Cloudinary credentials" 
        });
      }

      if (req.file && req.file.path) {
        console.log("File uploaded successfully:", req.file.path);
        res.json({ imageUrl: req.file.path });
      } else {
        console.error("No file uploaded or file.path missing");
        res.status(400).json({ message: "No file uploaded" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: "Upload failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
);

export default router;
