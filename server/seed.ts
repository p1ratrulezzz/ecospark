import { db } from "./db";
import { users, roles, permissions, rolePermissions } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create permissions
    console.log("Creating permissions...");
    const [viewFormsPermission] = await db
      .insert(permissions)
      .values({
        name: "view_forms",
        description: "View submitted contact forms",
      })
      .onConflictDoNothing()
      .returning();

    const [manageUsersPermission] = await db
      .insert(permissions)
      .values({
        name: "manage_users",
        description: "Manage system users and roles",
      })
      .onConflictDoNothing()
      .returning();

    const [viewSettingsPermission] = await db
      .insert(permissions)
      .values({
        name: "view_settings",
        description: "View and modify system settings",
      })
      .onConflictDoNothing()
      .returning();

    // Create admin role
    console.log("Creating admin role...");
    const [adminRole] = await db
      .insert(roles)
      .values({
        name: "admin",
        description: "Administrator with full access",
      })
      .onConflictDoNothing()
      .returning();

    // Assign permissions to admin role
    if (adminRole && viewFormsPermission) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: viewFormsPermission.id,
        })
        .onConflictDoNothing();
    }

    if (adminRole && manageUsersPermission) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: manageUsersPermission.id,
        })
        .onConflictDoNothing();
    }

    if (adminRole && viewSettingsPermission) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: viewSettingsPermission.id,
        })
        .onConflictDoNothing();
    }

    // Create admin user
    console.log("Creating admin user...");
    const hashedPassword = await hashPassword("admin");
    
    await db
      .insert(users)
      .values({
        username: "admin",
        password: hashedPassword,
        roleId: adminRole?.id,
      })
      .onConflictDoNothing();

    console.log("✅ Database seeding completed!");
    console.log("Admin user created:");
    console.log("  Username: admin");
    console.log("  Password: admin");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

export { seedDatabase };