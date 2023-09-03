import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ComponentProps } from "react";
import dayjs from "dayjs";

function DateBox(props: ComponentProps<typeof DatePicker>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker {...props} value={dayjs(props.value as Date)} />
    </LocalizationProvider>
  );
}

export default DateBox;
