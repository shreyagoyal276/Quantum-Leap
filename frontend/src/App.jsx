import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CategoryChoice from "./components/CategoryChoice";
import ClothingDashboard from "./pages/ClothingDashboard";
import Restock from './components/Restock';
import Stocks from './components/Stocks';
import Billing from './components/Billing';
import Support from './components/Support';
import NewsSection from './components/NewsSection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/category"
          element={<CategoryChoice />}
        />
        <Route path="/clothing" element={<ClothingDashboard />} />
        <Route path="/restock" element={<Restock />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/news" element={<NewsSection />}/>
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;
