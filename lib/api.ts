
import { DateRange } from "react-day-picker";


export const fetchDashboard = async (name: string) => {
  const response = await fetch(`/api/dashboard/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data for ${name}`);
  }
  return await response.json();
};

export const fetchChart = async (id: string, dateRange: DateRange | null) => {
  let url = `/api/chart/${id}`;


  if (dateRange && dateRange.from && dateRange.to) {
    const from = encodeURIComponent(dateRange.from.toISOString())
    const to = encodeURIComponent(dateRange.to.toISOString())
    url = url + `?from=${from}&to=${to}`
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch chart: ${response.statusText}`);
  }

  return await response.json();
};