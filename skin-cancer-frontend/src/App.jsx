import React, { useState } from "react";
import Registration from "./components/registration";
import AppDashboard from "./AppDashboard"; 

function App() {
  const [loggedIn, setLoggedIn] = useState(true); // Set to true for testing purposes

  return loggedIn ? (
    <AppDashboard />
  ) : (
    <Registration onLoginSuccess={() => setLoggedIn(true)} />
  );
}

export default App;
