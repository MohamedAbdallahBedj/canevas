import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack, TextField, Divider } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import BRQ from "../components/TableComponents/BRQ/BRQ";

const lookup = (t) => ({
  1: {
    1: t("Pomme de terre"),
    2: t("Tomate"),
    3: t("Oignon vert"),
    4: t("Oignon sec"),
    5: t("Ail vert"),
    6: t("Ail sec"),
  },
  2: {
    1: t("viande ovine"),
    2: t("viande bovine"),
    3: t("poulet de chair"),
    4: t("œuf de consommation"),
  },
});

const BRQPage = () => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id, role } = user;
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParams = { table: "brq" };
  if (date) searchParams.date = date;
  const { data, loading, error, refetch } = useFetch(
    "/api/brq/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );
  if (error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlockEnd={1}>
        <TextField
          value={date}
          onChange={(e) => setDate(e.target.value)}
          label={t("Date")}
          type="date"
          sx={{ minWidth: 250, mx: 1 / 2 }}
        />
        {id === 59 ? (
          <OptionsList
            label={t("Wilaya")}
            value={wilaya}
            setValue={setWilaya}
            options={wilayas.map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      {["AdminPV", "UtilisateurTechnique", "AdminGenerale"].includes(role) ? (
        <>
          <BRQ
            date={date}
            category={1}
            produitLookup={lookup(t)[1]}
            data={data.filter((item) => item.category === 1)}
            refetch={refetch}
            loading={loading}
            title={t(
              "Suivi de la mercuriale des prix (Produits d'origines végétales)"
            )}
          />
          <Divider sx={{ marginBlock: 5 }} />
        </>
      ) : (
        <></>
      )}
      {["AdminPA", "UtilisateurTechnique", "AdminGenerale"].includes(role) ? (
        <>
          <BRQ
            date={date}
            category={2}
            produitLookup={lookup(t)[2]}
            data={data.filter((item) => item.category === 2)}
            refetch={refetch}
            loading={loading}
            title={t(
              "Suivi de la mercuriale des prix (Produits d'origines animales)"
            )}
          />
          <Divider sx={{ marginBlock: 5 }} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BRQPage;
