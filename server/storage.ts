import { contacts, users, roles, permissions, rolePermissions, type User, type InsertUser, type Contact, type InsertContact, type Role, type Permission } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

    return roleWithPerms.permissions.some(p => p.name === permissionName);
  }
}

export const storage = new DatabaseStorage();
