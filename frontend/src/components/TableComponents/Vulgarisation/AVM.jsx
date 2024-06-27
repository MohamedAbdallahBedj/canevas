import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const AVM = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t("Actions de Vulgarisation de Masse");

  const idTypeLookup = {
    1: t("Activité d’émulation "),
    2: t("Manifestation Scientifique/Technique"),
  };
  const natureLookup1 = {
    "Journée Nationale": t("Journée Nationale"),
    "Foire ou Fetes": t("Foire ou Fetes"),
    Forum: t("Forum"),
    Symporium: t("Symporium"),
    Autres: t("Autres"),
  };

  const natureLookup2 = {
    Atelier: t("Atelier"),
    Séminaire: t("Séminaire"),
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
      field: "idType",
      title: t("Type d'Activité"),
      lookup: idTypeLookup,
      initialEditValue: 1,
    },
    {
      ...baseColumn,
      field: "nature",
      title: t("Nature de la Manifestation"),
      // lookup: { ...natureLookup1, ...natureLookup2 },
      editComponent: (props) => {
        return (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label"></InputLabel>
            <Select
              variant="outlined"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={props.value}
              onChange={(e) => {
                const value = e.target.value;
                props.onChange(value);
              }}
            >
              <MenuItem disabled>{t("Activité d’émulation ")}</MenuItem>
              <Divider />
              {Object.keys(natureLookup1).map((key) => (
                <MenuItem value={key} key={`SelectKey ${key}`}>
                  {natureLookup1[key]}
                </MenuItem>
              ))}
              <MenuItem disabled>
                {t("Manifestation Scientifique/Technique")}
              </MenuItem>
              <Divider />
              {Object.keys(natureLookup2).map((key) => (
                <MenuItem value={key} key={`SelectKey ${key}`}>
                  {natureLookup2[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    { ...baseColumn, field: "intitule", title: t("Intitulé") },
    { ...baseColumn, field: "objectif", title: t("Objectif") },
    { ...baseColumn, field: "organisateurs", title: t("Organisateurs") },
    {
      ...baseColumn,
      field: "date",
      title: t("Date"),
      type: "date",
      initialEditValue: new Date(),
    },
    { ...baseColumn, field: "lieu", title: t("Lieu") },
    {
      ...baseColumn,
      field: "nombreAgriculteurs",
      title: t("Nombre de Participants (Agriculteurs)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "nombreCadres",
      title: t("Nombre de Participants (Cadres)"),
      type: "numeric",
    },
    { ...baseColumn, field: "observations", title: t("Observations") },
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
                const natureLU = {
                  ...natureLookup1,
                  ...natureLookup2,
                };
                const searchedDataFormated = searchedData.map((row) => ({
                  ...row,
                  idWilaya: idWilayaLookup[row.idWilaya],
                  idType: idTypeLookup[row.idType],
                  nature: natureLU[row.nature],
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
                    fetch("/api/vulgarisation/add", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "actionVulgarisationMasse",
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
                    fetch("/api/vulgarisation/edit", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "actionVulgarisationMasse",
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
                    fetch("/api/vulgarisation/delete/" + oldData.idSuivi, {
                      method: "delete",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "actionVulgarisationMasse",
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

export default AVM;
