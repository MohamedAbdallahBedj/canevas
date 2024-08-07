import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
const Acceuil = () => {
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const { t } = useTranslation();
  const wilayas = [
    "",
    t("Adrar"),
    t("Chlef"),
    t("Laghouat"),
    t("OumElBouaghi"),
    t("Batna"),
    t("Béjaïa"),
    t("Biskra"),
    t("Béchar"),
    t("Blida"),
    t("Bouira"),
    t("Tamanrasset"),
    t("Tébessa"),
    t("Tlemcen"),
    t("Tiaret"),
    t("TiziOuzou"),
    t("Alger"),
    t("Djelfa"),
    t("Jijel"),
    t("Sétif"),
    t("Saïda"),
    t("Skikda"),
    t("SidiBelAbbès"),
    t("Annaba"),
    t("Guelma"),
    t("Constantine"),
    t("Médéa"),
    t("Mostaganem"),
    t("M’sila"),
    t("Mascara"),
    t("Ouargla"),
    t("Oran"),
    t("ElBayadh"),
    t("Illizi"),
    t("BordjBouArreridj"),
    t("Boumerdès"),
    t("ElTaref"),
    t("Tindouf"),
    t("Tissemsilt"),
    t("ElOued"),
    t("Khenchela"),
    t("Souk Ahras"),
    t("Tipaza"),
    t("Mila"),
    t("AïnDefla"),
    t("Naâma"),
    t("AïnTémouchent"),
    t("Ghardaïa"),
    t("Relizane"),
    t("ElMGhair"),
    t("ElMeniaa"),
    t("OuledDjellal"),
    t("BordjBadjiMokhtar"),
    t("BéniAbbès"),
    t("Timimoun"),
    t("Touggourt"),
    t("Djanet"),
    t("InSalah"),
    t("InGuezzam"),
    t("Chambre Nationale de l'Agriculture"),
  ];

  return (
    <div>
      <Typography variant="h3" component="h3" align="center" gutterBottom>
        {t("Bienvenue dans la Plateforme de Gestion des Canevas et Suivis")}
      </Typography>
      <Divider />
      <Typography variant="h4" component="h4" align="center">
        {wilayas[id]}
      </Typography>
      <Stack direction="row" mt={5} alignItems="center" gap={2}>
        <LockResetIcon sx={{ fontSize: 32 }} />
        <Typography variant="h6" component="h6">
          {t(
            "Afin de renforcer la sécurité de votre compte utilisateur. Vous pouvez maintenant modifier votre mot de passe."
          ) + "  "}
          <Link to={"/parametres"}>{t(" en cliquant ici")}</Link>
        </Typography>
      </Stack>
    </div>
  );
};

export default Acceuil;
