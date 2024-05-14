import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import AlimentBetail from "../components/TableComponents/Producteurs/AlimentBetail";
import FourrageEnrubanne from "../components/TableComponents/Producteurs/FourrageEnrubanne";
import Triticale from "../components/TableComponents/Producteurs/Triticale";

const ProducteursPage = () => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [wilaya, setWilaya] = React.useState(id);

  var searchParams1 = { table: "fabricantAlimentBetail" };
  const data1 = useFetch(
    "/api/indentification-producteurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = { table: "producteurFourrageEnrubanne" };
  const data2 = useFetch(
    "/api/indentification-producteurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams2, wilaya }
      : searchParams2
  );

  var searchParams3 = { table: "producteurTriticale" };
  const data3 = useFetch(
    "/api/indentification-producteurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams3, wilaya }
      : searchParams3
  );

  if (data1.error || data2.error || data3.error) return <NotFound />;

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
      <AlimentBetail
        data={data1.data}
        refetch={data1.refetch}
        loading={data1.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <FourrageEnrubanne
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
      />

      <Divider sx={{ marginBlock: 5 }} />
      <Triticale
        data={data3.data}
        refetch={data3.refetch}
        loading={data3.loading}
      />
    </>
  );
};

export default ProducteursPage;
