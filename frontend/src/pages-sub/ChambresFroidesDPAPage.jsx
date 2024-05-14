import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import DPA from "../components/TableComponents/ChambresFroides/DPA";

const ChambresFroidesDPAPage = () => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;

  const [wilaya, setWilaya] = React.useState(id);
  var searchParams = { table: "chambresFroides" };
  const { data, loading, error, refetch } = useFetch(
    "/api/chambres-froides-origine-animale/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams, wilaya }
      : searchParams
  );
  if (error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlockEnd={1}>
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
      <DPA data={data} refetch={refetch} loading={loading} />
    </>
  );
};

export default ChambresFroidesDPAPage;
