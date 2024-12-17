import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Divider, Stack, Tab, Tabs } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Ail from "../components/TableComponents/Ail/Ail";
import Bilan from "../components/TableComponents/Ail/Bilan";
import Loading from "../components/Loading/Loading";

const tabs = [
  {
    value: 0,
    label: "Saison ",
    suffix: "",
  },
  {
    value: 1,
    label: "Arrière Saison ",
    suffix: "AS",
  },
];

const AilPage = ({ campagnes }) => {
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [fakeLoad, setFakeLoad] = React.useState(false);
  const [value, setValue] = React.useState(tabs[0]);
  const { t } = useTranslation();
  const [wilaya, setWilaya] = React.useState(id);
  const [wilaya2, setWilaya2] = React.useState(id);
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [campagne2, setCampagne2] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );

  const handleChange = (event, newValue) => {
    setFakeLoad(true);
    setTimeout(() => {
      setFakeLoad(false);
    }, 500);
    setValue(tabs.filter((item) => item.value === newValue)[0]);
  };
  // Suivis
  var searchParamsS = {
    table: "ailSuivi" + value.suffix,
    annee: campagne,
  };

  const suivi = useFetch(
    "/api/ail/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsS, wilaya }
      : searchParamsS
  );

  // Bilans
  var searchParamsB = {
    table: "ailBilan" + value.suffix,
    annee: campagne2,
  };

  const bilan = useFetch(
    "/api/ail/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParamsB, wilaya: wilaya2 }
      : searchParamsB
  );
  if (fakeLoad) return <Loading />;
  if (suivi.error || bilan.error) return <NotFound />;
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
      <Ail
        type={value.label}
        relation={"ailSuivi" + value.suffix}
        campagne={campagne}
        data={suivi?.data}
        refetch={suivi?.refetch}
        loading={suivi?.loading}
      />
      <Divider sx={{ marginBlock: 2 }} />
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
      <Bilan
        type={value.label}
        relation={"ailBilan" + value.suffix}
        campagne={campagne2}
        data={bilan?.data}
        refetch={bilan?.refetch}
        loading={bilan?.loading}
      />
    </>
  );
};

export default AilPage;
