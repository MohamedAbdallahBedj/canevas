import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import ProductionAnimale from "../components/TableComponents/ProductionAnimale/ProductionAnimale";

const ProductionAnimalePage = ({ campagnes = [] }) => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [campagne, setCampagne] = React.useState(
    campagnes.length ? campagnes.length : null
  );
  const [wilaya, setWilaya] = React.useState(id);
  var searchParams = {
    table: "evolutionProductionAnimale",
    annee: campagne,
  };
  const { data, loading, error, refetch } = useFetch(
    "/api/evolution-production-animale/table",
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
          options={campagnes.map((item, index) => ({
            label: `${item}`,
            value: index + 1,
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
      <ProductionAnimale
        campagnes={campagnes}
        data={data}
        refetch={refetch}
        loading={loading}
      />
    </>
  );
};

export default ProductionAnimalePage;
