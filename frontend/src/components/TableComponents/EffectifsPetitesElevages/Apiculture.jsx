import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import { TableCell, TableHead, TableRow } from "@mui/material";

const Apiculture = ({
  campagne,
  idCommuneLookup,
  data = [],
  refetch,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t("Apiculture (Élevage D'Abeilles)");

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
    groupTitle: "",
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
      field: "idCommune",
      title: t("Commune"),
      type: "numeric",
      lookup: idCommuneLookup,
    },

    {
      ...baseColumn,
      groupTitle: t("Ruches Pleines (Avec Colonies d'Abeilles)") + ": ",
      field: "ruchesPleinesModernes",
      title: t("Modernes (Nombre)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      groupTitle: t("Ruches Pleines (Avec Colonies d'Abeilles)") + ": ",
      field: "ruchesPleinesTraditionnelles",
      title: t("Traditionnelles (Nombre)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      groupTitle: t("Ruches Pleines (Avec Colonies d'Abeilles)") + ": ",
      field: "totalRuches",
      title: t("Total Ruches Pleines"),
      type: "numeric",
      editable: "never",
      render: (data) => {
        const { ruchesPleinesModernes, ruchesPleinesTraditionnelles } = data;
        return <>{ruchesPleinesModernes + ruchesPleinesTraditionnelles}</>;
      },
    },
    {
      ...baseColumn,
      groupTitle: t("Ruches Pleines (Avec Colonies d'Abeilles)") + ": ",
      field: "ruchesPleinesEssaimsMorts",
      title: t("Essaims Morts (Nombre)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      groupTitle: t("Ruches Pleines (Avec Colonies d'Abeilles)") + ": ",
      field: "ruchesPleinesRuchesDeperies",
      title: t("Ruches Dépéries (Nombre)"),
      type: "numeric",
    },

    {
      ...baseColumn,
      groupTitle: t("Production d'Essaims") + ": ",
      field: "productionEssaimsNombreColonies",
      title: t("Nombre De Colonies Mises à l'Essaimage"),
      type: "numeric",
    },
    {
      ...baseColumn,
      groupTitle: t("Production d'Essaims") + ": ",
      field: "productionEssaimsProduction",
      title: t("Production D'Essaims (Nombre)"),
      type: "numeric",
    },

    {
      ...baseColumn,
      groupTitle: t("Production de Miel") + ": ",
      field: "productionMielNombreColonies",
      title: t("Nombre De Colonies Mises à La Production De Miel"),
      type: "numeric",
    },
    {
      ...baseColumn,
      groupTitle: t("Production de Miel") + ": ",
      field: "productionMielProduction",
      title: t("Production De Miel (Kg)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "date",
      title: t("Date"),
      type: "date",
      initialEditValue: new Date(),
    },
  ];

  const CustomHeader = (props) => {
    let tableCells = [
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Ruches Pleines (Avec Colonies d'Abeilles)"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 5,
      },
      {
        text: t("Production d'Essaims"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 2,
      },
      {
        text: t("Production de Miel"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
    ];
    if (id !== 59) tableCells.shift();
    else tableCells.pop();
    return (
      <>
        <TableHead>
          <TableRow>
            {tableCells.map((cell, index) => (
              <TableCell
                sx={cell.sx}
                colSpan={cell.colSpan}
                key={`TableCell ${index}`}
              >
                {cell.text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <MTableHeader {...props} />
      </>
    );
  };
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
                  header: (item.groupTitle ?? "") + item.title,
                }));
                const searchedDataFormated = searchedData.map((row) => ({
                  ...row,
                  totalRuches:
                    row.ruchesPleinesModernes +
                    row.ruchesPleinesTraditionnelles,
                  idWilaya: idWilayaLookup[row.idWilaya],
                  idCommune: idCommuneLookup[row.idCommune],
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
                    const { totalRuches, ...properties } = newData;
                    if (hasNullableValues(properties)) return reject();
                    fetch("/api/evolution-effectif-animale-petites-elevage/add", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "apiculture",
                        row: {
                          ...properties,
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
                    const { id, tableData, totalRuches, ...properties } =
                      newData;
                    fetch("/api/evolution-effectif-animale-petites-elevage/edit", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "apiculture",
                        properties,
                        idCol: "id",
                        id: id,
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
                    fetch("/api/evolution-effectif-animale-petites-elevage/delete/" + oldData.id, {
                      method: "delete",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "apiculture",
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
        components={{
          Header: CustomHeader,
        }}
      />
    </>
  );
};

export default Apiculture;
