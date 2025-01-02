import React from "react";
import NewAccount from "../components/NewAccount/NewAccount";
import EditPassword from "../components/EditPassword/EditPassword";
import Loading from "../components/Loading/Loading";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";
import AccountManagementPage from "../components/AccountManagement/AccountManagementPage";
import LoginHistoryPage from "../components/LoginHistory/LoginHistoryPage";
const tabs = [
  {
    value: 0,
    label: "Modifier le mot de passe",
    roles: [
      "UtilisateurTechnique",
      "UtilisateurFinance",
      "AdminGenerale",
      "AdminPV",
      "AdminPA",
      "AdminDOP",
      "AdminVul",
      "AdminCom",
      "AdminPVR",
      "AdminFR",
      "AdminFinance",
      "AdminCarte",
      "AdminRH",
    ],
  },
  {
    value: 1,
    label: "Ajouter un compte",
    roles: ["AdminGenerale"],
  },
  {
    value: 2,
    label: "Outil de gestion des comptes",
    roles: ["AdminGenerale"],
  },
  {
    value: 3,
    label: "Historique d'utilisation",
    roles: ["AdminGenerale"],
  },
];

const SettingsPage = () => {
  const [fakeLoad, setFakeLoad] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);

  const handleChange = (event, newValue) => {
    setFakeLoad(true);
    setTimeout(() => {
      setFakeLoad(false);
    }, 500);
    setValue(newValue);
  };
  if (fakeLoad) return <Loading />;
  return (
    <>
      <Box
        sx={{ width: "100%", marginBlockEnd: 2, bgcolor: "background.paper" }}
        marginBlockEnd={1}
      >
        <Tabs value={value} onChange={handleChange} centered>
          {tabs
            .filter((tab) => tab.roles.includes(user?.role))
            .map(({ value, label }, index) => (
              <Tab key={`Tab ${index}`} value={value} label={t(label)} />
            ))}
        </Tabs>
      </Box>
      {value === 0 ? <EditPassword /> : <></>}
      {value === 1 ? <NewAccount /> : <></>}
      {value === 2 ? <AccountManagementPage /> : <></>}
      {value === 3 ? <LoginHistoryPage /> : <></>}
    </>
  );
};

export default SettingsPage;
