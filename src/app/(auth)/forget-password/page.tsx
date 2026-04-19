import ForgetPasswordForm from "@/components/auth/forget-password-form";
import { Card, CardContent } from "@/components/ui/card";

const ForgetPasswordPage = () => {
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
          <p className="text-muted-foreground">Forget Password</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardContent>
          <ForgetPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgetPasswordPage;
