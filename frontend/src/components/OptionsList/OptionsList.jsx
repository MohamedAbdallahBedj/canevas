import { TextField } from "@mui/material";

const OptionsList = ({ label, value, setValue, options }) => {
  return (
    <TextField
      variant="outlined"
      sx={{ minWidth: 250, mx: 1 / 2 }}
      select
      label={label}
      SelectProps={{
        native: true,
      }}
      defaultValue={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    >
      {options.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </TextField>
  );
};

export default OptionsList;
