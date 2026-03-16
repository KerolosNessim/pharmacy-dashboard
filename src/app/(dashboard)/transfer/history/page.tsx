"use client"

import { Suspense } from "react"
import { getRequestsApi } from "@/api/transfar"
import TransferSearch from "@/components/transfer/transfar-search"
import TransferHistoryCard from "@/components/transfer/transfer-history-card"
import { Button } from "@/components/ui/button"
import { useGoBack } from "@/hooks/use-goback"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

const TransferHistoryContent = () => {
  const goBack = useGoBack()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const from_date = searchParams.get("from_date") || ""
  const to_date = searchParams.get("to_date") || ""

  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (status && status !== "all") params.set("status", status)
  if (from_date) params.set("from_date", from_date)
  if (to_date) params.set("to_date", to_date)
  
  const queryString = params.toString() ? `?${params.toString()}` : ""

  const { data } = useQuery({
    queryKey: ["transfers", search, status, from_date, to_date],
    queryFn: () => getRequestsApi(queryString),
  });
  
  const transfers = data?.data?.data?.data ?? [];

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
        transfers.map((transfer,index)=>(
          <TransferHistoryCard key={index} order={index+1} transfar={transfer} />
        ))
      }
    </section>
  )
}

const TransferHistoryPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferHistoryContent />
    </Suspense>
  )
}

export default TransferHistoryPage