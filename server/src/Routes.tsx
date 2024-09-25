import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Verification from './pages/Verification'

function RoutesIndex() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </Router>
  );
}
export default RoutesIndex;
