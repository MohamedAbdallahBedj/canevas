import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Mais from "../components/TableComponents/Mais/Mais";
import Bilan from "../components/TableComponents/Mais/Bilan";

const MaisPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  // Suivis
  var searchParamsS = {
    table: "maisSuivi",
    annee: campagne,
  };

  const suivi = useFetch(
    "/api/mais/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsS, wilaya }
      : searchParamsS
  );
  // Bilans
  var searchParamsB = {
    table: "maisBilan",
    annee: campagne,
  };

  const bilan = useFetch(
    "/api/mais/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsB, wilaya }
      : searchParamsB
  );
  if (suivi.error) return <NotFound />;

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
      <Mais
        campagne={campagne}
        data={suivi?.data}
        refetch={suivi?.refetch}
        loading={suivi?.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <Bilan
        campagne={campagne}
        data={bilan?.data}
        refetch={bilan?.refetch}
        loading={bilan?.loading}
      />
    </>
  );
};

export default MaisPage;
