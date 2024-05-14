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
const langs = [
  { value: "Ar", label: "عربية" },
  { value: "Fr", label: "Francais" },
];
const AssociationsCooperativesPage = () => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [wilaya, setWilaya] = React.useState(id);
  const [language, setLanguage] = React.useState(langs[0].value);


  const [wilaya2, setWilaya2] = React.useState(id);
  const [language2, setLanguage2] = React.useState(langs[0].value);


  const [wilaya3, setWilaya3] = React.useState(id);
  const [language3, setLanguage3] = React.useState(langs[0].value);

  // Suivis
  var searchParams1 = {
    table: "association" + language,
  };

  const data = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = {
    table: "cooperative" + language2,
  };

  const data2 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParams2, wilaya2 }
      : searchParams2
  );

  var searchParams3 = {
    table: "conseilInterprofessionnelle" + language3,
  };

  const data3 = useFetch(
    "/api/associations-cooperatives/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya3))
      ? { ...searchParams3, wilaya3 }
      : searchParams3
  );

  if (data.error || data2.error || data3.error) return <NotFound />;

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
        data={data.data}
        refetch={data.refetch}
        loading={data.loading}
        relation={searchParams1.table}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Langue")}
          value={language2}
          setValue={setLanguage2}
          options={langs.map((item) => ({
            label: item.label,
            value: item.value,
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
      <Cooperatives
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
        relation={searchParams2.table}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Langue")}
          value={language3}
          setValue={setLanguage3}
          options={langs.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        {id === 59 ? (
          <OptionsList
            label={t("Wilaya")}
            value={wilaya3}
            setValue={setWilaya3}
            options={wilayas.map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      <CWIF
        data={data3.data}
        refetch={data3.refetch}
        loading={data3.loading}
        relation={searchParams2.table}
      />
    </>
  );
};

export default AssociationsCooperativesPage;
