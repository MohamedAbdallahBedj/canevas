import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import LaboursSemaille from "../components/TableComponents/Tournesol/LaboursSemaille";
import MoissonBattage from "../components/TableComponents/Tournesol/MoissonBattage";

const TournesolPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [campagne1, setCampagne1] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [campagne2, setCampagne2] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya1, setWilaya1] = React.useState(id);
  const [wilaya2, setWilaya2] = React.useState(id);
  var searchParamsLS = {
    table: "tournesolLaboursSemailles",
    annee: campagne1,
  };
  var searchParamsMB = {
    table: "tounrnesoleMoissonBattage",
    annee: campagne2,
  };
  const laboursSemaille = useFetch(
    "/api/tournesol/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya1))
      ? { ...searchParamsLS, wilaya1 }
      : searchParamsLS
  );
  const moissonBattage = useFetch(
    "/api/tournesol/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParamsMB, wilaya2 }
      : searchParamsMB
  );
  if (laboursSemaille.error || moissonBattage.error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne1}
          setValue={setCampagne1}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
            value: item,
          }))}
        />
        {id === 59 ? (
          <OptionsList
            label={t("Wilaya")}
            value={wilaya1}
            setValue={setWilaya1}
            options={wilayas.map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      <LaboursSemaille
        campagne={campagne1}
        data={laboursSemaille?.data}
        refetch={laboursSemaille?.refetch}
        loading={laboursSemaille?.loading}
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
      <MoissonBattage
        campagne={campagne2}
        data={moissonBattage?.data}
        refetch={moissonBattage?.refetch}
        loading={moissonBattage?.loading}
      />
    </>
  );
};

export default TournesolPage;
