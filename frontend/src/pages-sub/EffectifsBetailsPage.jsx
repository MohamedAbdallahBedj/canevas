import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Bovin from "../components/TableComponents/EffectifsBetails/Bovin";
import Ovin from "../components/TableComponents/EffectifsBetails/Ovin";
import Caprin from "../components/TableComponents/EffectifsBetails/Caprin";
import Camelin from "../components/TableComponents/EffectifsBetails/Camelin";
import Equin from "../components/TableComponents/EffectifsBetails/Equin";
import Loading from "../components/Loading/Loading";

const tabs = [
  {
    label: "Effectif Bovin",
    value: 0,
    suffix: "Bovin",
    component: (campagne, data, refetch, loading, lookup) => (
      <Bovin
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
        idCommuneLookup={Object.fromEntries(lookup)}
      />
    ),
  },
  {
    label: "Effectif Ovin",
    value: 1,
    suffix: "Ovin",
    component: (campagne, data, refetch, loading, lookup) => (
      <Ovin
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
        idCommuneLookup={Object.fromEntries(lookup)}
      />
    ),
  },
  {
    label: "Effectif Caprin",
    value: 2,
    suffix: "Caprin",
    component: (campagne, data, refetch, loading, lookup) => (
      <Caprin
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
        idCommuneLookup={Object.fromEntries(lookup)}
      />
    ),
  },
  {
    label: "Effectif Camelin",
    value: 3,
    suffix: "Camelin",
    component: (campagne, data, refetch, loading, lookup) => (
      <Camelin
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
        idCommuneLookup={Object.fromEntries(lookup)}
      />
    ),
  },
  {
    label: "Effectif Equin",
    value: 4,
    suffix: "Equin",
    component: (campagne, data, refetch, loading, lookup) => (
      <Equin
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
        idCommuneLookup={Object.fromEntries(lookup)}
      />
    ),
  },
];

const EffectifsBetailsPage = ({ campagnes }) => {
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
    "/api/evolution-effectif-animale-betail/table",
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

  var searchParams1 = { table: "effectif" + value.suffix, annee: campagne };
  const data = useFetch(
    "/api/evolution-effectif-animale-betail/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
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
        campagne,
        data.data,
        data.refetch,
        data.loading,
        lookup
      )}
    </>
  );
};

export default EffectifsBetailsPage;
