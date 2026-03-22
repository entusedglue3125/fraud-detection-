const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const transactionService = require('./src/services/TransactionService');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.get('/api/users', (req, res) => {
  res.json(transactionService.getUsers());
});

app.get('/api/transactions', (req, res) => {
  res.json(transactionService.getProcessedTransactions());
});

app.get('/api/graph', (req, res) => {
  res.json(transactionService.getGraphData());
});

app.get('/api/path/:start/:end', (req, res) => {
  const pathData = transactionService.getShortestPath(req.params.start, req.params.end);
  res.json(pathData);
});

app.post('/api/transactions', (req, res) => {
  const { senderId, receiverId, amount } = req.body;
  
  if (!senderId || !receiverId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const tx = transactionService.createTransaction(senderId, receiverId, Number(amount));
  
  setTimeout(() => {
    const processedTx = transactionService.processNextHighPriorityTransaction();
    
    if (processedTx) {
        io.emit('transaction_update', processedTx);
        io.emit('users_update', transactionService.getUsers());
        io.emit('graph_update', transactionService.getGraphData());
        
        if (processedTx.fraudRisk > 0) {
            io.emit('fraud_alert', processedTx);
        }
    }
  }, 100);

  res.json(tx);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('users_update', transactionService.getUsers());
  socket.emit('graph_update', transactionService.getGraphData());
  socket.emit('initial_transactions', transactionService.getProcessedTransactions());
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
