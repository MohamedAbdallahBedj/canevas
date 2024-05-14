import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import FilieresAnimales from "../components/TableComponents/FilieresAnimales/FilieresAnimales";

const FilieresAnimalesPage = () => {
  const { t } = useTranslation();
  const { user} = React.useContext(AuthContext);
const { idWilaya:id } = user;
  const [wilaya, setWilaya] = React.useState(id);
  // Suivis
  var searchParams1 = {
    table: "filieresAnimales",
  };

  const data1 = useFetch(
    "/api/filieres-animales/table",
    "GET",
    ![59, 0].includes(parseInt(wilaya))
      ? { ...searchParams1, wilaya }
      : searchParams1
  );

  if (data1.error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlock={1}>
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
      <FilieresAnimales
        data={data1?.data}
        refetch={data1?.refetch}
        loading={data1?.loading}
      />
    </>
  );
};

export default FilieresAnimalesPage;
