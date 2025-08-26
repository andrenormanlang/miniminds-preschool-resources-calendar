import { Router, Request, Response, NextFunction } from "express";
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

// Image upload with enhanced error handling and validation
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

router.post(
  "/upload",
  isAdminOrSuperAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            message: "File too large. Maximum size is 10MB." 
          });
        }
        return res.status(400).json({ 
          message: `Upload error: ${err.message}` 
        });
      } else if (err) {
        return res.status(400).json({ 
          message: err.message 
        });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded. Please select an image file." 
        });
      }

      // File was successfully uploaded to Cloudinary via multer-storage-cloudinary
      const imageUrl = req.file.path;
      const publicId = (req.file as any).filename; // Public ID from Cloudinary

      console.log("✅ File uploaded successfully:", {
        originalName: req.file.originalname,
        cloudinaryUrl: imageUrl,
        publicId: publicId,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      res.status(200).json({ 
        imageUrl,
        publicId,
        originalName: req.file.originalname,
        size: req.file.size
      });

    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ 
        message: "Upload failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
);

export default router;
