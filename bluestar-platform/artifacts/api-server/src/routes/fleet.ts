import { Router } from "express";
import bcrypt from "bcryptjs";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  clientsTable,
  devicesTable,
  homologationsTable,
  installationRequestsTable,
  usersTable,
  vehiclesTable,
} from "@workspace/db/schema";

const fleetRouter = Router();
type Role = "admin" | "tech" | "cliente" | "user";

function context(req: Parameters<typeof fleetRouter.get>[1] extends never ? never : any) {
  return {
    userId: req.session.userId as number | undefined,
    role: (req.session.userRole || "user") as Role,
    clientId: req.session.userClientId as number | null | undefined,
  };
}

function isManager(role: Role) {
  return role === "admin" || role === "tech";
}

function scopedClientId(req: any) {
  const current = context(req);
  return current.role === "cliente" ? current.clientId : null;
}

function rejectUnauthenticated(req: any, res: any) {
  if (!req.session.userId) {
    res.status(401).json({ error: "No autenticado" });
    return true;
  }
  return false;
}

function rejectManager(req: any, res: any) {
  if (rejectUnauthenticated(req, res)) return true;
  if (!isManager(context(req).role)) {
    res.status(403).json({ error: "No tienes permisos para esta acción" });
    return true;
  }
  return false;
}

function serializeVehicle(row: any) {
  return {
    ...row,
    lat: Number(row.lat),
    lng: Number(row.lng),
    speed: Number(row.speed || 0),
  };
}

fleetRouter.get("/fleet/vehicles", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const clientId = scopedClientId(req);
  const rows = await db.select().from(vehiclesTable).where(
    clientId ? eq(vehiclesTable.clientId, clientId) : undefined,
  ).orderBy(vehiclesTable.name);
  res.json(rows.map(serializeVehicle));
});

fleetRouter.post("/fleet/vehicles", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const { clientId, name, plate, brand, model, year, driver, status } = req.body || {};
  if (!clientId || !name || !plate) {
    res.status(400).json({ error: "Cliente, nombre y placa son requeridos" });
    return;
  }
  const [vehicle] = await db.insert(vehiclesTable).values({
    clientId: Number(clientId),
    name: String(name).trim(),
    plate: String(plate).trim().toUpperCase(),
    brand: brand || null,
    model: model || null,
    year: year ? Number(year) : null,
    driver: driver || null,
    status: status || "offline",
  }).returning();
  res.status(201).json(serializeVehicle(vehicle));
});

fleetRouter.delete("/fleet/vehicles/:id", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Identificador inválido" });
    return;
  }
  const [deleted] = await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Vehículo no encontrado" });
    return;
  }
  res.json({ ok: true, id });
});

fleetRouter.get("/fleet/devices", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const clientId = scopedClientId(req);
  const rows = await db.select().from(devicesTable).where(
    clientId ? eq(devicesTable.clientId, clientId) : undefined,
  ).orderBy(devicesTable.imei);
  res.json(rows);
});

fleetRouter.post("/fleet/devices", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const { clientId, vehicleId, imei, model, simCard, firmwareVersion } = req.body || {};
  if (!clientId || !imei || !model) {
    res.status(400).json({ error: "Cliente, IMEI y modelo son requeridos" });
    return;
  }
  const [device] = await db.insert(devicesTable).values({
    clientId: Number(clientId),
    vehicleId: vehicleId ? Number(vehicleId) : null,
    imei: String(imei).trim(),
    model: String(model).trim(),
    status: "offline",
    simCard: simCard || null,
    firmwareVersion: firmwareVersion || null,
  }).returning();
  res.status(201).json(device);
});

fleetRouter.delete("/fleet/devices/:id", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const id = Number(req.params.id);
  const [deleted] = await db.delete(devicesTable).where(eq(devicesTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Dispositivo no encontrado" });
    return;
  }
  res.json({ ok: true, id });
});

fleetRouter.get("/fleet/clients", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const rows = await db.select().from(clientsTable).orderBy(clientsTable.name);
  res.json(rows);
});

fleetRouter.post("/fleet/clients", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const { name, contactEmail, plan, features } = req.body || {};
  if (!name || !contactEmail) {
    res.status(400).json({ error: "Nombre y correo de contacto son requeridos" });
    return;
  }
  const [client] = await db.insert(clientsTable).values({
    name: String(name).trim(),
    contactEmail: String(contactEmail).trim().toLowerCase(),
    plan: plan || "Básico",
    features: features || {},
  }).returning();
  res.status(201).json(client);
});

fleetRouter.get("/fleet/users", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const rows = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    clientId: usersTable.clientId,
    active: usersTable.active,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(rows);
});

fleetRouter.post("/fleet/users", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const { name, email, password, role, clientId } = req.body || {};
  const normalizedRole = String(role || "cliente").toLowerCase();
  if (!name || !email || !password || !["cliente", "tech", "admin"].includes(normalizedRole)) {
    res.status(400).json({ error: "Nombre, correo, contraseña y rol válido son requeridos" });
    return;
  }
  if (normalizedRole === "cliente" && !clientId) {
    res.status(400).json({ error: "Un usuario cliente debe estar vinculado a un cliente" });
    return;
  }
  const [user] = await db.insert(usersTable).values({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    passwordHash: await bcrypt.hash(String(password), 10),
    role: normalizedRole,
    app: "all",
    clientId: clientId ? Number(clientId) : null,
  }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    clientId: usersTable.clientId,
    active: usersTable.active,
  });
  res.status(201).json(user);
});

