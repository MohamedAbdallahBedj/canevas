import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack, Divider } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import CartesFellah from "../components/TableComponents/CartesFellah/CartesFellah";
import LivraisonCartes from "../components/TableComponents/CartesFellah/LivraisonCartes";

const CartesFellahPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [campagne2, setCampagne2] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  const [wilaya2, setWilaya2] = React.useState(id);

  var searchParams = { table: "consommationCartes", annee: campagne };
  var searchParams2 = { table: "livraisonCartes", annee: campagne2 };

  const consommationCartes = useFetch(
    "/api/cartes-fellah/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );

  const livraisonCartes =
    id === 59
      ? useFetch(
          "/api/cartes-fellah/table",
          "GET",
          ![59, 0].includes(parseInt(wilaya2))
            ? { ...searchParams2, wilaya2 }
            : searchParams2
        )
      : {};
  if (consommationCartes.error || livraisonCartes.error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlockEnd={1}>
        <OptionsList
          label={t("Année")}
          value={campagne}
          setValue={setCampagne}
          options={campagnes.map((item) => ({
            label: `${item}`,
            value: item,
          }))}
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
      <CartesFellah
        campagne={campagne}
        data={consommationCartes.data}
        refetch={consommationCartes.refetch}
        loading={consommationCartes.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      {id === 59 ? (
        <Stack direction="row" marginBlockEnd={1}>
          <OptionsList
            label={t("Année")}
            value={campagne2}
            setValue={setCampagne2}
            options={campagnes.map((item) => ({
              label: `${item}`,
              value: item,
            }))}
          />
          {id === 59 ? (
            <OptionsList
              label={t("Wilaya")}
              value={wilaya2}
              setValue={setWilaya2}
              options={wilayas.map((item, index) => ({
                label: t(item),
                value: index,
              }))}
            />
          ) : (
            <></>
          )}
        </Stack>
      ) : (
        <></>
      )}
      <LivraisonCartes
        campagne={campagne2}
        data={livraisonCartes.data}
        refetch={livraisonCartes.refetch}
        loading={livraisonCartes.loading}
      />
    </>
  );
};

export default CartesFellahPage;
