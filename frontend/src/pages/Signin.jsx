import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AuthContext from "../context/AuthContext";

const languages = [
  { code: "ar", name: "العربية", dir: "rtl", country_code: "sa" },
  { code: "fr", name: "Français", country_code: "fr", dir: "ltr" },
];

const Signin = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let { login } = useContext(AuthContext);

  const currentLanguageCode = localStorage.getItem("i18nextLng") || "ar";

  const logingBtnClicked = async (e) => {
    e.preventDefault();

    if (!username)
      toast.error(t("Nom d'utilisateur est vide"), {
        autoClose: 2000,
        hideProgressBar: true,
      });
    else if (!password)
      toast.error(t("Mot de passe est vide"), {
        autoClose: 2000,
        hideProgressBar: true,
      });
    else {
      login(username, password);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 2,
            mx: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <FormControl variant="outlined">
              <InputLabel>{t("Langue")}</InputLabel>
              <Select
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
          </Box>
          <img
            style={{ aspectRatio: "1", maxWidth: 150, marginBottom: 20 }}
            src="/cnalogo.png"
            alt="cna"
          />
          <Typography
            component="h4"
            variant="h4"
            align="center"
            fontWeight={500}
          >
            {t("Bienvenue dans la Plateforme de Gestion des Canevas et Suivis")}
          </Typography>
          <Typography component="h6" variant="h6" align="center">
            {t("Veuillez s'identifier")}
          </Typography>
          <Box noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label={t("Nom d'Utilisateur")}
              name="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label={t("Mot de Passe")}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              onClick={logingBtnClicked}
            >
              {t("Sidentifier")}
            </Button>
            <Box marginTop={2}>
              <Typography variant="body1" color="textSecondary" align="center">
                {" © "}
                {t("Chambre Nationale de l'Agriculture")}
                {" - "}
                {new Date().getFullYear()}
                {""}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/cnaboard.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
};
export default Signin;
