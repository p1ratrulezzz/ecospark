import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Middleware to check permissions
const requirePermission = (permission: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasPermission = await storage.checkUserPermission(req.user.id, permission);
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Admin routes - require authentication and permissions
  app.get("/api/admin/contacts", requireAuth, requirePermission("view_forms"), async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ success: true, contacts });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/user", requireAuth, async (req, res) => {
    try {
      const userWithRole = await storage.getUserWithRole(req.user.id);
      if (!userWithRole) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user permissions
      let permissions: string[] = [];
      if (userWithRole.roleId) {
        const roleWithPerms = await storage.getRoleWithPermissions(userWithRole.roleId);
        permissions = roleWithPerms?.permissions.map(p => p.name) || [];
      }

      res.json({
        success: true,
        user: {
          id: userWithRole.id,
          username: userWithRole.username,
          role: userWithRole.role,
          permissions,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
