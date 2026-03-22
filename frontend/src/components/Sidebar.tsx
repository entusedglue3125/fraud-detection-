import { NavLink } from "react-router-dom"
import { LayoutDashboard, ArrowRightLeft, Network, ShieldAlert } from "lucide-react"

export function Sidebar() {
  const routes = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowRightLeft },
    { name: "Graph View", path: "/graph", icon: Network },
    { name: "Fraud Monitor", path: "/fraud", icon: ShieldAlert },
  ]

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent tracking-tight">FinNetwork.</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-primary text-primary-foreground font-medium shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <route.icon className="w-5 h-5" />
            <span>{route.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t text-xs text-muted-foreground">
        Real-time Transaction Engine
      </div>
    </div>
  )
}
