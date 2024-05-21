import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import { TableCell, TableHead, TableRow, TextField } from "@mui/material";

const CartesFellah = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Bilan mensuel de l'utilisation des cartes fellah");

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

  const moisLookup = {
    1: t("Janvier"),
    2: t("Février"),
    3: t("Mars"),
    4: t("Avril"),
    5: t("Mai"),
    6: t("Juin"),
    7: t("Juillet"),
    8: t("Août"),
    9: t("Septembre"),
    10: t("Octobre"),
    11: t("Novembre"),
    12: t("Décembre"),
    13: t("Année entière"),
  };
  const typeCarteLookup = {
    1: t("Personne physique"),
    2: t("Personne moral"),
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
      field: "mois",
      title: t("Mois"),
      lookup: moisLookup,
    },
    {
      ...baseColumn,
      field: "typeCarte",
      title: t("Type de carte"),
      lookup: typeCarteLookup,
    },
    {
      ...baseColumn,
      field: "cartesRecues",
      title: t("Nombre de cartes recues"),
      type: "numeric",
      groupTitle: t("Les cartes recues") + ": ",
    },
    {
      ...baseColumn,
      field: "cartesRecuesNumeroSerie",
      title: t("Liste des numéros de série"),
      type: "text",
      groupTitle: t("Les cartes recues") + ": ",
      editComponent: (props) => (
        <TextField
          variant="outlined"
          multiline={4}
          value={props.value}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "cartesUtilisee",
      title: t("Nombre de cartes utilisées"),
      type: "numeric",
      groupTitle: t("Les cartes utilisées") + ": ",
    },
    {
      ...baseColumn,
      field: "cartesUtiliseeNumeroSerie",
      title: t("Liste des numéros de série"),
      type: "text",
      groupTitle: t("Les cartes utilisées") + ": ",
      editComponent: (props) => (
        <TextField
          variant="outlined"
          multiline={4}
          value={props.value}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "cartesAbimee",
      title: t("Nombre de cartes Abimées"),
      type: "numeric",
      groupTitle: t("Les cartes Abimées") + ": ",
    },
    {
      ...baseColumn,
      field: "cartesAbimeeNumeroSerie",
      title: t("Liste des numéros de série"),
      type: "text",
      groupTitle: t("Les cartes Abimées") + ": ",
      editComponent: (props) => (
        <TextField
          variant="outlined"
          multiline={4}
          value={props.value}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "cartesRestantes",
      title: t("Nombre de cartes Restantes"),
      type: "numeric",
      groupTitle: t("Les cartes Restantes") + ": ",
    },
    {
      ...baseColumn,
      field: "cartesRestantesNumeroSerie",
      title: t("Liste des numéros de série"),
      type: "text",
      groupTitle: t("Les cartes Restantes") + ": ",
      editComponent: (props) => (
        <TextField
          variant="outlined"
          multiline={4}
          value={props.value}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
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

  const CustomHeader = (props) => {
    let tableCells = [
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Les cartes recues"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Les cartes utilisées"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 2,
      },
      {
        text: t("Les cartes Abimées"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Les cartes Restantes"),
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
                  mois: moisLookup[row.mois],
                  typeCarte: typeCarteLookup[row.typeCarte],
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
                    const {
                      cartesRecues,
                      cartesUtilisee,
                      cartesAbimee,
                      cartesRestantes,
                    } = newData;
                    if (
                      cartesRecues <
                      cartesUtilisee + cartesRestantes
                    ) {
                      toast.error(t("Les données saisies sont incorrectes (Nombre de cartes recues  doit etre superieure ou égale au nombre de cartes utilisées + cartes restantes)"), {
                        autoClose: 2000,
                        hideProgressBar: true,
                      });
                      return reject();
                    }
                    fetch("/api/cartes-fellah/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "consommationCartes",
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
                    const {
                      cartesRecues,
                      cartesUtilisee,
                      cartesAbimee,
                      cartesRestantes,
                    } = newData;
                    if (
                      cartesRecues <
                      cartesUtilisee + cartesAbimee + cartesRestantes
                    ) {
                      toast.error(t("Les données saisies sont incorrectes (Nombre de cartes recues  doit etre superieure ou égale au nombre de cartes utilisées + cartes restantes)"), {
                        autoClose: 2000,
                        hideProgressBar: true,
                      });
                      return reject();
                    }
                    const { id, tableData, ...properties } = newData;
                    fetch("/api/cartes-fellah/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "consommationCartes",
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
                    fetch("/api/cartes-fellah/delete/" + oldData.id, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "consommationCartes",
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

export default CartesFellah;
