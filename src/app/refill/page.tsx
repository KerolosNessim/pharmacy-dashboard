import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Upload } from 'lucide-react';


const RefillPage = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div>
        <h2 className="text-2xl font-bold">Refill Tasks</h2>
        <p className="text-muted-foreground text-sm">
          Upload patient refill files and assign to pharmacists
        </p>
      </div>
      {/* refill tasks */}
      <div className="flex flex-col gap-2">
        {/* upload file */}
        <div className=" bg-bg rounded-lg border p-4 flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <FileSpreadsheet className="text-primary size-5 " />
            <h3 className="font-semibold">Upload Refill File</h3>
          </div>
          <Field>
            <FieldLabel
              htmlFor="task-file"
              className="cursor-pointer w-full p-6 border-2 border-dashed rounded-lg flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Upload className="size-8 " />
                <p >
                  Click to select Excel or CSV file
                </p>
              </div>
            </FieldLabel>
            <Input id="task-file" type="file" className="hidden" accept=".xlsx,.csv" />
          </Field>
        </div>
        {/* no tacks */}
        <div className="flex flex-col items-center gap-2 bg-bg rounded-lg border p-6 ">
          <FileSpreadsheet className="size-12 " />
          <h3 className="font-semibold">No refill tasks</h3>
          <p className="text-muted-foreground">
            Upload a file to create tasks for pharmacists
          </p>
        </div>
      </div>
    </section>
  );
}

export default RefillPage