import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Divider, Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import Aviculteurs from "../components/TableComponents/Eleveurs/Aviculteurs";
import EleveursBovin from "../components/TableComponents/Eleveurs/EleveursBovin";
import EleveursCaprin from "../components/TableComponents/Eleveurs/EleveursCaprin";
import ProducteursPoussins from "../components/TableComponents/Eleveurs/ProducteursPoussins";

const EleveursPage = () => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [wilaya, setWilaya] = React.useState(id);

  var searchParamsCommunes = { table: "listeCommunes" };
  const communes = useFetch(
    "/api/identification-eleveurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParamsCommunes, wilaya }
      : searchParamsCommunes
  );
  const is_rtl =
    localStorage.getItem("i18nextLng") === "ar" ||
    !localStorage.getItem("i18nextLng");

  const lookup = communes.data.map((row) => [
    row.id,
    row[`nomCommune${is_rtl ? "AR" : "FR"}`],
  ]);

  var searchParams1 = { table: "listeAviculteurs" };
  const data1 = useFetch(
    "/api/identification-eleveurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  var searchParams2 = { table: "listeEleveursBovins" };
  const data2 = useFetch(
    "/api/identification-eleveurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams2, wilaya }
      : searchParams2
  );

  var searchParams3 = { table: "listeEleveursCaprins" };
  const data3 = useFetch(
    "/api/identification-eleveurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams3, wilaya }
      : searchParams3
  );

  var searchParams4 = { table: "listeProducteursPoussins" };
  const data4 = useFetch(
    "/api/identification-eleveurs/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams4, wilaya }
      : searchParams4
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
      <Aviculteurs
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data1.data}
        refetch={data1.refetch}
        loading={data1.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <EleveursBovin
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data2.data}
        refetch={data2.refetch}
        loading={data2.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <EleveursCaprin
        idCommuneLookup={Object.fromEntries(lookup)}
        data={data3.data}
        refetch={data3.refetch}
        loading={data3.loading}
      />
      <Divider sx={{ marginBlock: 5 }} />
      <ProducteursPoussins
        data={data4.data}
        refetch={data4.refetch}
        loading={data4.loading}
      />
    </>
  );
};

export default EleveursPage;
