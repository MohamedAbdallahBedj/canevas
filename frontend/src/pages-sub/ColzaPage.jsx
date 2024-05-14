import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Colza from "../components/TableComponents/Colza/Colza";
import ColzaMoissonBattage from "../components/TableComponents/Colza/ColzaMoissonBattage";

const ColzaPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParamsS = {
    table: "colzaSuivi",
    annee: campagne,
  };
  var searchParamsMB = {
    table: "suiviMoissonBattageColza",
    annee: campagne,
  };
  const colza = useFetch(
    "/api/colza/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsS, wilaya }
      : searchParamsS
  );
  const moissonBattage = useFetch(
    "/api/colza/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsMB, wilaya }
      : searchParamsMB
  );
  if (colza.error || moissonBattage.error) return <NotFound />;

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
      <Colza
        campagne={campagne}
        data={colza?.data}
        refetch={colza?.refetch}
        loading={colza?.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <ColzaMoissonBattage
        campagne={campagne}
        data={moissonBattage?.data}
        refetch={moissonBattage?.refetch}
        loading={moissonBattage?.loading}
      />
    </>
  );
};

export default ColzaPage;
