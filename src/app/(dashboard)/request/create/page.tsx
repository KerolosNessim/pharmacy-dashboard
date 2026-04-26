"use client";

import { getPharmaciesApi } from "@/api/pharmacies";
import { addRequestApi } from "@/api/transfar";
import RequestProductSearch from "@/components/request/request-product-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGoBack } from "@/hooks/use-goback";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Box, Loader2, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export type SelectedProduct = {
  name: string;
  quantity: number;
  id: number;
  code: string | null;
  price: string;
  description: string | null;
};

const RequestPage = () => {
  const goBack = useGoBack();
  const { data: pharmaciesData, isLoading: loadingPharmacies } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: () => getPharmaciesApi(),
  });

  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct[]>([]);
  const [pharmacyId, setPharmacyId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // increase
  const increaseQuantity = (id: number) => {
    setSelectedProduct((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    );
  };

  // decrease
  const decreaseQuantity = (id: number) => {
    setSelectedProduct((prev) =>
      prev
        .map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        )
        .filter((product) => product.quantity > 0),
    );
  };

  // remove
  const removeProduct = (id: number) => {
    setSelectedProduct((prev) => prev.filter((product) => product.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      from_pharmacy_id: Number(pharmacyId),
      notes,
      items: selectedProduct.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
      })),
    };
    const res = await addRequestApi(payload);
    if (res?.ok) {
      toast.success(res?.data?.message);
      setSelectedProduct([]);
      setPharmacyId("");
      goBack();
    } else {
      toast.error(res?.error);
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col gap-6 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Request Items</h2>
            <p className="text-muted-foreground text-sm">
              Request items from another branch
            </p>
          </div>
        </div>
      </div>

      {/* search */}
      <RequestProductSearch
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      {/* selected items */}
      {selectedProduct.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Selected Items{" "}
            <span className="text-muted-foreground text-sm">
              ({selectedProduct.length})
            </span>
          </h2>

          <div className="flex flex-col gap-2">
            {selectedProduct.map((product) => (
              <Card key={product.id}>
                <CardContent className="gap-4">
                  {/* top */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-bg p-4 border rounded-lg w-fit">
                        <Box className="size-5" />
                      </div>

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="font-medium">{product.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Code: {product?.code || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Price: {product.price}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={"destructive"}
                      size={"icon-sm"}
                      onClick={() => removeProduct(product.id)}
                    >
                      <X />
                    </Button>
                  </div>

                  {/* quantity */}
                  <div className="flex items-center gap-2 pt-4">
                    <Button
                      variant={"outline"}
                      size={"icon-sm"}
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      <Minus />
                    </Button>

                    <p className="text-center min-w-[20px]">
                      {product.quantity}
                    </p>

                    <Button
                      variant={"outline"}
                      size={"icon-sm"}
                      onClick={() => increaseQuantity(product.id)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label>Request From Branch</Label>
        <Select onValueChange={setPharmacyId} defaultValue={pharmacyId}>
          <SelectTrigger className="w-full h-12!">
            <SelectValue
              placeholder={
                loadingPharmacies ? "Loading branches..." : "Select a branch"
              }
            />
          </SelectTrigger>
          <SelectContent position="popper">
            {pharmaciesData?.data?.data?.data.map((pharmacy) => (
              <SelectItem key={pharmacy.id} value={pharmacy.id.toString()}>
                {pharmacy.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Notes (Optional)</Label>
        <Textarea
          placeholder="Add any additional notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        type="submit"
        className="w-full h-12!"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
      </Button>
    </section>
  );
};

export default RequestPage;
