import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dashoard from './dashboard';



function App() {
  return (
    <div >
      <Router>
        <Routes>
        <Route path="/dashboard" element={<Dashoard />} />
          <Route path="/" element={<Dashoard />} />
        </Routes>
      </Router>
    </div>
  );

}

export default App;
