import { deepOrange, green } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: localStorage.getItem("i18nextLng") === "fr" ? "ltr" : "rtl",
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: deepOrange["A400"],
    },
  },
  typography: {
    fontFamily: ["Tajawal", "sans-serif"].join(","),
  },
});
export default theme;
