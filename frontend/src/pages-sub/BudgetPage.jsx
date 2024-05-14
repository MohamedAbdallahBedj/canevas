import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack, Box, Divider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import budget from "../json/budget.json";
import Budget from "../components/TableComponents/Budget/Budget";
import Loading from "../components/Loading/Loading";
import Calendrier from "../components/TableComponents/Budget/Calendrier";
const keys = Object.keys(budget);

const BudgetPage = ({ campagnes }) => {
  const [value, setValue] = React.useState(keys[0]);
  const [fakeLoad, setFakeLoad] = React.useState(false);
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParams = { table: "budget", annee: campagne };
  var searchParams2 = { table: "calendrier", annee: campagne };
  const { data, loading, error, refetch } = useFetch(
    "/api/budget/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );

  const calendrier = useFetch(
    "/api/budget/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams2, wilaya }
      : searchParams2
  );
  const handleChange = (event, newValue) => {
    setFakeLoad(true);
    setTimeout(() => {
      setFakeLoad(false);
    }, 500);
    setValue(newValue);
  };
  if (error) return <NotFound />;
  if (fakeLoad) return <Loading />;
  return (
    <>
      <Box
        sx={{ width: "100%", bgcolor: "background.paper" }}
        marginBlockEnd={1}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            value={keys[0]}
            label={t("Chapitre premier : Budget de gestion")}
          />
          <Tab
            value={keys[1]}
            label={t("Chapitre deux : Budget d'équipement")}
          />
          <Tab value={keys[2]} label={t("Calendrier budgétaire général")} />
        </Tabs>
      </Box>
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

      {Object.keys(budget[value]).map((key, index) => (
        <Box key={`Depense ${index}`}>
          <Budget
            campagne={campagne}
            data={data.filter(
              (row) =>
                row.type === budget[key].type &&
                row.category === budget[key].category
            )}
            refetch={refetch}
            loading={loading}
            title={budget[value][key].category}
            designationLookup={Object.fromEntries(
              budget[value][key].list.map((item) => [item, item])
            )}
          />
          <Divider sx={{ marginBlock: 5 }} />
        </Box>
      ))}
      {value === "calendrier" ? (
        <></>
      ) : (
        <Calendrier
          campagne={campagne}
          data={calendrier.data}
          refetch={calendrier.refetch}
          loading={calendrier.loading}
        />
      )}
    </>
  );
};

export default BudgetPage;
