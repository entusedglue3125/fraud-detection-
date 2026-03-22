import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { io } from "socket.io-client"
import { Sidebar } from "./components/Sidebar"
import { Dashboard } from "./pages/Dashboard"
import { TransactionForm } from "./pages/TransactionForm"
import { GraphVisualization } from "./pages/GraphVisualization"
import { FraudMonitor } from "./pages/FraudMonitor"
import { useStore } from "./store/useStore"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
const socket = io(API_URL)

function App() {
  const { setUsers, setGraphData, setTransactions, addTransaction, addFraudAlert } = useStore()

  useEffect(() => {
    socket.on("users_update", setUsers)
    socket.on("graph_update", setGraphData)
    socket.on("initial_transactions", setTransactions)
    socket.on("transaction_update", addTransaction)
    socket.on("fraud_alert", addFraudAlert)

    return () => {
      socket.off("users_update")
      socket.off("graph_update")
      socket.off("initial_transactions")
      socket.off("transaction_update")
      socket.off("fraud_alert")
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
