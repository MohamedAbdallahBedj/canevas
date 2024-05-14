import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Aviculture from "../components/TableComponents/EffectifsPetitesElevages/Aviculture";
import AvicultureAutres from "../components/TableComponents/EffectifsPetitesElevages/AvicultureAutres";
import Cuniculture from "../components/TableComponents/EffectifsPetitesElevages/Cuniculture";
import Apiculture from "../components/TableComponents/EffectifsPetitesElevages/Apiculture";
import Loading from "../components/Loading/Loading";

// listeCommunes
// aviculture
// aviculture
// aviculture
// aviculture
// avicultureAutres
// cuniculture
// apiculture
//
const tabs = [
  {
    label: "Poules Pondeuses",
    value: 0,
    suffix: "aviculture",
    type: 1,
    component: (campagne, data, refetch, loading, lookup, t) => (
      <Aviculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
        title={t("Poules Pondeuses")}
        type={1}
      />
    ),
  },
  {
    label: "Poulets de Chair",
    value: 1,
    suffix: "aviculture",
    type: 2,
    component: (campagne, data, refetch, loading, lookup, t) => (
      <Aviculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
        title={t("Poulets de Chair")}
        type={2}
      />
    ),
  },
  {
    label: "Reproducteurs",
    value: 2,
    suffix: "aviculture",
    type: 3,
    component: (campagne, data, refetch, loading, lookup, t) => (
      <Aviculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
        title={t("Reproducteurs")}
        type={3}
      />
    ),
  },
  {
    label: "Dindes",
    value: 3,
    suffix: "aviculture",
    type: 4,
    component: (campagne, data, refetch, loading, lookup, t) => (
      <Aviculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
        title={t("Dindes")}
        type={4}
      />
    ),
  },
  {
    label: "Autres Volailles",
    value: 4,
    suffix: "avicultureAutres",
    type: 5,
    component: (campagne, data, refetch, loading, lookup) => (
      <AvicultureAutres
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    ),
  },
  {
    label: "Cuniculture (Élevage de Lapin)",
    value: 5,
    suffix: "cuniculture",
    type: 6,
    component: (campagne, data, refetch, loading, lookup) => (
      <Cuniculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    ),
  },
  {
    label: "Apiculture (Élevage D'Abeilles)",
    value: 6,
    suffix: "apiculture",
    type: 7,
    component: (campagne, data, refetch, loading, lookup) => (
      <Apiculture
        campagne={campagne}
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    ),
  },
];
const EffectifsPetitesElevagesPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [fakeLoad, setFakeLoad] = React.useState(false);
  const [value, setValue] = React.useState(tabs[0]);

  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);

  const handleChange = (event, newValue) => {
    setFakeLoad(true);
    setTimeout(() => {
      setFakeLoad(false);
    }, 500);
    setValue(tabs.filter((item) => item.value === newValue)[0]);
  };

  var searchParamsCommunes = { table: "listeCommunes" };
  const communes = useFetch(
    "/api/evolution-effectif-animale-petites-elevage/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsCommunes, wilaya }
      : searchParamsCommunes
  );
  const is_rtl =
    localStorage.getItem("i18nextLng") === "ar" ||
    !localStorage.getItem("i18nextLng");

  const lookup = communes.data.map((row) => [
    row.id,
    row[`nomCommune${is_rtl ? "AR" : "FR"}`],
  ]);

  var searchParams = {
    table: value.suffix,
    annee: campagne,
    type: value.type,
  };
  const data = useFetch(
    "/api/evolution-effectif-animale-petites-elevage/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );

  if (communes.error || data.error) return <NotFound />;
  if (fakeLoad) return <Loading />;
  return (
    <>
      <Box
        sx={{ width: "100%", marginBlockEnd: 2, bgcolor: "background.paper" }}
        marginBlockEnd={1}
      >
        <Tabs value={value.value} onChange={handleChange} centered>
          {tabs.map(({ value, label }, index) => (
            <Tab key={`Tab ${index}`} value={value} label={t(label)} />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" marginBlockEnd={1}>
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
      {value?.component(
        data.campagne,
        data.data,
        data.refetch,
        data.loading,
        lookup,
        t
      )}
    </>
  );
};

export default EffectifsPetitesElevagesPage;
