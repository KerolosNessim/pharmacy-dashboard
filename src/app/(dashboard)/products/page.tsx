"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
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
import { ArrowLeft, Database, Download, Search } from "lucide-react";
const ProductsPage = () => {
  const goBack = useGoBack();
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
            13,059 products with SKU, barcode, and pricing data
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
      {/* statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className=" gap-0">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">13,059</p>
          </CardContent>
        </Card>
        <Card className=" gap-0">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">85</p>
          </CardContent>
        </Card>
        <Card className=" gap-0">
          <CardHeader>
            <CardTitle className="text-muted-foreground">With Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">9,922</p>
          </CardContent>
        </Card>
      </div>
      {/* categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 23 }).map((_, index) => (
          <Card key={index} className=" gap-0 text-center">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Category {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-lg">12,000</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* search */}
      <InputGroup className="bg-bg border-primary/30 outline-0 h-12! rounded-lg  ">
        <InputGroupAddon>
          <Search className="text-primary" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search products" />
      </InputGroup>
      {/* table */}
      <Table className="border rounded-lg! overflow-hidden">
        <TableHeader className="bg-bg ">
          <TableRow className="hover:bg-bg">
            <TableHead>Name</TableHead>
            <TableHead>Arabic Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-bg/50">
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="hover:bg-muted-foreground/5  h-14  px-4 "
            >
              <TableCell >
                {index + 1}-2 DRY UNDERARM PAD LARGE WHITE
              </TableCell>
              <TableCell className="text-muted-foreground">
                تو-تال فيتامين (ك2) 30كبسولة جيلاتينية
              </TableCell>
              <TableCell className="text-muted-foreground">
                6160010001
              </TableCell>
              <TableCell className="text-muted-foreground">
                medical
              </TableCell>
              <TableCell className="text-muted-foreground">
                -
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default ProductsPage;
