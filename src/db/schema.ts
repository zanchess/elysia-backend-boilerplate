import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  json,
  text,
  unique,
  PgTableWithColumns,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleTypeEnum = pgEnum('role_type', ['DISMISSED', 'USER', 'MODERATOR']);
export const formStatusEnum = pgEnum('form_status', ['DRAFT', 'PUBLISHED']);
export const feedbackStatusEnum = pgEnum('feedback_status', ['DRAFT', 'PUBLISHED']);

// Tables
export const users: PgTableWithColumns<any> = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  photoUrl: varchar('photo_url'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  seniorityId: uuid('seniority_id').references(() => seniorities.id),
  departmentId: uuid('department_id').references(() => departments.id),
  titleId: uuid('title_id').references(() => titles.id),
  managerId: uuid('manager_id').references(() => users.id),
  defaultFormId: uuid('default_form_id').references(() => forms.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const departments = pgTable('department', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const seniorities = pgTable('seniority', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const titles = pgTable('title', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const roles = pgTable('role', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: roleTypeEnum('name').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRoles = pgTable(
  'user_role',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => ({
    userRoleUnique: unique().on(table.userId, table.roleId),
  })
);

export const forms = pgTable('form', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  isPublic: boolean('is_public').notNull().default(false),
  description: varchar('description'),
  latestVersionId: integer('latest_version_id'),
  isActive: boolean('is_active').notNull().default(true),
  status: formStatusEnum('status').notNull(),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const formVersions = pgTable('form_version', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id')
    .notNull()
    .references(() => forms.id),
  version: integer('version').notNull(),
  fields: json('fields').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const feedbacks = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestedById: uuid('requested_by_id').references(() => users.id),
  targetUserId: uuid('target_user_id')
    .notNull()
    .references(() => users.id),
  feedbackUserId: uuid('feedback_user_id')
    .notNull()
    .references(() => users.id),
  content: json('content'),
  formVersionId: uuid('form_version_id')
    .notNull()
    .references(() => formVersions.id),
  deadline: timestamp('deadline'),
  redline: timestamp('redline'),
  isActive: boolean('is_active').notNull().default(true),
  status: feedbackStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailTemplates = pgTable('email_template', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  source: json('source').notNull(),
  html: text('html').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notifications = pgTable('notification', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailTemplateId: uuid('email_template_id')
    .notNull()
    .references(() => emailTemplates.id),
  recipientId: uuid('recipient_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('session', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  token: varchar('token', { length: 512 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  seniority: one(seniorities, {
    fields: [users.seniorityId],
    references: [seniorities.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  title: one(titles, {
    fields: [users.titleId],
    references: [titles.id],
  }),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
  defaultForm: one(forms, {
    fields: [users.defaultFormId],
    references: [forms.id],
  }),
  managedUsers: many(users, { relationName: 'manager' }),
  createdForms: many(forms),
  requestedFeedbacks: many(feedbacks, { relationName: 'requestedBy' }),
  targetFeedbacks: many(feedbacks, { relationName: 'targetUser' }),
  feedbacks: many(feedbacks, { relationName: 'feedbackUser' }),
  notifications: many(notifications),
  userRoles: many(userRoles),
  sessions: many(sessions),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  users: many(users),
}));

export const senioritiesRelations = relations(seniorities, ({ many }) => ({
  users: many(users),
}));

export const titlesRelations = relations(titles, ({ many }) => ({
  users: many(users),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [forms.createdById],
    references: [users.id],
  }),
  defaultForUsers: many(users),
  versions: many(formVersions),
  feedbacks: many(feedbacks),
}));

export const formVersionsRelations = relations(formVersions, ({ one, many }) => ({
  form: one(forms, {
    fields: [formVersions.formId],
    references: [forms.id],
  }),
  feedbacks: many(feedbacks),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  requestedBy: one(users, {
    fields: [feedbacks.requestedById],
    references: [users.id],
  }),
  targetUser: one(users, {
    fields: [feedbacks.targetUserId],
    references: [users.id],
  }),
  feedbackUser: one(users, {
    fields: [feedbacks.feedbackUserId],
    references: [users.id],
  }),
  formVersion: one(formVersions, {
    fields: [feedbacks.formVersionId],
    references: [formVersions.id],
  }),
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ many }) => ({
  notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  emailTemplate: one(emailTemplates, {
    fields: [notifications.emailTemplateId],
    references: [emailTemplates.id],
  }),
  recipient: one(users, {
    fields: [notifications.recipientId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
