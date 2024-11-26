import '../styles/styles.css'
import React from 'react';
import DataString from '../components/DataString'



function Recapped () {
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