import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { useStore } from "../store/useStore"
import { Users, ArrowRightLeft, AlertTriangle } from "lucide-react"

export function Dashboard() {
  const { users, transactions, fraudAlerts } = useStore()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of the financial graph system.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{users.length}</div>
            <p className="text-xs text-slate-500 mt-1">Active nodes in network</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Processed Transactions</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowRightLeft className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{transactions.length}</div>
            <p className="text-xs text-slate-500 mt-1">Settled securely</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-rose-50 border-rose-100 shadow-sm ring-1 ring-rose-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-600">Fraud Alerts</CardTitle>
            <div className="p-2 bg-rose-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">{fraudAlerts.length}</div>
            <p className="text-xs text-rose-500 mt-1">Suspicious activities flagged</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 text-slate-800 tracking-tight">Network Nodes (Accounts)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map(u => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{u.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${u.balance?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2 font-mono bg-slate-100 p-1 rounded inline-block">ID: {u.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
