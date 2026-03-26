import { craeteAlertsValues } from "@/components/alerts/create-alert-form";
import { apiRequest } from "@/lib/api-request";
import { CreateAlertResponse, GetAlertsResponse } from "@/types/alerts";

export const createAlertApi = (data: craeteAlertsValues) =>
  apiRequest <CreateAlertResponse>("/instructions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAlertsApi = () =>
  apiRequest <GetAlertsResponse>("/instructions");