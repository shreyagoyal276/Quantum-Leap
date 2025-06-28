import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/ClothingStockGraph.css';

const ClothingStockGraph = ({ items }) => {
  const data = items.map(i => ({
    name: i.name,
    stock: i.quantity.value,
  }));

  return (
    <div className="stock-graph-container">
      <h2 className="stock-graph-title">Clothing Stock Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#f472b6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClothingStockGraph;
