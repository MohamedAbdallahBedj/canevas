import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";

const CerealesLabourseSemaille = ({
  campagne,
  data = [],
  refetch,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id, role } = user;
  const fileName = t("Suivi de la Campagne Labours-Semailles");
  const idEspeceLookup = {
    1: t("Blé Dur (Consommation)"),
    2: t("Blé Dur (Semences)"),
    3: t("Blé Tendre (Consommation)"),
    4: t("Blé Tendre (Semences)"),
    5: t("Orge (Consommation)"),
    6: t("Orge (Semences)"),
    7: t("Avoine (Consommation)"),
    8: t("Avoine (Semences)"),
    9: t("Tritical (Consommation)"),
    10: t("Tritical (Semences)"),
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
      field: "idEspece",
      title: t("Espèces"),
      lookup: idEspeceLookup,
    },
    {
      ...baseColumn,
      field: "realisation",
      title: t("Réalisation de la Campagne Précédente (Ha)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "objectif",
      title: t("Objectif (Ha)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "superficieRealisee",
      title: t("Superficie Réalisée (Ha)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "superficieEngraissee",
      title: t("Superficie Engraissée (Ha)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "superficieIrriguee",
      title: t("Superficie Irriguée (Ha)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "capaciteIrrigationAppoint",
      title: t("Capacité d'Irrigation d'Appoint (m3)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "date",
      initialEditValue: new Date(),
      title: t("Date"),
      type: "date",
    },
    { ...baseColumn, field: "faitsSaillants", title: t("Faits Saillants") },
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
          exportMenu:
            role != "AdminPA"
              ? [
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
                        idEspece: idEspeceLookup[row.idEspece],
                        idWilaya: idWilayaLookup[row.idWilaya],
                      }));

                      excel(
                        excelCols,
                        searchedDataFormated,
                        fileName + " " + new Date().toLocaleDateString()
                      );
                    },
                  },
                ]
              : [],
        }}
        editable={
          id === 59
            ? {}
            : {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    if (hasNullableValues(newData)) return reject();
                    fetch("/api/cereales/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "suiviLaboursSemaillesCereales",
                        row: { ...newData, annee: campagne, idWilaya: id },
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
                    const { idSuivi, tableData, ...properties } = newData;
                    fetch("/api/cereales/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "suiviLaboursSemaillesCereales",
                        properties,
                        idCol: "idSuivi",
                        id: idSuivi,
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
                    fetch("/api/cereales/delete/" + oldData.idSuivi, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "suiviLaboursSemaillesCereales",
                        idCol: "idSuivi",
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

export default CerealesLabourseSemaille;
