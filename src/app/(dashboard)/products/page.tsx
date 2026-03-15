"use client";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Database, Download, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesStatsApi, getProductsListApi } from "@/api/products";
const ProductsPage = () => {
  const goBack = useGoBack();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["categories-stats"],
    queryFn: getCategoriesStatsApi,
  });
  const productsStats = data?.data?.data;

  const { data: productsList, isFetching: isProductsFetching } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProductsListApi(debouncedSearch),
  });
  const products = productsList?.data?.data;
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Database className="text-primary" />
            Barcodes Database
          </h2>
          <p className="text-muted-foreground text-sm">
            {productsStats?.total_products} products with SKU, barcode, and
            pricing data
          </p>
        </div>
      </div>
      {/* downloads */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="cursor-pointer">
          <Download />
          Download CSV
        </Button>
        <Button variant="outline" className="cursor-pointer">
          <Download />
          Download JSON
        </Button>
      </div>
      {isLoading && !productsList ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {/* statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className=" gap-0">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {productsStats?.total_products}
                </p>
              </CardContent>
            </Card>
            <Card className=" gap-0">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {productsStats?.total_categories}
                </p>
              </CardContent>
            </Card>
            <Card className=" gap-0">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  With Prices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {productsStats?.products_with_price}
                </p>
              </CardContent>
            </Card>
          </div>
          {/* categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productsStats?.per_category.map((category) => (
              <Card key={category.id} className=" gap-0 text-center">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-sm font-normal">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">{category.products_count}</p>
                </CardContent>
              </Card>
            ))}
            </div>
        </>
      )}
      {productsList && (
        <>
          {/* search */}
          <div className="relative">
            <InputGroup className="bg-bg border-primary/30 outline-0 h-12! rounded-lg">
              <InputGroupAddon>
                <Search className="text-primary" />
              </InputGroupAddon>
              <InputGroupInput 
                placeholder="Search products" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            {isProductsFetching && (
              <Loader2 className="animate-spin absolute right-3 top-3.5 w-5 h-5 text-muted-foreground" />
            )}
          </div>
          {/* table */}
          {isProductsFetching && !products ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Table className="border rounded-lg! overflow-hidden">
              <TableHeader className="bg-bg ">
                <TableRow className="hover:bg-bg">
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-bg/50">
                {products?.data?.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted-foreground/5  h-14  px-4 "
                  >
                    <TableCell>
                      {product?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product?.sku || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product?.category?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product?.price || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>)}
        </>
      )}


    </section>
  );
};

export default ProductsPage;
