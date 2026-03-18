"use client";

export const dynamic = "force-dynamic";

import ActivateForm from "@/components/auth/activate-form";
import { Card, CardContent } from "@/components/ui/card";

const ActivatePage = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="flex flex-col items-center gap-2 ">
        <p className="text-4xl font-bold text-primary">ME</p>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Pharmacies</h1>
          <p className="text-muted-foreground">Activate your account</p>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardContent>
          <ActivateForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default ActivatePage;
