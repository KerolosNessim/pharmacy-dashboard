"use client";
import PharmacistsCard from "@/components/pharmacists/pharmacists-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const PharmacistsPage = () => {
  return (
    <section className="flex flex-col gap-4 p-4 lg:max-w-3/4 mx-auto w-full">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" asChild>
          <Link href="/">
            <ArrowLeft />
            Back to Home
          </Link>
        </Button>
      </div>
      {/* content */}
      <Card >
        <CardHeader>
          <CardTitle className="text-2xl">Manage Pharmacist Phone Numbers</CardTitle>
          <CardDescription>
            Configure WhatsApp integration by adding pharmacist phone numbers in
            international format (e.g., +966501234567)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {
            Array.from({ length: 10 }).map((_, index) => (
              <PharmacistsCard key={index} />
            ))
          }
        </CardContent>
      </Card>
    </section>
  );
};

export default PharmacistsPage;
