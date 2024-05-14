import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import CerealesLabourseSemaille from "../components/TableComponents/CerealesLabourseSemaille/CerealesLabourseSemaille";
import CerealesMoissonBattage from "../components/TableComponents/CerealesMoissonBattage/CerealesMoissonBattage";

const CerealesPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParamsLS = {
    table: "suiviLaboursSemaillesCereales",
    annee: campagne,
  };
  var searchParamsMB = {
    table: "suiviMoissonBattageCereales",
    annee: campagne,
  };
  const laboursSemaille = useFetch(
    "/api/cereales/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsLS, wilaya }
      : searchParamsLS
  );
  const moissonBattage = useFetch(
    "/api/cereales/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsMB, wilaya }
      : searchParamsMB
  );
  if (laboursSemaille.error || moissonBattage.error) return <NotFound />;

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
      <CerealesLabourseSemaille
        campagne={campagne}
        data={laboursSemaille?.data}
        refetch={laboursSemaille?.refetch}
        loading={laboursSemaille?.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <CerealesMoissonBattage
        campagne={campagne}
        data={moissonBattage?.data}
        refetch={moissonBattage?.refetch}
        loading={moissonBattage?.loading}
      />
    </>
  );
};

export default CerealesPage;
