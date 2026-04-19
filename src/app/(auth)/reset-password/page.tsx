import ForgetPasswordForm from "@/components/auth/forget-password-form";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string; id_number: string }>;
}) => {
  const { token, id_number } = await searchParams;
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
          <p className="text-muted-foreground">Reset Password</p>
        </div>
      </div>
      <Card className="w-full max-w-md">
        <CardContent>
          <ResetPasswordForm token={token} id_number={id_number} />
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordPage;
