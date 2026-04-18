/**
 * Admin user database queries and helpers
 * Manages admin/editor users with password hashing
 */

import { Db, ObjectId, Filter } from "mongodb";
import { AdminUser, AdminUserSchema } from "./models";
import { RegisterAdminInput } from "@/lib/validators/blog";
import { hashPassword, comparePassword } from "@/lib/auth/crypto";

export class AdminUserRepository {
  constructor(private db: Db) {}

  private get collection() {
    return this.db.collection("admin_users");
  }

  /**
   * Create a new admin user
   */
  async create(data: RegisterAdminInput): Promise<Omit<AdminUser, "password">> {
    // Check if user already exists
    const existing = await this.collection.findOne({ email: data.email });
    if (existing) {
      throw new Error("User already exists with this email");
    }

    const now = new Date();
    const hashedPassword = await hashPassword(data.password);

    const doc = {
      ...data,
      password: hashedPassword,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const validated = AdminUserSchema.parse(doc);
    const result = await this.collection.insertOne(validated as any);

    const { password, ...userWithoutPassword } = doc;
    return {
      ...userWithoutPassword,
      _id: result.insertedId,
    } as Omit<AdminUser, "password">;
  }

  /**
   * Get admin user by ID (without password)
   */
  async getById(
    id: string | ObjectId,
  ): Promise<Omit<AdminUser, "password"> | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const doc = await this.collection.findOne({ _id: objectId });

    if (!doc) return null;

    const { password, ...userWithoutPassword } = doc;
    return userWithoutPassword as Omit<AdminUser, "password">;
  }

  /**
   * Get admin user by email (with password for auth check)
   */
  async getByEmailWithPassword(email: string): Promise<AdminUser | null> {
    const doc = await this.collection.findOne({ email });
    return doc as AdminUser | null;
  }

  /**
   * Get admin user by email (without password)
   */
  async getByEmail(email: string): Promise<Omit<AdminUser, "password"> | null> {
    const doc = await this.collection.findOne({ email });

    if (!doc) return null;

    const { password, ...userWithoutPassword } = doc;
    return userWithoutPassword as Omit<AdminUser, "password">;
  }

  /**
   * Verify admin credentials (email + password)
   */
  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<Omit<AdminUser, "password"> | null> {
    const user = await this.getByEmailWithPassword(email);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.collection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
        },
      },
    );

    // Return without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<AdminUser, "password">;
  }

  /**
   * List all admin users (without passwords)
   */
  async listAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: Omit<AdminUser, "password">[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: Filter<AdminUser> = {};

    const total = await this.collection.countDocuments(filter);
    const docs = (await this.collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()) as AdminUser[];

    const users = docs.map(({ password, ...user }) => user);

    return {
      users: users as Omit<AdminUser, "password">[],
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Update admin user
   */
  async update(
    id: string | ObjectId,
    data: Partial<Omit<RegisterAdminInput, "password">>,
  ): Promise<Omit<AdminUser, "password"> | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result?.value) return null;

    const { password, ...userWithoutPassword } = result.value;
    return userWithoutPassword as Omit<AdminUser, "password">;
  }

  /**
   * Change admin password
   */
  async changePassword(
    id: string | ObjectId,
    newPassword: string,
  ): Promise<boolean> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const hashedPassword = await hashPassword(newPassword);

    const result = await this.collection.updateOne(
      { _id: objectId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  }

  /**
   * Deactivate admin user (soft delete)
   */
  async deactivate(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const result = await this.collection.updateOne(
      { _id: objectId },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  }

  /**
   * Delete admin user (hard delete)
   */
  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  /**
   * Ensure database indexes
   */
  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ email: 1 }, { unique: true });
    await this.collection.createIndex({ isActive: 1 });
  }

  /**
   * Generate and store password reset token
   */
  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.collection.findOne({ email });
    if (!user) return null;

    // Generate random reset token
    const resetToken = require("crypto").randomBytes(32).toString("hex");

    // Set expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await this.collection.updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date(),
        },
      },
    );

    return resetToken;
  }

  /**
   * Validate and reset password using token
   */
  async resetPasswordWithToken(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.collection.findOne({ email });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return false;
    }

    // Check if token matches and hasn't expired
    if (user.resetToken !== token || new Date() > user.resetTokenExpiry) {
      return false;
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);

    const result = await this.collection.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  }
}
