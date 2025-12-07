import { type SensorInfo } from "../types";
export function decodeSensors(value: unknown): SensorInfo[] {
  if (!value || !Array.isArray(value)) return [];

  return value.map((row: any) => ({
    sensor: row.Sensor ?? row.sensor ?? "",
    measurement: Number(row.Measurement ?? row.measurement ?? 0),
    unit: row.Unit ?? row.unit ?? "",
    category: row.Category ?? row.category ?? "",
  }));
}
