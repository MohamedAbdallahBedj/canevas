import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";

const PPR = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Peste des Petits Ruminants");
  const nombreDeLookup = {
    1: t("Doses Recues"),
    2: t("Sujets Vaccines Ovins"),
    3: t("Sujets Vaccines Caprins"),
    4: t("Mortalité Ovine"),
    5: t("Têtes Ovines Abattues"),
    6: t("Mortalité Caprine"),
    7: t("Têtes Caprines Abattues"),
    8: t("Vétérinaires Étatiques Mobilisés"),
    9: t("Vétérinaires Privés Mobilisés"),
  };

  const idWilayaLookup = {
    1: t("Adrar"),
    2: t("Chlef"),
    3: t("Laghouat"),
    4: t("OumElBouaghi"),
    5: t("Batna"),
    6: t("Béjaïa"),
    7: t("Biskra"),
    8: t("Béchar"),
    9: t("Blida"),
    10: t("Bouira"),
    11: t("Tamanrasset"),
    12: t("Tébessa"),
    13: t("Tlemcen"),
    14: t("Tiaret"),
    15: t("TiziOuzou"),
    16: t("Alger"),
    17: t("Djelfa"),
    18: t("Jijel"),
    19: t("Sétif"),
    20: t("Saïda"),
    21: t("Skikda"),
    22: t("SidiBelAbbès"),
    23: t("Annaba"),
    24: t("Guelma"),
    25: t("Constantine"),
    26: t("Médéa"),
    27: t("Mostaganem"),
    28: t("M’sila"),
    29: t("Mascara"),
    30: t("Ouargla"),
    31: t("Oran"),
    32: t("ElBayadh"),
    33: t("Illizi"),
    34: t("BordjBouArreridj"),
    35: t("Boumerdès"),
    36: t("ElTaref"),
    37: t("Tindouf"),
    38: t("Tissemsilt"),
    39: t("ElOued"),
    40: t("Khenchela"),
    41: t("Souk Ahras"),
    42: t("Tipaza"),
    43: t("Mila"),
    44: t("AïnDefla"),
    45: t("Naâma"),
    46: t("AïnTémouchent"),
    47: t("Ghardaïa"),
    48: t("Relizane"),
    49: t("ElMGhair"),
    50: t("ElMeniaa"),
    51: t("OuledDjellal"),
    52: t("BordjBadjiMokhtar"),
    53: t("BéniAbbès"),
    54: t("Timimoun"),
    55: t("Touggourt"),
    56: t("Djanet"),
    57: t("InSalah"),
    58: t("InGuezzam"),
  };

  const baseColumn = {
    align: "center",
    mainField: "",
    initialEditValue: "",
    cellStyle: { textAlign: "center" },
  };

  let columns = [
    {
      ...baseColumn,
      field: "idWilaya",
      title: t("Wilaya"),
      lookup: idWilayaLookup,
    },
    {
      ...baseColumn,
      field: "nombreDe",
      title: t("Nombre de"),
      type: "numeric",
      lookup: nombreDeLookup,
    },
    {
      ...baseColumn,
      field: "maladiePhase1",
      title: t("Phase1"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "maladiePhase2",
      title: t("Phase2"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "date",
      title: t("Date"),
      type: "date",
      initialEditValue: new Date(),
    },
    {
      ...baseColumn,
      field: "observation",
      title: t("Observation"),
    },
  ];
  if (id !== 59)
    columns = columns.filter((column) => column.field !== "idWilaya");

  return (
    <>
      <MaterialTable
        title={fileName}
        data={data}
        isLoading={loading}
        columns={columns}
        options={{
          actionsColumnIndex: -1,
          exportAllData: true,
          draggable: false,
          exportMenu: [
            {
              label: t("Exporter en Excel"),
              exportFunc: (columns, _, { searchedData }) => {
                const excelCols = columns.map((item) => ({
                  width: 20,
                  key: item.field,
                  header: item.title,
                }));
                const searchedDataFormated = searchedData.map((row) => ({
                  ...row,
                  nombreDe: nombreDeLookup[row.nombreDe],
                  idWilaya: idWilayaLookup[row.idWilaya],
                }));

                excel(
                  excelCols,
                  searchedDataFormated,
                  fileName + " " + new Date().toLocaleDateString()
                );
              },
            },
          ],
        }}
        editable={
          id === 59
            ? {}
            : {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    if (hasNullableValues(newData)) return reject();
                    fetch("/api/campagne-de-vaccination/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "campagneVaccinationPPR",
                        row: {
                          ...newData,
                          annee: campagne,
                          idWilaya: id,
                        },
                      }),
                    })
                      .then((response) => {
                        if (!response.ok) {
                          reject();
                          toast.error(response.statusText, {
                            autoClose: 2000,
                            hideProgressBar: true,
                          });
                          throw new Error(response.statusText);
                        }
                        refetch();
                        toast.success(t("Succès"), {
                          autoClose: 2000,
                          hideProgressBar: true,
                        });
                        resolve();
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    if (hasNullableValues(newData)) return reject();
                    if (isObjectContained(oldData, newData)) return resolve();
                    const { idVaccination, tableData, ...properties } = newData;
                    fetch("/api/campagne-de-vaccination/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "campagneVaccinationPPR",
                        properties,
                        idCol: "idVaccination",
                        id: idVaccination,
                      }),
                    })
                      .then((response) => {
                        if (!response.ok) {
                          reject();
                          toast.error(response.statusText, {
                            autoClose: 2000,
                            hideProgressBar: true,
                          });
                          throw new Error(response.statusText);
                        }
                        refetch();
                        toast.success(t("Succès"), {
                          autoClose: 2000,
                          hideProgressBar: true,
                        });
                        resolve();
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    fetch(
                      "/api/campagne-de-vaccination/delete/" +
                        oldData.idVaccination,
                      {
                        method: "delete",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          tablename: "campagneVaccinationPPR",
                          idCol: "idVaccination",
                        }),
                      }
                    )
                      .then((response) => {
                        if (!response.ok) {
                          reject();
                          toast.error(response.statusText, {
                            autoClose: 2000,
                            hideProgressBar: true,
                          });
                          throw new Error(response.statusText);
                        }
                        refetch();
                        toast.success(t("Succès"), {
                          autoClose: 2000,
                          hideProgressBar: true,
                        });
                        resolve();
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }),
              }
        }
        localization={
          localStorage.getItem("i18nextLng") === "fr"
            ? localizationFR
            : localizationAR
        }
        style={{ paddingInlineEnd: 20 }}
      />
    </>
  );
};

export default PPR;
