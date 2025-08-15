import { contacts, users, roles, permissions, rolePermissions, type User, type InsertUser, type Contact, type InsertContact, type Role, type Permission } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserWithRole(id: string): Promise<(User & { role?: Role }) | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  getRoleById(roleId: number): Promise<Role | undefined>;
  getRoleWithPermissions(roleId: number): Promise<(Role & { permissions: Permission[] }) | undefined>;
  checkUserPermission(userId: string, permissionName: string): Promise<boolean>;
  
  // User management
  getAllUsersWithRoles(): Promise<(User & { role?: Role })[]>;
  updateUserRole(userId: string, roleId: number | null): Promise<User>;
  
  // Role management
  getAllRoles(): Promise<Role[]>;
  createRole(role: { name: string; description?: string }): Promise<Role>;
  updateRole(roleId: number, role: { name?: string; description?: string }): Promise<Role>;
  deleteRole(roleId: number): Promise<void>;
  
  // Permission management
  getAllPermissions(): Promise<Permission[]>;
  addPermissionToRole(roleId: number, permissionId: number): Promise<void>;
  removePermissionFromRole(roleId: number, permissionId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getUserWithRole(id: string): Promise<(User & { role?: Role }) | undefined> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        roleId: users.roleId,
        role: roles,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, id));
    
    const user = result[0];
    if (!user) return undefined;
    
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      roleId: user.roleId,
      role: user.role || undefined,
    };
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getRoleById(roleId: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, roleId));
    return role || undefined;
  }

  async getRoleWithPermissions(roleId: number): Promise<(Role & { permissions: Permission[] }) | undefined> {
    const role = await this.getRoleById(roleId);
    if (!role) return undefined;

    const rolePerms = await db
      .select({
        permission: permissions,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return {
      ...role,
      permissions: rolePerms.map(rp => rp.permission),
    };
  }

  async checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.getUserWithRole(userId);
    if (!user || !user.roleId) return false;

    const roleWithPerms = await this.getRoleWithPermissions(user.roleId);
    if (!roleWithPerms) return false;

    // Check for carte_blanche permission first - if user has it, allow everything
    const hasCarteBlanche = roleWithPerms.permissions.some(p => p.name === "carte_blanche");
    if (hasCarteBlanche) return true;

    // Otherwise, check for specific permission
    return roleWithPerms.permissions.some(p => p.name === permissionName);
  }

  // User management methods
  async getAllUsersWithRoles(): Promise<(User & { role?: Role })[]> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        roleId: users.roleId,
        role: roles,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id));
    
    return result.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password,
      roleId: user.roleId,
      role: user.role || undefined,
    }));
  }

  async updateUserRole(userId: string, roleId: number | null): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ roleId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Role management methods
  async getAllRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async createRole(role: { name: string; description?: string }): Promise<Role> {
    const [newRole] = await db
      .insert(roles)
      .values(role)
      .returning();
    return newRole;
  }

  async updateRole(roleId: number, role: { name?: string; description?: string }): Promise<Role> {
    const [updatedRole] = await db
      .update(roles)
      .set(role)
      .where(eq(roles.id, roleId))
      .returning();
    return updatedRole;
  }

  async deleteRole(roleId: number): Promise<void> {
    // First remove all role-permission associations
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    // Then delete the role
    await db.delete(roles).where(eq(roles.id, roleId));
  }

  // Permission management methods
  async getAllPermissions(): Promise<Permission[]> {
    return await db.select().from(permissions);
  }

  async addPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .onConflictDoNothing();
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.permissionId, permissionId)
        )
      );
  }
}

export const storage = new DatabaseStorage();
