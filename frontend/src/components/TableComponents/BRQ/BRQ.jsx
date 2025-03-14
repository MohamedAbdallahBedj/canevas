import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import {
  getWeekStartAndEnd,
  hasNullableValues,
  isObjectContained,
} from "../../../exports/divers";
import { TableCell, TableHead, TableRow } from "@mui/material";

const BRQ = ({
  date,
  category,
  produitLookup,
  data = [],
  refetch,
  loading = false,
  title,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = title;

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

  const uniteLookup = {
    kg: "KG",
    unite: "Unité",
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
      field: "produit",
      title: t("Produit"),
      lookup: produitLookup,
    },
    {
      ...baseColumn,
      field: "date",
      title: t("Date"),
      editable: "never",
      render: ({ date }) => new Date(date).toLocaleDateString(),
    },
    {
      ...baseColumn,
      field: "date_debut",
      title: t("Du"),
      editable: "never",
      render: ({ date }) => getWeekStartAndEnd(date).startOfWeek,
    },
    {
      ...baseColumn,
      field: "date_fin",
      title: t("Au"),
      editable: "never",
      render: ({ date }) => getWeekStartAndEnd(date).endOfWeek,
    },
    {
      ...baseColumn,
      field: "unite",
      title: t("Unité"),
      lookup: uniteLookup,
    },
    {
      ...baseColumn,
      field: "minGros",
      title: t("Prix Minimum"),
      type: "numeric",
      groupTitle: t("Prix de gros") + ": ",
    },
    {
      ...baseColumn,
      field: "maxGros",
      title: t("Prix Maximum"),
      type: "numeric",
      groupTitle: t("Prix de gros") + ": ",
    },
    {
      ...baseColumn,
      field: "pmpGros",
      title: t("PMP Gros"),
      editable: "never",
      render: ({ minGros, maxGros }) =>
        (parseFloat(minGros) + parseFloat(maxGros)) / 2,
      exportTransformer: ({ minGros, maxGros }) =>
        (parseFloat(minGros) + parseFloat(maxGros)) / 2,
      groupTitle: t("Prix de gros") + ": ",
    },
    {
      ...baseColumn,
      field: "minDetail",
      title: t("Prix Minimum"),
      type: "numeric",
      groupTitle: t("Prix de détail") + ": ",
    },
    {
      ...baseColumn,
      field: "maxDetail",
      title: t("Prix Maximum"),
      type: "numeric",
      groupTitle: t("Prix de détail") + ": ",
    },
    {
      ...baseColumn,
      field: "pmpDetail",
      title: t("PMP detail"),
      editable: "never",
      render: ({ minDetail, maxDetail }) =>
        (parseFloat(minDetail) + parseFloat(maxDetail)) / 2,
      exportTransformer: ({ minDetail, maxDetail }) =>
        (parseFloat(minDetail) + parseFloat(maxDetail)) / 2,
      groupTitle: t("Prix de gros") + ": ",
    },
    { ...baseColumn, field: "faitsSaillants", title: t("Faits Saillants") },
  ];
  if (id !== 59)
    columns = columns.filter((column) => column.field !== "idWilaya");
  if (category !== 1)
    columns = columns.filter(
      (column) => column.field !== "date_debut" && column.field !== "date_fin"
    );

  const CustomHeader = (props) => {
    let tableCells = [
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Prix de gros"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 3,
      },
      {
        text: t("Prix de détail"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 3,
      },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
    ];
    if (id !== 59) tableCells.shift();
    else tableCells.pop();
    if (category !== 1) {
      tableCells.shift();
      tableCells.shift();
    }
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
                  idWilaya: idWilayaLookup[row.idWilaya],
                  produit: produitLookup[row.produit],
                  unite: uniteLookup[row.unite],
                  pmpGros:
                    (parseFloat(row.minGros) + parseFloat(row.maxGros)) / 2,
                  pmpDetail:
                    (parseFloat(row.minDetail) + parseFloat(row.maxDetail)) / 2,
                  date_debut: getWeekStartAndEnd(row.date).startOfWeek,
                  date_fin: getWeekStartAndEnd(row.date).endOfWeek,
                  date: new Date(row.date).toLocaleDateString(),
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
                    const {
                      pmpGros,
                      pmpDetail,
                      date_debut,
                      date_fin,
                      date: __date,
                      ...rest
                    } = newData;
                    if (hasNullableValues(rest)) return reject();
                    if (!date) {
                      toast.error(t("Veuillez saisir la date"), {
                        autoClose: 2000,
                        hideProgressBar: true,
                      });
                      return reject();
                    }
                    fetch("/api/brq/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "brq",
                        row: { ...rest, category, date, idWilaya: id },
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
                    const {
                      pmpGros,
                      pmpDetail,
                      date_debut,
                      date_fin,
                      date: __date,
                      ...rest
                    } = newData;
                    if (hasNullableValues(rest)) return reject();
                    if (isObjectContained(oldData, rest)) return resolve();
                    if (!date) {
                      toast.error(t("Veuillez saisir la date"), {
                        autoClose: 2000,
                        hideProgressBar: true,
                      });
                      return reject();
                    }
                    const { id, tableData, ...properties } = rest;
                    fetch("/api/brq/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "brq",
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
                    fetch("/api/brq/delete/" + oldData.id, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "brq",
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

export default BRQ;
