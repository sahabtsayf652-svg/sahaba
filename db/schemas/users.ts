import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  // Profile fields
  firstName: text('first_name'),
  lastName: text('last_name'),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  birthDate: text('birth_date'),
  country: text('country'),
  age: integer('age'),
  gender: text('gender'), // 'male' | 'female'
  contactInfo: text('contact_info'),
  bio: text('bio'),
  profileCompleted: boolean('profile_completed').default(false).notNull(),
  // Account status
  isSuspended: boolean('is_suspended').default(false).notNull(),
  suspendedUntil: timestamp('suspended_until'),
  suspensionCount: integer('suspension_count').default(0).notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
