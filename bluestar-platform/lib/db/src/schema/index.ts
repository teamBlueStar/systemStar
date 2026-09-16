import { pgTable, serial, varchar, boolean, timestamp, integer, date, jsonb, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  app: varchar("app", { length: 50 }).notNull().default("all"),
  clientId: integer("client_id"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull().default("Básico"),
  status: varchar("status", { length: 30 }).notNull().default("active"),
  features: jsonb("features").$type<Record<string, boolean>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  plate: varchar("plate", { length: 50 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  model: varchar("model", { length: 100 }),
  year: integer("year"),
  driver: varchar("driver", { length: 255 }),
  status: varchar("status", { length: 30 }).notNull().default("offline"),
  speed: integer("speed").notNull().default(0),
  lat: varchar("lat", { length: 40 }).notNull().default("19.4326"),
  lng: varchar("lng", { length: 40 }).notNull().default("-99.1332"),
  address: varchar("address", { length: 255 }),
  lastSeen: timestamp("last_seen").defaultNow(),
  deviceId: integer("device_id"),
  homologationStatus: varchar("homologation_status", { length: 30 }).notNull().default("pendiente"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devicesTable = pgTable("devices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  vehicleId: integer("vehicle_id"),
  imei: varchar("imei", { length: 40 }).notNull().unique(),
  model: varchar("model", { length: 100 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("offline"),
  lastConnection: timestamp("last_connection"),
  signal: integer("signal").notNull().default(0),
  simCard: varchar("sim_card", { length: 40 }),
  firmwareVersion: varchar("firmware_version", { length: 40 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const installationRequestsTable = pgTable("installation_requests", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  vehicleId: integer("vehicle_id"),
  deviceId: integer("device_id"),
  scheduledDate: date("scheduled_date", { mode: "string" }).notNull(),
  timeSlot: varchar("time_slot", { length: 50 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("requested"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const homologationsTable = pgTable("homologations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  vehicleId: integer("vehicle_id"),
  type: varchar("type", { length: 100 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pendiente"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});
