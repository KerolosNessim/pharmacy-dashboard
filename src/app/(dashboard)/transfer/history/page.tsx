"use client"

import TransferSearch from "@/components/transfer/transfar-search"
import TransferHistoryCard from "@/components/transfer/transfer-history-card"
import { Button } from "@/components/ui/button"
import { useGoBack } from "@/hooks/use-goback"
import { ChevronLeft } from "lucide-react"

const TransferHistoryPage = () => {
  const goBack=useGoBack()
  return (
    <section className='p-4 flex flex-col gap-4 lg:max-w-3/4 mx-auto'>
      {/* header */}
      <div className="flex items-start gap-1">
        <Button variant={"ghost"}  onClick={goBack} className="flex items-center gap-1">
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <h2 className="text-2xl text-primary font-bold">Transfers History</h2>
      </div>
      {/* search */}
      <TransferSearch />
      {/* list */}
      {
        Array.from({length:10}).map((_,i)=>(
          <TransferHistoryCard key={i} order={i+1} />
        ))
      }
    </section>
  )
}

export default TransferHistoryPage