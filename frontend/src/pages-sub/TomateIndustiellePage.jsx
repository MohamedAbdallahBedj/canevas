import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Previsions from "../components/TableComponents/TomateIndustrielle/Previsions";
import Suivi from "../components/TableComponents/TomateIndustrielle/Suivi";

const TomateIndustiellePage = ({ campagnes }) => {
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
  // Prévisions
  var searchParamsP = {
    table: "tomateIndustriellePrevision",
    annee: campagne,
  };

  const prevision = useFetch(
    "/api/tomate-industrielle/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsP, wilaya }
      : searchParamsP
  );
  // Suivi
  var searchParamsS = {
    table: "tomateIndustrielleSuivi",
    annee: campagne2,
  };

  const suivi = useFetch(
    "/api/tomate-industrielle/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParamsS, wilaya2 }
      : searchParamsS
  );
  if (prevision.error || suivi.error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne}
          setValue={setCampagne}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
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
      <Previsions
        campagne={campagne}
        data={prevision?.data}
        refetch={prevision?.refetch}
        loading={prevision?.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne2}
          setValue={setCampagne2}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
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
      <Suivi
        campagne={campagne2}
        data={suivi?.data}
        refetch={suivi?.refetch}
        loading={suivi?.loading}
      />
    </>
  );
};

export default TomateIndustiellePage;
