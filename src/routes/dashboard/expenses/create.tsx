import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReceiptScan } from '@/components/receipt/receipt-scan'

export const Route = createFileRoute('/dashboard/expenses/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full flex justify-center items-center flex-col">
      <div>
        <Link to="/dashboard/expenses" className="flex items-center gap-2 mb-5">
          <ArrowLeft className="size-6" />
          <span className="text-2xl font-bold">Wróć do wydatków</span>
        </Link>
        <Tabs defaultValue="scan" className="w-[1400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Skanowanie</TabsTrigger>
            <TabsTrigger value="manual">Manualne</TabsTrigger>
          </TabsList>
          <TabsContent value="scan">
            <ReceiptScan />
          </TabsContent>
          <TabsContent value="manual">
            <p>Wklej paragon albo kliknij aby dodać plik</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
