import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Associations from "../components/TableComponents/Associations/Associations";
import Cooperatives from "../components/TableComponents/Associations/Cooperatives";
import CWIF from "../components/TableComponents/Associations/CWIF";
import SensibilisationCooperative from "../components/TableComponents/Associations/SensibilisationCooperative";
import SituationAssociation from "../components/TableComponents/Associations/SituationAssociation";
import SituationCooperative from "../components/TableComponents/Associations/SituationCooperative";
const langs = [
  { value: "Ar", label: "عربية" },
  { value: "Fr", label: "Francais" },
];
const AssociationsCooperativesAutresPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [wilaya, setWilaya] = React.useState(id);
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [language, setLanguage] = React.useState(langs[0].value);

  // Suivis
  var searchParams1 = {
    table: "association" + language,
  };

  const data1 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = {
    table: "cooperative" + language,
  };

  const data2 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams2, wilaya }
      : searchParams2
  );

  var searchParams3 = {
    table: "conseilInterprofessionnelle" + language,
  };

  const data3 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams3, wilaya }
      : searchParams3
  );

  var searchParams4 = {
    table: "cooperativeSensibilisation",
    annee: campagne,
  };

  const data4 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams4, wilaya }
      : searchParams4
  );

  var searchParams5 = {
    table: "situationAssociation",
    annee: campagne,
  };

  const data5 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams5, wilaya }
      : searchParams5
  );

  var searchParams6 = {
    table: "situationCooperative",
    annee: campagne,
  };

  const data6 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams6, wilaya }
      : searchParams6
  );

  if (
    data1.error ||
    data2.error ||
    data3.error ||
    data4.error ||
    data5.error ||
    data6.error
  )
    return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Langue")}
          value={language}
          setValue={setLanguage}
          options={langs.map((item) => ({
            label: item.label,
            value: item.value,
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
      <Associations
        data={data1.data}
        refetch={data1.refetch}
        loading={data1.loading}
        relation={searchParams1.table}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Cooperatives
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
        relation={searchParams2.table}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <CWIF
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
        relation={searchParams2.table}
      />
      <Divider sx={{ marginBlock: 5 }} />

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
      </Stack>
      <SensibilisationCooperative
        campagne={campagne}
        data={data4.data}
        refetch={data4.refetch}
        loading={data4.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <SituationAssociation
        campagne={campagne}
        data={data5.data}
        refetch={data5.refetch}
        loading={data5.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <SituationCooperative
        campagne={campagne}
        data={data6.data}
        refetch={data6.refetch}
        loading={data6.loading}
      />
    </>
  );
};

export default AssociationsCooperativesAutresPage;
