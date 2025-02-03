import React from 'react';
import ReactDom from 'react-dom/client';
import Login from './pages/Login';
import Recapped from './pages/Recapped';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import ProtectRoutes from './components/ProtectRoutes';
import SignUp from "./pages/SignUp";


let root : ReactDom.Root;
const element = document.getElementById('root');
if (element === null) { //Check that the root of the DOM exists, else throw an error
    throw new Error("Root is null");
}else{
    root = ReactDom.createRoot(element);
}


// Renders the application into the root
// Defines the landing page and other potential routes so that pages don't need to be loaded on navigation
root.render(
    <React.StrictMode>
        <div className='colorBackground'>
            <Router>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/SignUp' element={<SignUp/>}/>
                    <Route path='/pages/Recapped/:username' element={
                        <ProtectRoutes>
                            <Recapped/>
                        </ProtectRoutes>
                    }
                    />
                </Routes>
            </Router>
        </div>
    </React.StrictMode>
);
