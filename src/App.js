import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Password from "./Password";
import { Usercontext } from "./Usercontext";
function App(props) {
  let [user, setUser] = useState({
    isLogin: false,
    CurrentUserid: null,
    CurrentUsername: null,
  });
  return (
    <Usercontext.Provider value={{ user, setUser }}>
      <HashRouter>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Password />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </HashRouter>
    </Usercontext.Provider>
  );
}

export default App;
