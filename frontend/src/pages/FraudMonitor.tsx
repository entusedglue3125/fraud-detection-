import { useStore } from "../store/useStore"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ShieldAlert, AlertOctagon } from "lucide-react"

export function FraudMonitor() {
  const { fraudAlerts, users } = useStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-rose-100 rounded-lg text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fraud Monitor</h1>
          <p className="text-muted-foreground mt-1">Real-time alerts for suspicious activities utilizing Graph cycle detection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fraudAlerts.length === 0 ? (
          <Card className="border-dashed border-2 bg-slate-50/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
              <p>No fraud alerts detected in the system.</p>
            </CardContent>
          </Card>
        ) : (
          fraudAlerts.map(alert => (
            <Card key={alert.id} className="border-rose-200 shadow-sm overflow-hidden">
              <div className="w-full h-1 bg-rose-500"></div>
              <CardHeader className="pb-2 flex flex-row items-center justify-between bg-rose-50/30">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-rose-800">High Risk Transaction Blocked</CardTitle>
                    <Badge variant="destructive" className="ml-2">Risk: {alert.fraudRisk}</Badge>
                  </div>
                  <p className="text-sm text-rose-600/80 font-medium">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl font-bold text-rose-700">
                  ${alert.amount.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1 tracking-wider">Entity Flow Segment</h4>
                    <div className="flex items-center space-x-3 text-lg bg-slate-50 p-3 rounded-md border border-slate-100">
                      <span className="font-semibold text-slate-800">{users.find(u=>u.id===alert.senderId)?.name || alert.senderId}</span>
                      <span className="text-slate-400 text-sm bg-white border px-2 py-0.5 rounded shadow-sm">ATTEMPT</span>
                      <span className="font-semibold text-slate-800">{users.find(u=>u.id===alert.receiverId)?.name || alert.receiverId}</span>
                    </div>
                  </div>
                  <div>
                     <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Transaction Hash Registry</h4>
                     <code className="bg-slate-100 px-3 py-2 rounded-md font-mono text-sm text-slate-600 border border-slate-200 block w-full">
                       {alert.id}
                     </code>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3 tracking-wider">Graph Heuristics Triggered</h4>
                  <div className="space-y-3">
                    {alert.fraudReasons.map((reason: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-rose-50/50 rounded border border-rose-100">
                        <AlertOctagon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 font-medium leading-relaxed">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
