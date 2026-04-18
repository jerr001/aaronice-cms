/**
 * Page content database queries and helpers
 * Manages editable content for home, about, contact, footer, services pages
 */

import { Db, ObjectId } from "mongodb";
import { PageContent, PageContentSchema } from "./models";
import { UpdatePageContentInput } from "@/lib/validators/blog";

export class PageContentRepository {
  constructor(private db: Db) {}

  private get collection() {
    return this.db.collection("page_content");
  }

  /**
   * Get page content by pageId (e.g., 'home', 'about')
   */
  async getByPageId(
    pageId: PageContent["pageId"],
  ): Promise<PageContent | null> {
    const doc = await this.collection.findOne({ pageId });
    return doc as PageContent | null;
  }

  /**
   * Create or update page content
   */
  async upsert(
    pageId: PageContent["pageId"],
    data: UpdatePageContentInput,
  ): Promise<PageContent> {
    const now = new Date();
    const doc = {
      ...data,
      createdAt: new Date(), // Will only be set on insert
      updatedAt: now,
    };

    const validated = PageContentSchema.parse(doc);

    const result = await this.collection.findOneAndUpdate(
      { pageId },
      {
        $set: {
          ...data,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    return result?.value as PageContent;
  }

  /**
   * Get all page content
   */
  async getAll(): Promise<PageContent[]> {
    const docs = (await this.collection.find({}).toArray()) as PageContent[];
    return docs;
  }

  /**
   * Delete page content
   */
  async delete(pageId: PageContent["pageId"]): Promise<boolean> {
    const result = await this.collection.deleteOne({ pageId });
    return result.deletedCount > 0;
  }

  /**
   * Ensure database indexes
   */
  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ pageId: 1 }, { unique: true });
  }
}
