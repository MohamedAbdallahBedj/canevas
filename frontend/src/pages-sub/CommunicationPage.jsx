import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import ET from "../components/TableComponents/Communication/ET";
import ER from "../components/TableComponents/Communication/ER";
import PE from "../components/TableComponents/Communication/PE";

const CommunicationPage = ({ campagnes }) => {
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

  const [campagne3, setCampagne3] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya3, setWilaya3] = React.useState(id);

  var searchParams1 = {
    table: "emissionTelevisee",
    annee: campagne,
  };
  const data1 = useFetch(
    "/api/communication/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = {
    table: "emissionRadiophonique",
    annee: campagne2,
  };
  const data2 = useFetch(
    "/api/communication/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParams2, wilaya2 }
      : searchParams2
  );

  var searchParams3 = {
    table: "presseEcrite",
    annee: campagne3,
  };
  const data3 = useFetch(
    "/api/communication/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya3))
      ? { ...searchParams3, wilaya3 }
      : searchParams3
  );

  if (data1.error || data2.error || data3.error) return <NotFound />;

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
      <ET
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
      <ER
        campagne={campagne2}
        data={data2?.data}
        refetch={data2?.refetch}
        loading={data2?.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlock={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne3}
          setValue={setCampagne3}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
            value: item,
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
      <PE
        campagne={campagne3}
        data={data3?.data}
        refetch={data3?.refetch}
        loading={data3?.loading}
      />
    </>
  );
};

export default CommunicationPage;
