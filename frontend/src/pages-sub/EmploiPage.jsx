import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import BilanEmploi from "../components/TableComponents/BilanEmploi/BilanEmploi";

const EmploiPage = ({ campagnes }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes[campagnes.length - 1] : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParams = { table: "emploi", annee: campagne };
  const { data, loading, error, refetch } = useFetch(
    "/api/bilan-emploi/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );
  if (error) return <NotFound />;

  return (
    <>
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
      <BilanEmploi
        campagne={campagne}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    </>
  );
};

export default EmploiPage;
