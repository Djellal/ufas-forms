import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(), // Add password field for authentication
	role: text('role').notNull().default('student'), // Role field with default value 'student'
	age: integer('age')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const establishment = pgTable('establishment', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	name_ar: text('name_ar').notNull()
});

export const domaine = pgTable('domaine', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	level: text('level').notNull() // licence, master1, master2
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Establishment = typeof establishment.$inferSelect;

export type Domaine = typeof domaine.$inferSelect;

// Define role types for TypeScript
export type UserRole = 'admin' | 'facadmin' | 'student';
