import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function DealsPage() {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [deals, setDeals] = useState([])

  const handleSubmit = () => {
    const newDeal = {
      id: Date.now(),
      title,
      amount,
    }
    setDeals([newDeal, ...deals])
    setTitle("")
    setAmount("")
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">GoDex Deals</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-semibold mb-4">Create New Deal</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="deal-title">Deal Title</Label>
                  <Input
                    id="deal-title"
                    placeholder="Enter deal name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="$0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Create Deal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="p-4 hover:shadow-md transition-shadow border border-muted"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{deal.title}</h3>
                <p className="text-muted-foreground text-sm">
                  Amount: <span className="font-medium">${deal.amount}</span>
                </p>
                <p className="text-xs text-muted-foreground">ID: {deal.id}</p>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  )
}
