import React from 'react'; 
import ReactDom from 'react-dom/client'; 
import Home from './pages/Home'; 
import Header from './components/Header';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './styles/styles.css';


let root : ReactDom.Root;
const elem = document.getElementById('root'); 
if (elem === null) {
    throw new Error("Root is null");
}else{
    root = ReactDom.createRoot(elem);
}


root.render(
    <React.StrictMode>      
        <Router>
        <div className='color_background'>
            <Header />
        <Routes>
            <Route path = '/' element = {<Home />} />
            <Route path = "/Login" element = {<Login />} />
        </Routes>
        </div>
        </Router>
        
    </React.StrictMode>
);
