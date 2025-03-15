import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// Using https://mui.com/x/react-date-pickers/date-calendar/
function Calendar() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                defaultValue={dayjs('2025-01-01')}
                minDate = {dayjs('2025-01-01')}
                maxDate = {dayjs('2025-12-31')}
                views={['day', 'month']}
                sx = {{
                    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    borderRadius: '5px',
                }}
            />
        </LocalizationProvider>
    );
}

export default Calendar;
