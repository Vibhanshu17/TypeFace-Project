import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./Auth/AuthContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

function App() {
  const context = useContext(AuthContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { isAuthenticated } = context;
  const token = localStorage.getItem("token");

  return <>
  {(isAuthenticated || token) ? <Home /> : <Login />}
  </>;
}

export default App;
