export function formatValue(value: any): string {
  if (typeof value === "string") return `'${value}'`;
  if (value instanceof Date)
    return `DATE '${value.toISOString().split("T")[0]}'`;
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  return `${value}`;
}

export function formatDateValue(
  date: string | Date,
  type: "date" | "datetime" | "timestamp" = "date"
): string {
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date value");
  }
  switch (type) {
    case "date":
      return `DATE '${dateObj.toISOString().split("T")[0]}'`;
    case "datetime":
      return `TIMESTAMP '${dateObj
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")}'`;
    case "timestamp":
      return `${dateObj.getTime()}`;
    default:
      return `DATE '${dateObj.toISOString().split("T")[0]}'`;
  }
}

export function timeToSeconds(time: string): number {
  const parts = time.split(":");
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}
