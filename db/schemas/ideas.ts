import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'

export const contentTypeEnum = pgEnum('content_type', ['idea', 'novel', 'design'])
export const visibilityEnum = pgEnum('visibility', ['free', 'paid'])
export const contentStatusEnum = pgEnum('content_status', ['active', 'deleted', 'suspended'])

export const ideas = pgTable('ideas', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  preview: text('preview'),
  type: contentTypeEnum('type').notNull().default('idea'),
  // فئة الفكرة: novel_idea | project_idea
  ideaCategory: text('idea_category'),
  // تصنيف الرواية: action | romance | mystery | scifi | horror | drama | comedy | other
  novelGenre: text('novel_genre'),
  // حالة الرواية: ongoing | completed
  novelStatus: text('novel_status'),
  // تصنيف التصميم: photo | cv | research | chart | other
  designCategory: text('design_category'),
  // رابط الصورة/الملف للتصميمات
  mediaUrl: text('media_url'),
  visibility: visibilityEnum('visibility').notNull().default('free'),
  price: integer('price').default(0),
  status: contentStatusEnum('status').notNull().default('active'),
  writtenAt: text('written_at').notNull(),
  purchaseCount: integer('purchase_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  chapters: text('chapters'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const purchases = pgTable('purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  ideaId: text('idea_id').notNull(),
  amount: integer('amount').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const violations = pgTable('violations', {
  id: text('id').primaryKey(),
  reportedContentId: text('reported_content_id').notNull(),
  reportedUserId: text('reported_user_id').notNull(),
  reason: text('reason').notNull(),
  resolvedAt: timestamp('resolved_at'),
  action: text('action'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Idea = typeof ideas.$inferSelect
export type NewIdea = typeof ideas.$inferInsert
export type Purchase = typeof purchases.$inferSelect
