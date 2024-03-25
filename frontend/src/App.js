import AppRoutes from "./AppRoutes";
import Header from "./components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  )
}
// src/App.js
// import React from 'react';
// import Login from './pages/login'; 
// import SearchBar from './pages/restrictions'; 
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'firebaseui/dist/firebaseui.css';



// function App() {
//   return (
//     <>
//     <Header />
//     <AppRoutes />
//     <Router>
//       <div className="App">
//         <header className="App-header">
//           {/* Navigation links can go here if you have a navbar */}
//         </header>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dietary" element={<SearchBar />} />
//         </Routes>
//       </div>
//     </Router>
//     </>
//   );
// }

export default App;
