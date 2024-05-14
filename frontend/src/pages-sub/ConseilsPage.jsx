import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import CommissionsOrganisation from "../components/TableComponents/Conseils/CommissionsOrganisation";
import NouvellesAssociations from "../components/TableComponents/Conseils/NouvellesAssociations";
import Renouvellement from "../components/TableComponents/Conseils/Renouvellement";
import AssainissementAssociations from "../components/TableComponents/Conseils/AssainissementAssociations";
import AssociationGenerale from "../components/TableComponents/Conseils/AssociationGenerale";

const ConseilsPage = ({ campagnes }) => {
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

  const [campagne4, setCampagne4] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya4, setWilaya4] = React.useState(id);

  const [campagne5, setCampagne5] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya5, setWilaya5] = React.useState(id);

  var searchParams1 = {
    table: "installationCommissionOrganisationSuiviElections",
    annee: campagne,
  };
  const data1 = useFetch(
    "/api/conseils-administration/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = {
    table: "situationNouvellesAssociationsSouhaitantAdhererCaw",
    annee: campagne2,
  };
  const data2 = useFetch(
    "/api/conseils-administration/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParams2, wilaya2 }
      : searchParams2
  );

  var searchParams3 = {
    table: "situationRenouvellementAssociations",
    annee: campagne3,
  };
  const data3 = useFetch(
    "/api/conseils-administration/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya3))
      ? { ...searchParams3, wilaya3 }
      : searchParams3
  );

  var searchParams4 = {
    table: "situationAssociationsAgricolesAssainissement",
    annee: campagne4,
  };
  const data4 = useFetch(
    "/api/conseils-administration/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya4))
      ? { ...searchParams4, wilaya4 }
      : searchParams4
  );

  var searchParams5 = { annee: campagne5 };
  const data5 = useFetch(
    "/api/ag/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya5))
      ? { ...searchParams5, wilaya5 }
      : searchParams5
  );

  if (data1.error || data2.error || data3.error || data4.error || data5.error)
    return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlockEnd={1}>
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
      <CommissionsOrganisation
        campagne={campagne}
        data={data1.data}
        refetch={data1.refetch}
        loading={data1.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
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
      <NouvellesAssociations
        campagne={campagne2}
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
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
      <Renouvellement
        campagne={campagne3}
        data={data3.data}
        refetch={data3.refetch}
        loading={data3.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne4}
          setValue={setCampagne4}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
            value: item,
          }))}
        />
        {id === 59 ? (
          <OptionsList
            label={t("Wilaya")}
            value={wilaya4}
            setValue={setWilaya4}
            options={wilayas.map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      <AssainissementAssociations
        campagne={campagne4}
        data={data4.data}
        refetch={data4.refetch}
        loading={data4.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
        <OptionsList
          label={t("Campagne")}
          value={campagne5}
          setValue={setCampagne5}
          options={campagnes.map((item) => ({
            label: `${item}/${item + 1}`,
            value: item,
          }))}
        />
        {id === 59 ? (
          <OptionsList
            label={t("Wilaya")}
            value={wilaya5}
            setValue={setWilaya5}
            options={wilayas.map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      <AssociationGenerale
        campagne={campagne5}
        data={data5.data}
        refetch={data5.refetch}
        loading={data5.loading}
        associations={data4}
      />
    </>
  );
};

export default ConseilsPage;
