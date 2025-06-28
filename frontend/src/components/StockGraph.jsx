import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/StockGraph.css';

const StockGraph = ({ data }) => {
  return (
    <div className="stock-graph-container">
      <h3 className="stock-graph-title">Current Stock Levels</h3>
      {data.length === 0 ? (
        <p className="stock-graph-empty">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="quantity"
              fill="#FF69B4"
              label={{ position: 'top' }}
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockGraph;
