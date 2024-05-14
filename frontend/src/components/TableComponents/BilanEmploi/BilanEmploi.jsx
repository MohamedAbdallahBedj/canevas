import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { TableCell, TableHead, TableRow } from "@mui/material";

const BilanEmploi = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id, role } = user;
  const fileName = t("Bilan de l’Emploi structuré");

  const categoryLookup = {
    1: t("Techniciens supérieurs"),
    2: t("Autres techniciens et Agent de maitrise"),
    3: t("Agent Techniques"),
    4: t("Autres personnels"),
    5: t("Qualifiés spécialisés"),
    6: t("Personnels non qualifiés"),
    7: t("Apprentis"),
  };

  const profileLookup = {
    1: {
      1: t("Doctorat"),
      2: t("Magister"),
      3: t("Master"),
      4: t("Ingénieurs agronomes"),
      5: t("Vétérinaires"),
      6: t("Economistes"),
      7: t("Statisticiens"),
      8: t("Informaticiens"),
      9: t("Administrateurs"),
      10: t("Autres"),
    },
    2: {
      11: t("Techniciens supérieurs (équivalent)"),
    },
    3: {
      12: t("Techniciens"),
      13: t("Agents de maitrise"),
      14: t("Attachés d’administration"),
    },
    4: {
      15: t("Agents techniques"),
      16: t("Secrétaires OHQ "),
    },
    5: {
      17: t("Ouvriers qualifiés"),
      18: t("Agents de bureau"),
    },
    6: {
      19: t("Autres personnels de soutien (manœuvres, gardiens, etc…)"),
    },
    7: {
      20: t("Apprentis"),
    },
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
      field: "code",
      title: t("Code"),
      editable: "never",
      render: (props) => props.category,
    },
    {
      ...baseColumn,
      field: "category",
      title: t("Catégorie socio-professionnel"),
      lookup: categoryLookup,
      initialEditValue: 1,
    },
    {
      ...baseColumn,
      field: "profile",
      title: t("Profile"),
      render: (rowData) => {
        const lookup = profileLookup[rowData?.category] ?? {};
        return lookup[rowData.profile];
      },
      editComponent: (props) => {
        const { rowData, value, onChange } = props;
        const lookup = profileLookup[rowData?.category] ?? {};
        return (
          <TextField
            select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            {Object.keys(lookup).map((key) => (
              <MenuItem key={key} value={key}>
                {lookup[key]}
              </MenuItem>
            ))}
          </TextField>
        );
      },
    },
    {
      ...baseColumn,
      field: "permanents",
      title: t("Total"),
      type: "numeric",
      groupTitle: t("Permanents") + ": ",
    },
    {
      ...baseColumn,
      field: "permanentsFemmes",
      title: t("Dont femmes"),
      type: "numeric",
      groupTitle: t("Permanents") + ": ",
    },
    {
      ...baseColumn,
      field: "contractuels",
      title: t("Total"),
      type: "numeric",
      groupTitle: t("Contractuels") + ": ",
    },
    {
      ...baseColumn,
      field: "contractuelsFemmes",
      title: t("Dont femmes"),
      type: "numeric",
      groupTitle: t("Contractuels") + ": ",
    },
    {
      ...baseColumn,
      field: "soutien",
      title: t("Total"),
      type: "numeric",
      groupTitle: t("Dispositif de soutien à l’emploi") + ": ",
    },
    {
      ...baseColumn,
      field: "soutienFemmes",
      title: t("Dont femmes"),
      type: "numeric",
      groupTitle: t("Dispositif de soutien à l’emploi") + ": ",
    },
    {
      ...baseColumn,
      field: "ensemble",
      title: t("Total"),
      type: "numeric",
      editable: "never",
      groupTitle: t("Ensemble") + ": ",
      render: ({ permanents, contractuels, soutien }) =>
        parseInt(permanents) + parseInt(contractuels) + parseInt(soutien),
    },
    {
      ...baseColumn,
      field: "ensembleFemmes",
      title: t("Dont femmes"),
      type: "numeric",
      editable: "never",
      groupTitle: t("Ensemble") + ": ",
      render: ({ permanentsFemmes, contractuelsFemmes, soutienFemmes }) =>
        parseInt(permanentsFemmes) +
        parseInt(contractuelsFemmes) +
        parseInt(soutienFemmes),
    },
    {
      ...baseColumn,
      field: "date",
      initialEditValue: new Date(),
      title: t("Date"),
      type: "date",
    },
    { ...baseColumn, field: "observations", title: t("Observations") },
  ];
  if (id !== 59)
    columns = columns.filter((column) => column.field !== "idWilaya");

  const CustomHeader = (props) => {
    let tableCells = [
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Permanents"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Contractuels"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 2,
      },
      {
        text: t("Dispositif de soutien à l’emploi"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Ensemble"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
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
                        header: (item.groupTitle ?? "") + item.title,
                      }));
                      const searchedDataFormated = searchedData.map((row) => ({
                        ...row,
                        category: categoryLookup[row.category],
                        idWilaya: idWilayaLookup[row.idWilaya],
                        profile: profileLookup[row.category][row.profile],
                        ensemble:
                          parseInt(row.permanents) +
                          parseInt(row.contractuels) +
                          parseInt(row.soutien),
                        ensembleFemmes:
                          parseInt(row.permanentsFemmes) +
                          parseInt(row.contractuelsFemmes) +
                          parseInt(row.soutienFemmes),
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
                    const { ensemble, ensembleFemmes, code, ...rest } = newData;

                    if (hasNullableValues(rest)) return reject();
                    fetch("/api/bilan-emploi/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "emploi",
                        row: { ...rest, annee: campagne, idWilaya: id },
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
                    const { ensemble, ensembleFemmes, code, ...rest } = newData;
                    if (hasNullableValues(rest)) return reject();
                    if (isObjectContained(oldData, rest)) return resolve();
                    const { id, tableData, ...properties } = rest;
                    fetch("/api/bilan-emploi/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "emploi",
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
                    fetch("/api/bilan-emploi/delete/" + oldData.id, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "emploi",
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

export default BilanEmploi;
