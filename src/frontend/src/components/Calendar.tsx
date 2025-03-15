import * as React from 'react';
import dayjs, {Dayjs} from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

interface CalendarProps {
    onChange?: (date : Date) => void;
}

// Following https://mui.com/x/react-date-pickers/date-calendar/
function Calendar({onChange} : CalendarProps) {
    const onDateChange = (date : Dayjs) => {
        if (onChange){
            onChange(date.toDate());
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                defaultValue={dayjs('2025-01-01')}
                minDate = {dayjs('2025-01-01')}
                maxDate = {dayjs('2025-12-31')}
                views={['day', 'month']}
                sx = {{
                    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0)',
                    // borderRadius: '5px',
                }}
            />
        </LocalizationProvider>
    );
}

export default Calendar;
