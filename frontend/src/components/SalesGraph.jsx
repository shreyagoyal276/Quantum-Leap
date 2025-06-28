import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import '../styles/SalesGraph.css';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SalesGraph = () => {
  const [salesData, setSalesData] = useState({ labels: [], totals: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/billing/history')
      .then(async res => {
        console.log('Billing status:', res.status);
        const json = await res.json();
        console.log('Billing payload:', json);
        return json;
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Expected array');

        const itemTotals = {};
        data.forEach(entry => {
          const name = entry.name?.trim().toLowerCase(); // Normalize names
          const total = entry.quantity * entry.price;
          itemTotals[name] = (itemTotals[name] || 0) + total;
        });

        const labels = Object.keys(itemTotals);
        const totals = Object.values(itemTotals);
        setSalesData({ labels, totals });
      })
      .catch(err => console.error("SalesGraph fetch error:", err));
  }, []);

  return (
    <div className="sales-graph-container">
      <h3 className="sales-graph-title">Sales Overview</h3>
      {salesData.labels.length === 0 ? (
        <p className="sales-graph-empty">No sales data available</p>
      ) : (
        <div className="chart-wrapper">
          <Bar
            data={{
              labels: salesData.labels,
              datasets: [{
                label: '₹ Total Sales',
                data: salesData.totals,
                backgroundColor: '#FF69B4',
                borderRadius: 6,
                barThickness: 35
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#333',
                    font: {
                      size: 12,
                      weight: 'bold',
                    }
                  }
                },
                x: {
                  ticks: {
                    color: '#333',
                    font: {
                      size: 12,
                      weight: 'bold',
                    }
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: '#003949',
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `₹ ${ctx.raw}`
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SalesGraph;
