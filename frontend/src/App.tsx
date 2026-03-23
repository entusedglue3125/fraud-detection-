import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Dashboard } from "./pages/Dashboard"
import { TransactionForm } from "./pages/TransactionForm"
import { GraphVisualization } from "./pages/GraphVisualization"
import { FraudMonitor } from "./pages/FraudMonitor"
import { useStore } from "./store/useStore"

const API_URL = import.meta.env.VITE_API_URL || ""

function App() {
  const { setUsers, setGraphData, setTransactions, addTransaction, addFraudAlert } = useStore()

  useEffect(() => {
    // Only connect to Socket.IO if a backend URL is configured
    if (!API_URL) return

    let socket: any = null
    import("socket.io-client").then(({ io }) => {
      socket = io(API_URL)
      socket.on("users_update", setUsers)
      socket.on("graph_update", setGraphData)
      socket.on("initial_transactions", setTransactions)
      socket.on("transaction_update", addTransaction)
      socket.on("fraud_alert", addFraudAlert)
    }).catch(() => {
      // Backend unavailable — app uses seed data from the store
    })

    return () => {
      if (socket) {
        socket.off("users_update")
        socket.off("graph_update")
        socket.off("initial_transactions")
        socket.off("transaction_update")
        socket.off("fraud_alert")
        socket.disconnect()
      }
    }
  }, [setUsers, setGraphData, setTransactions, addTransaction, addFraudAlert])

  return (
    <Router>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-50/50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionForm />} />
            <Route path="/graph" element={<GraphVisualization />} />
            <Route path="/fraud" element={<FraudMonitor />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
