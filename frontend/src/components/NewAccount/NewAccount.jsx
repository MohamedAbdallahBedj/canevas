import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import OptionsList from "../OptionsList/OptionsList";
import wilayas from "./../../json/wilayas.json";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
// wilayas[0] = "CNA";

const roles = {
  admins: [
    "AdminGenerale",
    "AdminPV",
    "AdminPA",
    "AdminDOP",
    "AdminVul",
    "AdminCom",
    "AdminPVR",
    "AdminFR",
    "AdminFinance",
    "AdminCarte",
    "AdminRH",
  ],
  users: ["UtilisateurTechnique", "UtilisateurFinance"],
};

const NewAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [wilaya, setWilaya] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nomUtilisateur = e.target.nomUtilisateur.value;
    const motDePasse = e.target.motDePasse.value;
    const role = e.target.role.value;
    fetch("/api/auth/register", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomUtilisateur: nomUtilisateur,
        motDePasse: motDePasse,
        status: role,
        idWilaya: wilaya !== 0 ? wilaya : 59,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error(response.statusText, {
            autoClose: 2000,
            hideProgressBar: true,
          });
          throw new Error(response.statusText);
        }

        toast.success(t("Succès"), {
          autoClose: 2000,
          hideProgressBar: true,
        });
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) return <Loading />;
  return (
    <>
      <Stack
        gap={2}
        width={"50%"}
        marginInline="auto"
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Typography
          variant="h4"
          component="h4"
          fontWeight="medium"
          align="center"
        >
          {t("Ajouter un compte")}
        </Typography>
        <OptionsList
          label={t("Wilaya")}
          value={wilaya}
          setValue={setWilaya}
          options={wilayas.map((item, index) => ({
            label: t(index === 0 ? "CNA" : item),
            value: index,
          }))}
        />
        <TextField
          sx={{ minWidth: 250, mx: 1 / 2 }}
          variant="outlined"
          label={t("Nom d'Utilisateur")}
          required
          name="nomUtilisateur"
        />
        <TextField
          sx={{ minWidth: 250, mx: 1 / 2 }}
          variant="outlined"
          label={t("Mot de Passe")}
          type="password"
          required
          name="motDePasse"
        />
        <TextField
          select
          label={t("Role")}
          name="role"
          sx={{ minWidth: 250, mx: 1 / 2 }}
          defaultValue={""}
        >
          {roles.admins.map((option) => (
            <MenuItem
              key={`role ${option}`}
              value={option}
              disabled={parseInt(wilaya) !== 0}
            >
              {option}
            </MenuItem>
          ))}
          {roles.users.map((option) => (
            <MenuItem
              key={`role ${option}`}
              value={option}
              disabled={parseInt(wilaya) === 0}
            >
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button
            sx={{ minWidth: 150 }}
            variant="contained"
            color="error"
            onClick={() => {
              navigate(-1);
            }}
          >
            {t("Annuler")}
          </Button>
          <Button
            type="submit"
            sx={{ minWidth: 150 }}
            variant="contained"
            color="primary"
          >
            {t("Ajouter")}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default NewAccount;
