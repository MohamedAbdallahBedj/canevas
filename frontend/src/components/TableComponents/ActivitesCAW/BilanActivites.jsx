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
  TextField,
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

const BilanActivites = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Bilan des activités annuelles");

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
    cellStyle: { textAlign: "center", minWidth: 300 },
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
      field: "axes",
      title: t("Axes"),
      groupTitle: t("Axes et activités programés") + ": ",
      editComponent: (props) => (
        <TextField
          sx={{ fontSize: 8, minWidth: 300 }}
          variant="filled"
          multiline={true}
          value={props.value}
          placeholder={props.columnDef.title}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "activitesProgrammes",
      title: t("Activités programés"),
      groupTitle: t("Axes et activités programés") + ": ",
      editComponent: (props) => (
        <TextField
          sx={{ fontSize: 8, minWidth: 300 }}
          variant="filled"
          multiline={true}
          value={props.value}
          placeholder={props.columnDef.title}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "realisation",
      title: t("Situation de realisation"),
      groupTitle: t("Situation et date de réalisation") + ": ",
    },
    {
      ...baseColumn,
      field: "pourcentage",
      title: t("Pourcentage"),
      type: "numeric",
      groupTitle: t("Situation et date de réalisation") + ": ",
    },
    {
      ...baseColumn,
      field: "trimestre",
      title: t("Trimestre"),
      type: "numeric",
      lookup: { 1: 1, 2: 2, 3: 3, 4: 4 },
      initialEditValue: 1,
      groupTitle: t("Situation et date de réalisation") + ": ",
    },
    {
      ...baseColumn,
      field: "date",
      initialEditValue: new Date(),
      title: t("Date"),
      type: "date",
      groupTitle: t("Situation et date de réalisation") + ": ",
    },
    {
      ...baseColumn,
      field: "intitule",
      title: t("Intitulé"),
      groupTitle: t("Déroulement de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "filiere",
      title: t("Filière"),
      groupTitle: t("Déroulement de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "lieu",
      title: t("Lieu"),
      groupTitle: t("Déroulement de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "nombreJours",
      title: t("Nombre de jours"),
      type: "numeric",
      groupTitle: t("Déroulement de l'activité") + ": ",
    },
    {
      ...baseColumn,
      field: "organisation",
      title: t("Organisation"),
      groupTitle: t("Structures et / ou personnes concernées") + ": ",
    },
    {
      ...baseColumn,
      field: "colaboration",
      title: t("Colaboration"),
      groupTitle: t("Structures et / ou personnes concernées") + ": ",
    },
    {
      ...baseColumn,
      field: "coordination",
      title: t("Coordination"),
      groupTitle: t("Structures et / ou personnes concernées") + ": ",
    },
    {
      ...baseColumn,
      field: "animation",
      title: t("Animation"),
      groupTitle: t("Structures et / ou personnes concernées") + ": ",
    },
    {
      ...baseColumn,
      field: "participation",
      title: t("Participation"),
      groupTitle: t("Structures et / ou personnes concernées") + ": ",
    },
    {
      ...baseColumn,
      field: "moyens",
      title: t("Moyens déployés "),
    },

    {
      ...baseColumn,
      field: "objectifs",
      title: t("Objectifs obtenus"),
      groupTitle: t("Objectifs et résultats obtenus") + ": ",
    },
    {
      ...baseColumn,
      field: "resultats",
      title: t("Resultats obtenus"),
      groupTitle: t("Objectifs et résultats obtenus") + ": ",
    },
    {
      ...baseColumn,
      field: "obstacles",
      title: t("Obstacles ou Difficultés"),
      editComponent: (props) => (
        <TextField
          sx={{ fontSize: 8, minWidth: 300 }}
          variant="filled"
          multiline={true}
          value={props.value}
          placeholder={props.columnDef.title}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "solutions",
      title: t("Solutions Proposées"),
      editComponent: (props) => (
        <TextField
          sx={{ fontSize: 8, minWidth: 300 }}
          variant="filled"
          multiline={true}
          value={props.value}
          placeholder={props.columnDef.title}
          onChange={(e) => {
            const value = e.target.value;
            props.onChange(value);
          }}
        />
      ),
    },
    {
      ...baseColumn,
      field: "fichier",
      title: t("Pièces jointes"),
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
        text: t("Axes et activités programés"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      {
        text: t("Situation et date de réalisation"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 4,
      },
      {
        text: t("Déroulement de l'activité"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 4,
      },
      {
        text: t("Structures et / ou personnes concernées"),
        sx: { textAlign: "center", backgroundColor: "#e6e6e6" },
        colSpan: 5,
      },
      { text: "", sx: {}, colSpan: 1 },
      {
        text: t("Objectifs et résultats obtenus"),
        sx: { textAlign: "center", backgroundColor: "#d3d3d3" },
        colSpan: 2,
      },
      { text: "", sx: {}, colSpan: 1 },
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
                      tablename: "bilanActivite",
                      annee: campagne,
                      idWilaya: id,
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
                      tablename: "bilanActivite",
                      idCol: "id",
                      id: newData.id
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
                        tablename: "bilanActivite",
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

export default BilanActivites;
