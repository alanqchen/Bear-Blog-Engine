import { format } from "date-fns";

// Returns MMMM DD, YYYY
export function timestamp2date(dateStr) {
  // YYYY-MM-DD
  dateStr = dateStr.slice(0, 10);
  // YYYY-MM-DDT00:00:00
  dateStr += "T00:00:00";
  const date = new Date(dateStr.replace(/-/g, "/").replace(/T.+/, ""));
  return format(date, "MMMM do, yyyy");
}
