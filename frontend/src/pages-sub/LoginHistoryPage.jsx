import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import LoginHistory from "../components/TableComponents/LoginHistory/LoginHistory";

const LoginHistoryPage = () => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [wilaya, setWilaya] = React.useState(id);
  // Suivis
  var searchParams1 = {
    table: "loginHistory",
  };

  const data1 = useFetch("/api/abbatoirs-et-tueries/table", "GET", {
    ...searchParams1,
  });

  if (data1.error) return <NotFound />;

  return (
    <>
      <Stack direction="row" marginBlock={1}></Stack>
      <LoginHistory
        data={data1?.data}
        refetch={data1?.refetch}
        loading={data1?.loading}
      />
    </>
  );
};

export default LoginHistoryPage;
