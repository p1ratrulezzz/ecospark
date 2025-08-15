import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users, roles, permissions, rolePermissions } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  // Create local PostgreSQL connection instead of using Neon
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
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

    const [carteBlanchePermission] = await db
      .insert(permissions)
      .values({
        name: "carte_blanche",
        description: "Full access - bypasses all permission checks",
      })
      .onConflictDoNothing()
      .returning();

    const [manageUsersPermission2] = await db
      .insert(permissions)
      .values({
        name: "manage_users",
        description: "Manage system users and assign roles",
      })
      .onConflictDoNothing()
      .returning();

    const [manageRolesPermission] = await db
      .insert(permissions)
      .values({
        name: "manage_roles",
        description: "Manage roles and permissions",
      })
      .onConflictDoNothing()
      .returning();

    // Create admin role
    console.log("Creating admin role...");
    let [adminRole] = await db
      .insert(roles)
      .values({
        name: "admin",
        description: "Administrator with full access",
      })
      .onConflictDoNothing()
      .returning();
    
    // If role already exists, get it
    if (!adminRole) {
      [adminRole] = await db.select().from(roles).where(eq(roles.name, "admin"));
    }

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

    if (adminRole && carteBlanchePermission) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: carteBlanchePermission.id,
        })
        .onConflictDoNothing();
    }

    if (adminRole && manageUsersPermission2) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: manageUsersPermission2.id,
        })
        .onConflictDoNothing();
    }

    if (adminRole && manageRolesPermission) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: manageRolesPermission.id,
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
  } finally {
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

export { seedDatabase };