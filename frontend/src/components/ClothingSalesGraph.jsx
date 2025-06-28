import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/ClothingSalesGraph.css';

const ClothingSalesGraph = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
  axios
    .get('http://localhost:5000/api/clothing-billing/sales-data', {
      withCredentials: true,
    })
    .then((res) => {
      // console.log("Raw API data:", res.data);

      const formatted = res.data.map((entry) => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        return { date: formattedDate, sales: entry.quantity };
      });

      // console.log("Formatted salesData:", formatted);
      setSalesData(formatted);
    })
    .catch((err) => {
      console.error('Failed to load sales graph:', err);
    });
}, []);


  return (
    <div className="sales-graph-container">
      <h2 className="sales-graph-title">Clothing Sales Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            dot={true}
            type="monotone"
            dataKey="sales"
            stroke="#f472b6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClothingSalesGraph;
