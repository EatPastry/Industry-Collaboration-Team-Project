import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

// Following https://mui.com/material-ui/react-slider/
function DateSlider() {

    function getDate(day : number){
        const start2025 = new Date(2025, 0, 1);
        const date = new Date(start2025.valueOf() + (day - 1) * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString();
    }

    return (
        <Box sx={{ width: '75%', height : '75%'  }}>
            <Slider
                aria-label="Date"
                defaultValue={366}
                valueLabelDisplay="auto"
                marks
                min={1}
                max={365}
                valueLabelFormat={(day) => getDate(day)}
                color = "secondary"
            />
        </Box>
    );
}

export default DateSlider
