import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

const EditPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pass, setPass] = React.useState("");
  const [passRe, setPassRe] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const oldPass = e.target.oldPass.value;
    if (oldPass === pass)
      return toast.error(
        "L'ancien mot de passe ne peut plus être utilisé, veuillez modifier le mot de passe.",
        {
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
    if (pass.length < 6)
      return toast.error(
        "Le nouveau mot de passe doit être composé d'au moins 6 caractères",
        {
          autoClose: 2000,
          hideProgressBar: true,
        }
      );

    fetch("/api/auth/password", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPass: oldPass,
        newPass: pass,
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
        navigate("/");
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
          {t("Changez le mot de passe de votre compte")}
        </Typography>
        <TextField
          name="oldPass"
          sx={{ minWidth: 250, mx: 1 / 2 }}
          variant="outlined"
          label={t("Ancien mot de passe")}
          type="password"
          required
        />
        <TextField
          sx={{ minWidth: 250, mx: 1 / 2 }}
          variant="outlined"
          label={t("Nouveau mot de passe")}
          type="password"
          required
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        <TextField
          sx={{ minWidth: 250, mx: 1 / 2 }}
          variant="outlined"
          label={t("Ré-entrez le nouveau mot de passe")}
          type="password"
          required
          error={pass !== passRe}
          value={passRe}
          onChange={(e) => {
            setPassRe(e.target.value);
          }}
        />
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

export default EditPassword;
