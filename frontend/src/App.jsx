import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SchemeMatcher from './pages/SchemeMatcher';
import EMICalculator from './pages/EMICalculator';
import Schemes from './pages/Schemes';
import PartnerLocator from './pages/PartnerLocator';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matcher" element={<SchemeMatcher />} />
          <Route path="/calculator" element={<EMICalculator />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/partners" element={<PartnerLocator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
