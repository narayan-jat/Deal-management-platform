import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function App() {
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
    <main className="min-h-screen bg-gray-50 p-10 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold">GoDex Deals</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New Deal</Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-bold mb-4">Create New Deal</h2>
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
                <Button onClick={handleSubmit}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <section className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{deal.title}</h3>
                  <p className="text-sm text-gray-500">${deal.amount}</p>
                </div>
                <span className="text-xs text-gray-400">ID: {deal.id}</span>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  )
}
