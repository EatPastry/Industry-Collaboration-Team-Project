import * as React from 'react';
import dayjs, {Dayjs} from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// Prop such onChange function is called when new date selected in the calendar
interface CalendarProps {
    onChange?: (date : Date) => void;
}

// Calendar component following MUI documentation : https://mui.com/x/react-date-pickers/date-calendar/
function Calendar({onChange} : CalendarProps) {
    // Calls the parents onChange function (in TransactionHub)
    const onDateChange = (date : Dayjs) => {
        if (onChange){
            onChange(date.toDate());
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                defaultValue={dayjs('2025-01-01')}  // initial calendar date
                // Calendar only displays 2025
                minDate = {dayjs('2025-01-01')}
                maxDate = {dayjs('2025-12-31')}
                views={['day', 'month']}
                // Calls onDateChange when new date is selected
                onChange={onDateChange}
            />
        </LocalizationProvider>
    );
}

export default Calendar;
