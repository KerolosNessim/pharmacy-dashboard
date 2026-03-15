"use client";

import { useQuery } from "@tanstack/react-query";
import { getSingleProductApi } from "@/api/products";
import { Box, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export const SingleProductDetails = ({ productId }: { productId: string }) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getSingleProductApi(productId),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const product = response?.data?.data;

  if (!product) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        Product not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full  mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Product Header Card */}
      <div className="bg-bg border rounded-lg p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2">
          {
            product.image ?(
              <Image src={product.image} alt={product.name} width={100} height={100} className="rounded-lg" />
            ) : (
              <div className="size-20 bg-background/50 border rounded-lg flex items-center justify-center">
                <Box className="size-10 " />
              </div>
            )
          }
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/80 font-mono tracking-wide">
                Ref: {product.code}
              </span>
              {product.sku && (
                <span className="text-sm text-foreground/80 font-mono tracking-wide">
                  SKU: {product.sku}
                </span>
              )}
              {product.category?.name && (
                <Badge variant="success" className="px-2 py-0.5 text-xs font-normal">
                  {product.category.name}
                </Badge>
              )}
            </div>
            {product.manufacturer && (
              <span className="text-sm text-muted-foreground mt-1">
                Manufacturer: {product.manufacturer}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Accordion Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-muted-foreground tracking-wider uppercase pl-1">
          Product Details
        </h3>
        
        <Accordion type="single" collapsible className="w-full bg-bg border rounded-lg shadow-sm  " >
          
          {product.active_ingredients && (
            <AccordionItem value="composition" className="px-4 border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                Composition & Active Ingredients
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-4">
                {product.active_ingredients}
                {product.concentration && ` (${product.concentration})`}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.description && (
            <AccordionItem value="description" className="px-4 border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                Description & Indication
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-4">
                {product.description}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.dosage_form && (
            <AccordionItem value="dosage" className="px-4 border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                Dosage Form
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-4">
                {product.dosage_form}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.side_effects && (
            <AccordionItem value="sideEffects" className="px-4 border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                Side Effects
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-4">
                {product.side_effects}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.storage_instructions && (
            <AccordionItem value="storage" className="px-4 border-b-0">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                Storage Instructions
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-4">
                {product.storage_instructions}
              </AccordionContent>
            </AccordionItem>
          )}

        </Accordion>
      </div>

    </div>
  );
};
