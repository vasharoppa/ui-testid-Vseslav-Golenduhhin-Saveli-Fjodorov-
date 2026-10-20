const express = require('express');
const app = express();

app.use(express.json());

let items = [
  { id: 1, sku: 'A-1', qty: 5 },
  { id: 2, sku: 'B-2', qty: 0 }
];
let nextId = 3;

app.post('/reset', (req, res) => {
  items = [
    { id: 1, sku: 'A-1', qty: 5 },
    { id: 2, sku: 'B-2', qty: 0 }
  ];
  nextId = 3;
  res.json({ status: 'reset ok' });
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'not found' });
  }
  res.json(item);
});

app.post('/items', (req, res) => {
  const { sku, qty } = req.body;
  
  if (typeof qty !== 'number' || qty < 0) {
    return res.status(400).json({ error: 'invalid qty' });
  }
  
  if (!sku || typeof sku !== 'string' || !/^[A-Z0-9-]+$/i.test(sku)) {
    return res.status(400).json({ error: 'invalid sku' });
  }

  const newItem = { id: nextId++, sku, qty };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'not found' });
  }
  
  const { sku, qty } = req.body;
  if (sku !== undefined) item.sku = sku;
  if (qty !== undefined) item.qty = qty;
  
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'not found' });
  }
  items.splice(index, 1);
  res.status(204).send();
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;