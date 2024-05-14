import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Box, Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import CelluleFemmeRurale from "../components/TableComponents/FemmeRurale/CelluleFemmeRurale";
import Affiliation from "../components/TableComponents/FemmeRurale/Affiliation";
import SituationAffiliation from "../components/TableComponents/FemmeRurale/SituationAffiliation";

const FemmeRuralePage = ({ campagnes }) => {
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

  const [wilaya3, setWilaya3] = React.useState(id);

  var searchParams = { table: "femmeRuraleAffiliee", annee: campagne };
  const affiliation = useFetch(
    "/api/api/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );

  var searchParams2 = { table: "situationAffiliation", annee: campagne2 };
  const situation = useFetch(
    "/api/api/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya2))
      ? { ...searchParams2, wilaya2 }
      : searchParams2
  );

  var searchParams3 = { table: "celluleFemmeRurale" };
  const cellule = useFetch(
    "/api/api/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya3))
      ? { ...searchParams3, wilaya3 }
      : searchParams3
  );
  if (cellule.error || affiliation.error || situation.error)
    return <NotFound />;

  return (
    <Box maxWidth="96vw">
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
      <Affiliation
        campagne={campagne}
        data={affiliation.data}
        refetch={affiliation.refetch}
        loading={affiliation.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
        <OptionsList
          label={t("Année")}
          value={campagne2}
          setValue={setCampagne2}
          options={campagnes.map((item) => ({
            label: `${item}`,
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
      <SituationAffiliation
        campagne={campagne2}
        data={situation.data}
        refetch={situation.refetch}
        loading={situation.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Stack direction="row" marginBlockEnd={1}>
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
      <CelluleFemmeRurale data={cellule.data} refetch={cellule.refetch} loading={cellule.loading} />
    </Box>
  );
};

export default FemmeRuralePage;
