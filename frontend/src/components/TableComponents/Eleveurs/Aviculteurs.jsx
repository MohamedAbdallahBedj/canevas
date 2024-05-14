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

const Aviculteurs = ({
  data = [],
  refetch,
  loading = false,
  idCommuneLookup,
}) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t("Liste des Aviculteurs par Type d'Elevage Avicole");
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
      field: "nomRaisonSocial",
      title: t("Nom et Prénom ou Raison Social"),
    },
    {
      ...baseColumn,
      field: "idEspece",
      title: t("Espéce"),
      lookup: idEspeceLookup,
    },
    {
      ...baseColumn,
      field: "addresse",
      title: t("Adresse"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "agrementSanitaire",
      title: t("N° Agrément Sanitaire"),
    },
    {
      ...baseColumn,
      field: "sansAgrement",
      title: t("Sans Agrément"),
      type: "boolean",
      initialEditValue: false,
    },
    {
      ...baseColumn,
      field: "numeroCarteEleveur",
      title: t("N° Carte d’Eleveur"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "denominationStructureEtatique",
      title: t("Etatique"),
      type: "boolean",
      initialEditValue: true,
      groupTitle: t("Dénomination de La Structure") + ": ",
    },
    {
      ...baseColumn,
      field: "denominationStructurePrive",
      title: t("Privé"),
      type: "boolean",
      initialEditValue: false,
      groupTitle: t("Dénomination de La Structure") + ": ",
    },
    {
      ...baseColumn,
      field: "exploitationAvicoleNombreBatiments",
      title: t("Nombre de Bâtiments"),
      type: "numeric",
      groupTitle: t("Exploitation Avicole") + ": ",
    },
    {
      ...baseColumn,
      field: "exploitationAvicoleCapacite",
      title: t("Capacité Instantanée (Sujet)"),
      type: "numeric",
      groupTitle: t("Exploitation Avicole") + ": ",
    },
    {
      ...baseColumn,
      field: "serreAvicoleNombreBatiments",
      title: t("Nombre de Bâtiments"),
      type: "numeric",
      groupTitle: t("Serres Avicoles") + ": ",
    },
    {
      ...baseColumn,
      field: "serreAvicoleCapacite",
      title: t("Capacité Instantanée (Sujet)"),
      type: "numeric",
      groupTitle: t("Serres Avicoles") + ": ",
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
      {
        text: t("Dénomination de La Structure"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Exploitation Avicole"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 2,
      },
      {
        text: t("Serres Avicoles"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
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
                  sansAgrement: formatBoolean(row.sansAgrement),
                  denominationStructureEtatique: formatBoolean(
                    row.denominationStructureEtatique
                  ),
                  denominationStructurePrive: formatBoolean(
                    row.denominationStructurePrive
                  ),
                  idWilaya: idWilayaLookup[row.idWilaya],
                  idEspece: idEspeceLookup[row.idEspece],
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
                        tablename: "listeAviculteurs",
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
                        tablename: "listeAviculteurs",
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
                        tablename: "listeAviculteurs",
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

export default Aviculteurs;
