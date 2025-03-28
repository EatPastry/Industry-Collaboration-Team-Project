import React from 'react'; 
import ReactDom from 'react-dom/client'; 
import Login from './pages/Login';
import Recapped from './pages/Recapped';
import Overview from './pages/Overview';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import ProtectRoutes from './components/ProtectRoutes';
import SignUp from "./pages/SignUp";
import MenuBar from "./components/MenuBar";
import TransactionHub from "./pages/TransactionHub";


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
     <div className='color_background'>
            <Router>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/SignUp' element={<SignUp/>}/>

                    <Route element={<ProtectRoutes><MenuBar/></ProtectRoutes>}>
                        <Route path='/pages/Recapped/:username' element={<Recapped/>}></Route>
                        <Route path='/pages/Overview/:username' element={<Overview/>}></Route>
                        <Route path='/pages/TransactionHub/:username' element={<TransactionHub/>}></Route>
                    </Route>

                </Routes>
            </Router>
            </div>
    </React.StrictMode>
);
