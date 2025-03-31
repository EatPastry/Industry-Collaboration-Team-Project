import ReactDom from 'react-dom/client';
import Login from './pages/Login';
import Recapped from './pages/Recapped';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import ProtectRoutes from './components/ProtectRoutes';
import SignUp from "./pages/SignUp";
import MenuBar from "./components/MenuBar";
import TransactionHub from "./pages/TransactionHub";
import React, { useEffect } from "react";
import "./styles/styles.css";
import { Gradient } from "./assets/gradient";
import Story from "./pages/Story";

let root: ReactDom.Root;
const element = document.getElementById("root");
if (element === null) {
  throw new Error("Root is null");
} else {
  root = ReactDom.createRoot(element);
}

const Background = () => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas"); // attach to canvas

    return () => {

    };
  }, []);

  return (
    <canvas
      id="gradient-canvas"
      className="gradient-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1, // behind everything
      }}
    />
  );
};

root.render(
    <div className="app-container">
      <Background />
      <Router>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/SignUp' element={<SignUp/>}/>

            <Route element={<ProtectRoutes><MenuBar/></ProtectRoutes>}>
                <Route path='/pages/Recapped/:username' element={<Recapped/>}></Route>
                <Route path='/pages/TransactionHub/:username' element={<TransactionHub/>}></Route>
            </Route>

            <Route path='/pages/Story/:username' element={
                <ProtectRoutes>
                    <Story/>
                </ProtectRoutes>
            }
            />

        </Routes>
      </Router>
    </div>
);