fleetRouter.get("/fleet/homologations", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const clientId = scopedClientId(req);
  const rows = await db.select().from(homologationsTable).where(
    clientId ? eq(homologationsTable.clientId, clientId) : undefined,
  ).orderBy(desc(homologationsTable.createdAt));
  res.json(rows);
});

fleetRouter.post("/fleet/homologations", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const { clientId, vehicleId, type, status, details } = req.body || {};
  if (!clientId || !type) {
    res.status(400).json({ error: "Cliente y tipo de homologación son requeridos" });
    return;
  }
  const [row] = await db.insert(homologationsTable).values({
    clientId: Number(clientId),
    vehicleId: vehicleId ? Number(vehicleId) : null,
    type: String(type).trim(),
    status: status || "pendiente",
    details: details || null,
  }).returning();
  res.status(201).json(row);
});

fleetRouter.delete("/fleet/homologations/:id", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const id = Number(req.params.id);
  const [deleted] = await db.delete(homologationsTable).where(eq(homologationsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Homologación no encontrada" });
    return;
  }
  res.json({ ok: true, id });
});

fleetRouter.get("/fleet/installation-requests", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const clientId = scopedClientId(req);
  const rows = await db.select().from(installationRequestsTable).where(
    clientId ? eq(installationRequestsTable.clientId, clientId) : undefined,
  ).orderBy(desc(installationRequestsTable.createdAt));
  res.json(rows);
});

fleetRouter.post("/fleet/installation-requests", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const current = context(req);
  const { clientId: requestedClientId, vehicleId, deviceId, scheduledDate, timeSlot, address, notes } = req.body || {};
  const clientId = current.role === "cliente" ? current.clientId : Number(requestedClientId);
  if (!clientId || !scheduledDate || !timeSlot || !address) {
    res.status(400).json({ error: "Cliente, fecha, horario y dirección son requeridos" });
    return;
  }
  const [row] = await db.insert(installationRequestsTable).values({
    clientId,
    vehicleId: vehicleId ? Number(vehicleId) : null,
    deviceId: deviceId ? Number(deviceId) : null,
    scheduledDate: String(scheduledDate),
    timeSlot: String(timeSlot),
    address: String(address).trim(),
    notes: notes || null,
    createdBy: current.userId!,
  }).returning();
  res.status(201).json(row);
});

fleetRouter.patch("/fleet/installation-requests/:id", async (req, res): Promise<void> => {
  if (rejectManager(req, res)) return;
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!["requested", "scheduled", "completed", "cancelled"].includes(status)) {
    res.status(400).json({ error: "Estado de cita inválido" });
    return;
  }
  const [row] = await db.update(installationRequestsTable)
    .set({ status })
    .where(eq(installationRequestsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Cita no encontrada" });
    return;
  }
  res.json(row);
});

function pdfFor(lines: string[]) {
  const safe = lines.map((line) => line.replace(/[()\\]/g, "\\$&").slice(0, 110));
  const content = ["BT 18 Tf", "50 760 Td", ...safe.flatMap((line, index) => [
    index === 0 ? `(${line}) Tj` : `0 -18 Td (${line}) Tj`,
  ])].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /BT 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

fleetRouter.get("/fleet/reports/export", async (req, res): Promise<void> => {
  if (rejectUnauthenticated(req, res)) return;
  const clientId = scopedClientId(req);
  const rows = await db.select().from(vehiclesTable).where(
    clientId ? eq(vehiclesTable.clientId, clientId) : undefined,
  ).orderBy(vehiclesTable.name);
  const format = String(req.query.format || "csv").toLowerCase();
  const report = rows.map((row) => ({
    id: row.id, vehículo: row.name, placa: row.plate, estado: row.status,
    velocidad_kmh: row.speed, conductor: row.driver || "", homologacion: row.homologationStatus,
  }));
  if (format === "json") {
    res.setHeader("Content-Disposition", 'attachment; filename="reporte-bluetrack.json"');
    res.json(report);
    return;
  }
  if (format === "pdf") {
    const lines = ["Reporte BlueTrack", `Generado: ${new Date().toLocaleString("es-MX")}`, "",
      "Vehículo | Placa | Estado | Velocidad | Homologación",
      ...report.map((row) => `${row.vehículo} | ${row.placa} | ${row.estado} | ${row.velocidad_kmh} km/h | ${row.homologacion}`)];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="reporte-bluetrack.pdf"');
    res.send(pdfFor(lines));
    return;
  }
  const header = "id,vehiculo,placa,estado,velocidad_kmh,conductor,homologacion";
  const csv = [header, ...report.map((row) => [
    row.id, row.vehículo, row.placa, row.estado, row.velocidad_kmh, row.conductor, row.homologacion,
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="reporte-bluetrack.csv"');
  res.send(`\uFEFF${csv}`);
});

export default fleetRouter;