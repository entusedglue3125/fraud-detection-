import { useState } from "react"
import { useStore } from "../store/useStore"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"

export function TransactionForm() {
  const { users, transactions } = useStore()
  const [senderId, setSenderId] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderId || !receiverId || !amount) return
    
    setLoading(true)
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId, amount })
      })
      setAmount("")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulate = async () => {
    if (users.length < 2) return
    const sender = users[Math.floor(Math.random() * users.length)]
    let receiver = users[Math.floor(Math.random() * users.length)]
    while (receiver.id === sender.id) {
      receiver = users[Math.floor(Math.random() * users.length)]
    }
    const amt = Math.floor(Math.random() * 5000) + 100
    
    setSenderId(sender.id)
    setReceiverId(receiver.id)
    setAmount(amt.toString())
  }

  // Force fraud cycle (A->B->A or high amount)
  const handleSimulateFraud = async () => {
    if (users.length < 2) return
    setSenderId(users[0].id)
    setReceiverId(users[1].id)
    setAmount("15000") // High value trigger
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1 shadow-sm h-fit border-indigo-100">
          <CardHeader className="bg-indigo-50/50 rounded-t-xl border-b border-indigo-100">
            <CardTitle>Create Transaction</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sender Account</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 transition-colors focus:ring-2 focus:ring-primary"
                  value={senderId}
                  onChange={e => setSenderId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Sender...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} - ${u.balance?.toLocaleString()}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Receiver Account</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 transition-colors focus:ring-2 focus:ring-primary"
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Receiver...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} - ${u.balance?.toLocaleString()}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Amount ($)</label>
                <Input 
                  type="number" 
                  min="1" 
                  step="0.01" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="e.g. 500.00" 
                  required
                />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Processing via Queue..." : "Process Transaction"}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={handleSimulate}>
                    Random Tx
                  </Button>
                  <Button type="button" variant="destructive" className="flex-1 bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 border" onClick={handleSimulateFraud}>
                    Attack Tx
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle>Recent Settlement History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b">
                  <tr>
                    <th className="px-6 py-4">Hash ID</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Flow</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{tx.id.split('_')[1]}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                           <span className="font-medium text-slate-900">{users.find(u=>u.id===tx.senderId)?.name || tx.senderId}</span>
                           <span className="text-slate-400">→</span>
                           <span className="font-medium text-slate-900">{users.find(u=>u.id===tx.receiverId)?.name || tx.receiverId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">${tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          tx.status === 'COMPLETED' ? 'default' :
                          tx.status === 'BLOCKED_FRAUD' ? 'destructive' : 'secondary'
                        }>
                          {tx.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No transactions recorded in the ledger yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
