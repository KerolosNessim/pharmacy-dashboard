import { Alert } from "@/types/alerts";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const AlertsCard = ({ alert }: { alert: Alert }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{alert?.title}</CardTitle>
        <CardDescription>{alert?.body}</CardDescription>
        <CardAction className="text-xs text-muted-foreground">{new Date(alert?.created_at).toLocaleDateString()}</CardAction>
      </CardHeader>
    </Card>
  );
};

export default AlertsCard;
