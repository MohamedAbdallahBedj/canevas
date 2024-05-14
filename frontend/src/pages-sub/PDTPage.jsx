import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import PDT from "../components/TableComponents/PDT/PDT";
import Loading from "../components/Loading/Loading";
const tabs = [
  {
    value: 0,
    label: "Saison ",
    suffix: "S",
  },
  {
    value: 1,
    label: "Arrière Saison ",
    suffix: "AS",
  },
  {
    value: 2,
    label: "Primeur ",
    suffix: "P",
  },
];

const PDTPage = ({ campagnes }) => {
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [fakeLoad, setFakeLoad] = React.useState(false);
  const [value, setValue] = React.useState(tabs[0]);
  const { t } = useTranslation();
  const [wilaya, setWilaya] = React.useState(id);
  const [campagne, setCampagne] = React.useState(
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
    table: "pdtSuivi" + value.suffix,
    annee: campagne,
  };

  const suivi = useFetch(
    "/api/ail/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsS, wilaya }
      : searchParamsS
  );

  if (fakeLoad) return <Loading />;
  if (suivi.error) return <NotFound />;
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
      <PDT
        type={value.label}
        relation={"ailSuivi" + value.suffix}
        campagne={campagne}
        data={suivi?.data}
        refetch={suivi?.refetch}
        loading={suivi?.loading}
      />
    </>
  );
};

export default PDTPage;
