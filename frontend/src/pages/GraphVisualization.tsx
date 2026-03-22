import { useState, useRef, useMemo, useCallback } from "react"
import ForceGraph2D from "react-force-graph-2d"
import { useStore } from "../store/useStore"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export function GraphVisualization() {
  const { graphData, users } = useStore()
  const [startNode, setStartNode] = useState("")
  const [endNode, setEndNode] = useState("")
  const [shortestPath, setShortestPath] = useState<string[]>([])
  const [pathDistance, setPathDistance] = useState<number | null>(null)
  const fgRef = useRef<any>()

  const handleFindPath = async () => {
    if (!startNode || !endNode) return
    try {
      const res = await fetch(`http://localhost:3001/api/path/${startNode}/${endNode}`)
      const data = await res.json()
      setShortestPath(data.path || [])
      setPathDistance(data.distance)
    } catch (err) {
      console.error(err)
    }
  }

  const gData = useMemo(() => {
    const defaultNodeColor = "#94a3b8"
    const pathNodeColor = "#e11d48"
    const startEndNodeColor = "#4f46e5"
    
    // Some graph nodes might not be users if they are external, but let's assume they are.
    const nodes = graphData.nodes.map(n => {
      const isStart = n.id === startNode
      const isEnd = n.id === endNode
      const inPath = shortestPath.includes(n.id)
      
      let color = defaultNodeColor
      if (inPath) color = pathNodeColor
      if (isStart || isEnd) color = startEndNodeColor

      const user = users.find(u => u.id === n.id)
      return { 
        ...n, 
        name: user ? user.name : n.id,
        val: user ? Math.max(1, user.balance / 2000) : 1,
        color
      }
    })

    const links = graphData.links.map(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source
      const tId = typeof l.target === 'object' ? l.target.id : l.target
      
      let inPath = false
      if (shortestPath.length > 1) {
        for (let i = 0; i < shortestPath.length - 1; i++) {
          if (shortestPath[i] === sId && shortestPath[i+1] === tId) {
             inPath = true
             break
          }
        }
      }
      
      return {
        ...l,
        color: inPath ? "#e11d48" : "#cbd5e1",
        width: inPath ? 3 : 1
      }
    })

    return { nodes, links }
  }, [graphData, users, shortestPath, startNode, endNode])

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name
    const fontSize = 14/globalScale
    ctx.font = `bold ${fontSize}px Sans-Serif`
    const textWidth = ctx.measureText(label).width
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4) 

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1], 4)
    ctx.fill()
    ctx.strokeStyle = node.color
    ctx.lineWidth = 1.5/globalScale
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = node.color
    ctx.fillText(label, node.x, node.y)

    node.__bckgDimensions = bckgDimensions 
  }, [])

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)] relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Network Graph</h1>
        <p className="text-muted-foreground mt-1">Visualize topological connections, cycles, and optimal settlement paths.</p>
      </div>

      <Card className="flex-shrink-0 shadow-sm border-indigo-100 z-10 w-full xl:w-2/3">
        <CardHeader className="bg-indigo-50/50 py-4 border-b">
          <CardTitle className="text-lg">Dijkstra Shortest Settlement Path</CardTitle>
        </CardHeader>
        <CardContent className="py-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium">Start Node</label>
            <select 
              className="w-full h-10 rounded-md border bg-background px-3"
              value={startNode}
              onChange={e => setStartNode(e.target.value)}
            >
              <option value="">Select...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium">End Node</label>
            <select 
              className="w-full h-10 rounded-md border bg-background px-3"
              value={endNode}
              onChange={e => setEndNode(e.target.value)}
            >
              <option value="">Select...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <Button onClick={handleFindPath} className="h-10 px-6">
            Compute Path
          </Button>

          {shortestPath.length > 0 && (
            <div className="w-full mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded text-sm flex items-center gap-2">
              <span className="font-semibold text-slate-700">Path:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {shortestPath.map((id, idx) => (
                  <span key={idx} className="flex items-center">
                    <span className="bg-white text-indigo-800 border border-indigo-200 shadow-sm px-2 py-1 rounded-md font-medium text-xs">
                      {users.find(u => u.id === id)?.name || id}
                    </span>
                    {idx < shortestPath.length - 1 && <span className="mx-1 text-slate-400">→</span>}
                  </span>
                ))}
              </div>
              <span className="ml-auto text-muted-foreground text-xs font-mono bg-white px-2 py-1 rounded shadow-sm border">Cost: {pathDistance}</span>
            </div>
          )}
          {shortestPath.length === 0 && pathDistance === Infinity && (
            <div className="w-full mt-2 p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded text-sm font-medium shadow-sm">
              ⚠ No valid settlement path found between these exact accounts.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex-1 overflow-hidden shadow-md border-slate-200 rounded-xl relative">
        <div className="absolute inset-0 bg-slate-50/80" id="graph-container">
          <ForceGraph2D
            ref={fgRef}
            graphData={gData}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={(node: any, color, ctx) => {
              ctx.fillStyle = color
              const bckgDimensions = node.__bckgDimensions
              bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1])
            }}
            linkColor="color"
            linkWidth="width"
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            d3Force="charge"
            cooldownTicks={100}
            onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
            width={document.getElementById('graph-container')?.clientWidth || 800}
            height={document.getElementById('graph-container')?.clientHeight || 600}
          />
        </div>
      </Card>
    </div>
  )
}
