import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./component/Home";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
