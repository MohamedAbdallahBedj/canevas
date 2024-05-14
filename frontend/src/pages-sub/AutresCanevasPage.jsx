import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Enrgais from "../components/TableComponents/AutresCanevas/Enrgais";
import ProduitsPhytosanitaires from "../components/TableComponents/AutresCanevas/ProduitsPhytosanitaires";

const AutresCanevasPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  const [campagne2, setCampagne2] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya2, setWilaya2] = React.useState(id);
  // Suivis
  var searchParams1 = {
    table: "engrais",
    annee: campagne,
  };

  const data1 = useFetch(
    "/api/autres-canevas/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = {
    table: "produitsPhytosanitaires",
    annee: campagne2,
  };

  const data2 = useFetch(
    "/api/autres-canevas/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParams2, wilaya2 }
      : searchParams2
  );
  if (data1.error || data2.error) return <NotFound />;

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
      <Enrgais
        campagne={campagne}
        data={data1?.data}
        refetch={data1?.refetch}
        loading={data1?.loading}
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
      <ProduitsPhytosanitaires
        campagne={campagne2}
        data={data2?.data}
        refetch={data2?.refetch}
        loading={data2?.loading}
      />
    </>
  );
};

export default AutresCanevasPage;
