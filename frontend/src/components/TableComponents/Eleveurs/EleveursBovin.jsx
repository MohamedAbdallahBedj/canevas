import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import {
  formatBoolean,
  hasNullableValues,
  isObjectContained,
} from "../../../exports/divers";
import { TableCell, TableHead, TableRow } from "@mui/material";

const EleveursBovin = ({
  data = [],
  refetch,
  loading = false,
  idCommuneLookup,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t("Identification des Eleveurs  Bovin Litières");
  const idEspeceLookup = {
    1: t("Poules Pondeuses"),
    2: t("Poulets de Chair"),
    3: t("Reproducteurs"),
    4: t("Dindes"),
    5: t("Canard"),
    6: t("Pintade"),
    7: t("Oies"),
    8: t("Autruches"),
    9: t("Caille"),
    10: t("Autres Volailles"),
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
      lookup: idCommuneLookup,
    },
    {
      ...baseColumn,
      field: "nomPrenom",
      title: t("Nom et Prénom de L'Éleveur"),
    },
    {
      ...baseColumn,
      field: "carteEleveur",
      title: t("N° Carte d’Eleveur"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "agrementSanitaire",
      title: t("N° Agrément Sanitaire"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "identificationSanitaire",
      title: t("Identification Sanitaire"),
    },
    { ...baseColumn, field: "nombreVaches", title: t("Nombre de Vaches") },
    {
      ...baseColumn,
      field: "eleveurHorsSol",
      title: t("Eleveur en Hors Sol"),
      type: "boolean",
      initialEditValue: false
    },
    {
      ...baseColumn,
      field: "superficieFourragere",
      title: t("Superficie Fourragère (Ha)"),
    },
    {
      ...baseColumn,
      field: "inseminationArtificielle",
      title: t("Insémination Artificielle"),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
    },
    {
      ...baseColumn,
      field: "reproducteur",
      title: t("Reproducteur (Velle/Génisse)"),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
    },
    {
      ...baseColumn,
      field: "acquisitionFourrageEnrubannee",
      title: t("Acquisition de Fourrage Enrubannée "),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
    },
    {
      ...baseColumn,
      field: "semenceFourragere",
      title: t("Acquisition de Semence Fourragère"),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
    },
    {
      ...baseColumn,
      field: "primeEnsilage",
      title: t("Prime d'Ensilage"),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
    },
    {
      ...baseColumn,
      field: "primeLait",
      title: t("Prime Lait"),
      type: "boolean",
      initialEditValue: false,
      mainField: t("Adhérant au Programme de") + ": ",
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
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Adhérant au Programme de"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 6,
      },
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
                  header: item.title,
                }));
                const searchedDataFormated = searchedData.map((row) => ({
                  ...row,
                  eleveurHorsSol: formatBoolean(row.eleveurHorsSol),
                  inseminationArtificielle: formatBoolean(
                    row.inseminationArtificielle
                  ),
                  reproducteur: formatBoolean(row.reproducteur),
                  acquisitionFourrageEnrubannee: formatBoolean(
                    row.acquisitionFourrageEnrubannee
                  ),
                  semenceFourragere: formatBoolean(row.semenceFourragere),
                  primeEnsilage: formatBoolean(row.primeEnsilage),
                  primeLait: formatBoolean(row.primeLait),
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
                    fetch("/api/identification-eleveurs/add", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "listeEleveursBovins",
                        row: { ...newData, idWilaya: id },
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
                    const { id, tableData, ...properties } = newData;
                    fetch("/api/identification-eleveurs/edit", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "listeEleveursBovins",
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
                    fetch("/api/identification-eleveurs/delete/" + oldData.id, {
                      method: "delete",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "listeEleveursBovins",
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

export default EleveursBovin;
