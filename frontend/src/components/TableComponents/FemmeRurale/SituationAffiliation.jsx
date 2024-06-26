import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";


const SituationAffiliation = ({
  campagne,
  data = [],
  refetch,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Operation d'enregistrement de la femme rurale");

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
    cellStyle: { textAlign: "center", minWidth: 200 },
    headerStyle: { textAlign: "center", minWidth: 200 },
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
      field: "total",
      title: t("Nombre globale d'adérentes"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "trimestre",
      title: t("Trimestre"),
      lookup: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
      },
    },
    {
      ...baseColumn,
      field: "etudies",
      title: t("Nombre de dossiers etudiés"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "acceptes",
      title: t("Nombre de dossiers acceptés"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "refuses",
      title: t("Nombre de dossiers refusés"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "motifs",
      title: t("Les Motifs de refus"),
    },
    {
      ...baseColumn,
      field: "difficultes",
      title: t("Les difficultés rencontrés"),
    },
    {
      ...baseColumn,
      field: "solutions",
      title: t("Solutions Proposées"),
    },
    {
      ...baseColumn,
      field: "observations",
      title: t("Observation"),
    },
    {
      ...baseColumn,
      field: "date",
      initialEditValue: new Date(),
      title: t("Date"),
      type: "date",
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
                    const { fichier, ...rest } = newData;
                    if (hasNullableValues(rest)) return reject();
                    const row = {
                      ...newData,
                      tablename: "situationAffiliation",
                      idWilaya: id,
                      annee: campagne,
                    };
                    const formData = new FormData();
                    Object.keys(row).forEach((item) =>
                      formData.append(item, row[item])
                    );

                    fetch("/api/activites/add", {
                      method: "post",
                      credentials: "include",
                      body: formData,
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
                    const { fichier, ...rest } = newData;
                    if (hasNullableValues(rest)) return reject();
                    if (isObjectContained(oldData, newData)) return resolve();
                    const row = {
                      ...newData,
                      tablename: "situationAffiliation",
                      idCol: "id",
                      id: newData.id,
                    };
                    const formData = new FormData();
                    Object.keys(row).forEach((item) =>
                      formData.append(item, row[item])
                    );
                    fetch("/api/activites/edit", {
                      method: "post",
                      credentials: "include",
                      body: formData,
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
                    fetch("/api/activites/delete/" + oldData.id, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "situationAffiliation",
                        idCol: "id",
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

export default SituationAffiliation;
