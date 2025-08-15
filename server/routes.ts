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

  // User management endpoints
  app.get("/api/admin/users", requireAuth, requirePermission("manage_users"), async (req, res) => {
    try {
      const users = await storage.getAllUsersWithRoles();
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id/role", requireAuth, requirePermission("manage_users"), async (req, res) => {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      
      const user = await storage.updateUserRole(id, roleId);
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update user role" });
    }
  });

  // Role management endpoints
  app.get("/api/admin/roles", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json({ success: true, roles });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch roles" });
    }
  });

  app.post("/api/admin/roles", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { name, description } = req.body;
      const role = await storage.createRole({ name, description });
      res.json({ success: true, role });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create role" });
    }
  });

  app.put("/api/admin/roles/:id", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const role = await storage.updateRole(parseInt(id), { name, description });
      res.json({ success: true, role });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update role" });
    }
  });

  app.delete("/api/admin/roles/:id", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRole(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete role" });
    }
  });

  app.get("/api/admin/roles/:id/permissions", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { id } = req.params;
      const roleWithPermissions = await storage.getRoleWithPermissions(parseInt(id));
      if (!roleWithPermissions) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json({ success: true, permissions: roleWithPermissions.permissions });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch role permissions" });
    }
  });

  // Permission management endpoints
  app.get("/api/admin/permissions", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const permissions = await storage.getAllPermissions();
      res.json({ success: true, permissions });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch permissions" });
    }
  });

  app.post("/api/admin/roles/:roleId/permissions/:permissionId", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { roleId, permissionId } = req.params;
      await storage.addPermissionToRole(parseInt(roleId), parseInt(permissionId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to add permission to role" });
    }
  });

  app.delete("/api/admin/roles/:roleId/permissions/:permissionId", requireAuth, requirePermission("manage_roles"), async (req, res) => {
    try {
      const { roleId, permissionId } = req.params;
      await storage.removePermissionFromRole(parseInt(roleId), parseInt(permissionId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to remove permission from role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
