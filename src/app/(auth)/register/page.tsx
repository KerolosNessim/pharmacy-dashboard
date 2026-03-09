import RegisterForm from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="flex flex-col items-center gap-4 ">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="size-20"
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">ME Pharmacies</h1>
            <p className="text-muted-foreground">Sign up to continue</p>
          </div>
        </div>

        <Card className="w-full max-w-md">
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RegisterPage;
