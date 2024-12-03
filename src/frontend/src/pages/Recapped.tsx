import '../styles/styles.css'
import React from 'react';
import DataString from '../components/DataString'
import {useLocation} from 'react-router-dom'
import ProtectRoutes, {ProtectUserRoutes} from "../components/ProtectRoutes";


/**
 * Creates the elements for the Recapped Page
 * Contains methods that return each String to be displayed, calls {@link DataString} on each of these
 *@Returns the elements for the recapped page
 */
function Recapped () {

    // Checks that url is user specific
    const location = useLocation();
    if (ProtectUserRoutes(location.pathname) != null){
        return ProtectUserRoutes(location.pathname)
    }

    function function1() {
        return "value 1";
      }
    
      function function2() {
        return "Value 2";
      }
    
      function function3() {
        return "Value 3";
      }
    
      function function4() {
        return "Value 4";
      }
    
      function function5() {
        return "Value 5";
      }
    
    return (
       <div className='Recapped' >
        <div className ='container'>
            
            <div className='test1'>
            <DataString functions={function1} />
            </div>

            <div className='test2'>
            <DataString functions={function2}/>
            </div>


            <div className='test3'>
            <DataString functions={function3} />
            </div>

            <div className='test4'>
            <DataString functions={function4}/>
            </div>

            <div className='test5'>
            <DataString functions={function5}/>
            </div>
            </div>
       </div> 
    )

}


export default Recapped;