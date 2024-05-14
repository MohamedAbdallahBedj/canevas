import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        gap: 4,
      }}
    >
      <Typography variant="h1">
        {t("Erreur 404")}{" "}
        <ErrorIcon style={{ height: "60px", width: "60px" }} />
      </Typography>
      <Typography variant="h4">{t("Page non trouvée")}</Typography>
      <Typography variant="h4">
        {t("Cliquez sur le bouton pour revenir à l'accueil")}
      </Typography>
      <Link style={{ textDecoration: "none", marginBlockStart: "10px" }} to="/">
        <Button startIcon={<HomeIcon />} variant="contained" color="primary">
          {t("Accueil")}
        </Button>
      </Link>
    </div>
  );
};
export default NotFound;
