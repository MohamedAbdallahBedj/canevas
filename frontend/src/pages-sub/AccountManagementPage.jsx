import React from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { Stack } from "@mui/material";
import OptionsList from "../components/OptionsList/OptionsList";
import wilayas from "../json/wilayas.json";
import AccountManagement from "../components/AccountManagement/AccountManagement";

const AccountManagementPage = () => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const [wilaya, setWilaya] = React.useState(id);
  // Suivis
  var searchParams1 = {
    table: "login",
  };

  const data1 = useFetch(
    "/api/auth/accounts",
    "GET",
    ![0].includes(parseInt(wilaya))
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
            options={[...wilayas, "CNA"].map((item, index) => ({
              label: t(item),
              value: index,
            }))}
          />
        ) : (
          <></>
        )}
      </Stack>
      <AccountManagement
        data={data1?.data}
        refetch={data1?.refetch}
        loading={data1?.loading}
      />
    </>
  );
};

export default AccountManagementPage;
