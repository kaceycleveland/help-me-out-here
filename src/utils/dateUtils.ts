import { format } from "date-fns";

export const formatDate = (date: Date, formatStr = "Pp") => {
  return format(date, formatStr);
};
