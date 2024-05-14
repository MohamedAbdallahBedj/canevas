import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import AC from "../components/TableComponents/Vaccination/AC";
import AR from "../components/TableComponents/Vaccination/AR";
import FA from "../components/TableComponents/Vaccination/FA";
import PPR from "../components/TableComponents/Vaccination/PPR";
import Loading from "../components/Loading/Loading";

const tabs = [
  {
    label: "Anti Clavelée",
    value: 0,
    suffix: "AC",
    component: (campagne, data, refetch, loading) => (
      <AC campagne={campagne} data={data} refetch={refetch} loading={loading} />
    ),
  },
  {
    label: "Anti Rabique",
    value: 1,
    suffix: "AR",
    component: (campagne, data, refetch, loading) => (
      <AR campagne={campagne} data={data} refetch={refetch} loading={loading} />
    ),
  },
  {
    label: "Fiévre Aphteuse",
    value: 2,
    suffix: "FA",
    component: (campagne, data, refetch, loading) => (
      <FA campagne={campagne} data={data} refetch={refetch} loading={loading} />
    ),
  },
  {
    label: "Peste des Petits Ruminants",
    value: 3,
    suffix: "PPR",
    component: (campagne, data, refetch, loading) => (
      <PPR
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    ),
  },
];

const VaccinationPage = ({ campagnes }) => {
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
  // Suivis
  var searchParams1 = {
    table: "campagneVaccination" + value.suffix,
    annee: campagne,
  };

  const data = useFetch(
    "/api/campagne-de-vaccination/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  if (fakeLoad) return <Loading />;
  if (data.error) return <NotFound />;

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
      {value?.component(data.campagne, data.data, data.refetch, data.loading)}
    </>
  );
};

export default VaccinationPage;
