import React from 'react'; 
import ReactDom from 'react-dom/client'; 
import Header from './components/Header';
import Login from './pages/Login';
import Recapped from './pages/Recapped';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './styles/styles.css';


let root : ReactDom.Root;
const element = document.getElementById('root');
if (element === null) {
    throw new Error("Root is null");
}else{
    root = ReactDom.createRoot(element);
}


root.render(
    <React.StrictMode>      
        <Router>
        <div className='color_background'>
        <Routes>
            <Route path = '/' element = {<Login />} />
            <Route path = '/pages/Recapped/:username' element = {<Recapped />} />
        </Routes>
        </div>
        </Router>
        
    </React.StrictMode>
);
