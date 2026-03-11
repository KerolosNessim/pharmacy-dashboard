import LoginForm from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const LoginPage = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="flex flex-col items-center gap-2 ">
        {/* <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="size-20"
        /> */}
<p className="text-4xl font-bold text-primary">ME</p>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Pharmacies</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
