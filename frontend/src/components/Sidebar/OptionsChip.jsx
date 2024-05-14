import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import i18next from "i18next";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Settings from "@mui/icons-material/Settings";
import { useTranslation } from "react-i18next";
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// const useStyles = makeStyles((theme) => ({
//   expandMoreI: {
//     color: "white",
//     borderColor: "white",
//   },
//   accountChip: {
//     color: "white",
//     borderColor: "white",
//     paddingInline:
//       localStorage.getItem("i18nextLng") === "ar" ? "8px 2px" : null,
//     fontSize: "18px",
//   },
//   settingsI: { marginInlineEnd: "5px" },
//   usernameChip: {
//     display: "flex",
//     [theme.breakpoints.down("sm")]: {
//       justifyContent: "flex-start",
//     },
//     [theme.breakpoints.up("sm")]: {
//       justifyContent: "flex-end",
//     },
//   },
//   languageMenu: {
//     minWidth: "100px",
//     maxHeight: "40px",
//   },
//   logoutBtn: {
//     backgroundColor: "#FF0000",
//     "&:hover": {
//       background: "#8b0000",
//     },
//     color: "#fff",
//     textTransform: "none",
//     margin: "0 1.5px",
//   },
//   parametersBtn: {
//     margin: "0 1.5px",
//   },
// }));

const OptionsChip = () => {
  const { t } = useTranslation();
  const { logout, user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const languages = [
    { code: "ar", name: "العربية", dir: "rtl", country_code: "sa" },
    { code: "fr", name: "Français", country_code: "fr", dir: "ltr" },
  ];
  const currentLanguageCode = localStorage.getItem("i18nextLng") || "ar";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout_ = async (e) => {
    e.preventDefault();
    try {
      logout();
      // toast.info(t("Déconnecté"), { autoClose: 2000, hideProgressBar: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Box>
      <Chip
        icon={<ExpandMoreIcon color="white" />}
        label={user?.nomUtilisateur}
        variant="outlined"
        onClick={handleClick}
        sx={{
          fontWeight: 500,
          fontSize: 16,
          px: 1 / 2,
          color: "white",
          borderColor: "white",
        }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <FormControl variant="outlined">
            <InputLabel>{t("Langue")}</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentLanguageCode}
              label={t("Langue")}
              onChange={(e) => {
                i18next.changeLanguage(e.target.value);
                document.location.reload(true);
              }}
            >
              {languages.map(({ code, name, country_code }) => (
                <MenuItem key={country_code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", gap: 1, fontWeight: 500 }}
          onClick={() => {
            navigate("/parametres");
            handleClose();
          }}
        >
          <Settings sx={{ fontSize: 16 }} />
          {t("Parametres")}
        </MenuItem>
        <MenuItem
          onClick={(e) => logout_(e)}
          sx={{ display: "flex", gap: 1, color: "red", fontWeight: 500 }}
        >
          <ExitToAppIcon sx={{ fontSize: 16 }} />
          {t("Se déconnecter")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OptionsChip;
