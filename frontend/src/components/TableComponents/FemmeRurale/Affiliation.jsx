import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableHeader } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import {
  Button,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Affiliation = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Recensement de la femme agricultrice et ces activités");

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

  const zoneLookup = {
    1: t("Zone rural"),
    2: t("Zone d'ombre"),
    3: t("Zone urbaine"),
  };

  const baseColumn = {
    align: "center",
    mainField: "",
    initialEditValue: "",
    cellStyle: { textAlign: "center", minWidth: 250 },
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
      field: "prenom",
      title: t("Prénom"),
      groupTitle: t("Présentation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "nom",
      title: t("Nom"),
      groupTitle: t("Présentation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "dateNaissance",
      title: t("Date de naissance"),
      type: "date",
      initialEditValue: new Date(),
      groupTitle: t("Présentation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "telephone",
      title: t("Téléphone"),
      groupTitle: t("Présentation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "daira",
      title: t("Daira"),
      groupTitle: t("Adresse de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "commune",
      title: t("Commune"),
      groupTitle: t("Adresse de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "village",
      title: t("Village"),
      groupTitle: t("Adresse de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "zone",
      title: t("Zone d'Activité"),
      lookup: zoneLookup,
    },
    {
      ...baseColumn,
      field: "numeroNational",
      title: t("Numéro nationale"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "codeActivite",
      title: t("Code d'Activité"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "activite",
      title: t("Activité Principale "),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "activiteFiliere",
      title: t("Filière d'activité principale"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "activiteSecondaire",
      title: t("Activité Secondaire"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "activiteSecondaireFiliere",
      title: t("Filière d'activité Secondaire"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "produits",
      title: t("Productions Agro-Industrielles"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "localisation",
      title: t("Localisation Géographique de l'activité  GPS"),
      groupTitle:
        t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "mouvementAssociatif",
      type: "boolean",
      initialEditValue: false,
      title: t("Mouvement Associatif"),
      groupTitle: t("Niveau d'organisation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "mouvementCooperatif",
      type: "boolean",
      initialEditValue: false,
      title: t("Mouvement Coopératif"),
      groupTitle: t("Niveau d'organisation de la femme agricultrice") + ": ",
    },
    {
      ...baseColumn,
      field: "preoccupations",
      title: t("Préoccupations de la Femme Agricultrice"),
      groupTitle:
        t(
          "Préoccupations de la femme agricultrice et soutien à la profession agricole"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "intervention",
      title: t("Intervention de la Profession Agricole"),
      groupTitle:
        t(
          "Préoccupations de la femme agricultrice et soutien à la profession agricole"
        ) + ": ",
    },
    {
      ...baseColumn,
      field: "realisations",
      title: t("Réalisations"),
      groupTitle: t("Femme Agricultrice Leader") + ": ",
    },
    {
      ...baseColumn,
      field: "date",
      initialEditValue: new Date(),
      title: t("Date"),
      type: "date",
    },
    {
      ...baseColumn,
      field: "fichier",
      title: t("Fiche Technique"),
      groupTitle: t("Fichier joint") + ": ",
      initialEditValue: null,
      render: (props) => {
        if (props.fichier)
          return (
            <Link
              target="_blank"
              to={`/api/uploads/${props.fichier}`}
              download={true}
            >
              <IconButton>
                <DownloadForOfflineIcon />
              </IconButton>
            </Link>
          );
        else return <></>;
      },
      editComponent: (props) => (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            name="cover"
            accept=".doc, .docx, .pdf"
            onChange={(e) => {
              props.onChange(e?.target?.files[0] || null);
            }}
          />
        </Button>
      ),
    },
  ];
  if (id !== 59)
    columns = columns.filter((column) => column.field !== "idWilaya");

  const CustomHeader = (props) => {
    let tableCells = [
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Présentation de la femme agricultrice"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 4,
      },
      {
        text: t("Adresse de l'activité"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 3,
      },
      { text: "", sx: {}, colSpan: 1 },

      {
        text: t(
          "Présentation des activités de la femme agricultrice et de sa localisation géographique"
        ),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 8,
      },
      {
        text: t("Niveau d'organisation de la femme agricultrice"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t(
          "Préoccupations de la femme agricultrice et soutien à la profession agricole"
        ),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 2,
      },
      {
        text: t("Femme Agricultrice Leader"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 1,
      },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Fichier joint"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 1,
      },
      { text: "", sx: {}, colSpan: 2 },
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
                      tablename: "femmeRuraleAffiliee",
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
                      tablename: "femmeRuraleAffiliee",
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
                        tablename: "femmeRuraleAffiliee",
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

export default Affiliation;
