"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, QrCode, RefreshCcw, Smartphone } from "lucide-react";

const WhatsappPage = () => {
  const goBack = useGoBack();
  return (
    <section className="p-4">
      <div className="lg:w-2/3 mx-auto flex flex-col gap-4">
        {/* header */}
        <div className="flex items-center gap-2  ">
          <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">WhatsApp Group Integration</h2>
            <p className="text-muted-foreground text-sm">
              Connect WhatsApp to receive and send transfer notifications to
              groups
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Smartphone /> Connection Status
            </CardTitle>
            <CardDescription>
              Connect your pharmacy WhatsApp to enable group messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
            <p className="bg-background p-3 border rounded-md w-full">
              WhatsApp is not connected. Click Initialize to start the
              connection process.
            </p>
            <Button>
              <QrCode />
              Initialize WhatsApp
            </Button>
            <Button variant={"outline"}>
              <RefreshCcw />
              Check if already connected
            </Button>
          </CardContent>
        </Card>
        {/* alert */}
        <div className="border rounded-lg p-4">
          <p>
            <span className="font-semibold">Note:</span> This WhatsApp connection
            uses a browser-based approach and may disconnect when the server
            restarts. If disconnected, click &quot;Initialize&quot; and scan the
            QR code again.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatsappPage;
