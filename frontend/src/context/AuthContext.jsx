import React, { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let { pathname } = useLocation();
  let [user, setUser] = React.useState(null);
  let [loading, setLoading] = React.useState(false);
  const history = useNavigate();
  const { t } = useTranslation();

  let login = async (nomUtilisateur, motDePasse) => {
    setLoading(true);
    fetch("/api/auth/login", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomUtilisateur: nomUtilisateur,
        motDePasse: motDePasse,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error(response.statusText, {
            autoClose: 2000,
            hideProgressBar: true,
          });
          throw new Error(response.statusText);
        }

        toast.success(t("Succès"), {
          autoClose: 2000,
          hideProgressBar: true,
        });
        return response.json();
      })
      .then((data) => {
        setUser(data);
        history("/", { state: data });
        return;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let logout = async () => {
    setLoading(true);
    fetch("/api/auth/logout", {
      method: "get",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          toast.error(response.statusText, {
            autoClose: 2000,
            hideProgressBar: true,
          });
          throw new Error(response.statusText);
        }
        localStorage.clear();
        setUser(null);
        if (pathname.toLocaleLowerCase() === "/Login") history("/");
        history("/Login", { replace: true });
        toast.success(t("Succès"), {
          autoClose: 2000,
          hideProgressBar: true,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let contextData = {
    user,
    loading,
    login: login,
    logout: logout,
  };

  React.useEffect(() => {
    let checkAuth = async () => {
      setLoading(true);
      fetch("/api/auth/verify", {
        method: "post",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            localStorage.clear();
            setUser(null);
            history("/Login");
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          if (pathname.toLocaleLowerCase() === "/Login") history("/");
          toast.success(t("Succès"), {
            autoClose: 2000,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error(error, {
            autoClose: 2000,
            hideProgressBar: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
