import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Olives from "../components/TableComponents/Olives/Olives";
import UTO from "../components/TableComponents/UTO/UTO";

const OlivesPage = ({ campagnes }) => {
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
  var searchParamsOlives = {
    table: "olivesSuivi",
    annee: campagne,
  };
  var searchParamsUT = {
    table: "unitesTransformationOleicoles",
    annee: campagne2,
  };
  const olives = useFetch(
    "/api/olives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsOlives, wilaya }
      : searchParamsOlives
  );
  const unitesTransformation = useFetch(
    "/api/olives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParamsUT, wilaya2 }
      : searchParamsUT
  );
  if (olives.error || unitesTransformation.error) return <NotFound />;

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
      <Olives
        campagne={campagne}
        data={olives?.data}
        refetch={olives?.refetch}
        loading={olives?.loading}
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
      <UTO
        campagne={campagne2}
        data={unitesTransformation?.data}
        refetch={unitesTransformation?.refetch}
        loading={unitesTransformation?.loading}
      />
    </>
  );
};

export default OlivesPage;
