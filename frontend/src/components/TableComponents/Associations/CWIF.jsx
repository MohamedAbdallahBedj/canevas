import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";

const CWIF = ({ data = [], refetch, loading = false, relation }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t(
    "Identification des Conseils de Wilaya Interprofessionnelles de Filières Agricoles"
  );
  const idFiliereLookup = {
    1: t("Céréaliculture et Légumes Secs"),
    2: t("Elevage Bovin"),
    3: t("Elevage Ovin et Caprin"),
    4: t("Elevage Equin et Camelin"),
    5: t("Elevage Avicole et Cunicole"),
    6: t("Elevage Apicole"),
    7: t("Cultures Maraichéres et Plasticoles"),
    8: t("Cultures Industrielles"),
    9: t("Oléiculture"),
    10: t("Agrumiculture"),
    11: t("Phoeniciculture(Palmier Dattier)"),
    12: t("Autres Arboricultures Fruitiéres"),
    13: t("Viticulture et Viniculture"),
    14: t("Irrigation Agricole"),
    15: t("Mécanisation Agricole"),
    16: t(
      "Cultures Condimentaires De Plantes A Parfum Aromatique Et Medicinales"
    ),
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
    { ...baseColumn, field: "denomination", title: t("Dénomination") },
    { ...baseColumn, field: "siege", title: t("Siége") },
    { ...baseColumn, field: "numeroAgrement", title: t("Numero d'agrément") },
    {
      ...baseColumn,
      field: "dateAgrement",
      title: t("Date d'agrément"),
      type: "date",
      initialEditValue: new Date(),
    },
    {
      ...baseColumn,
      field: "idFiliere",
      title: t("Filiére"),
      type: "numeric",
      lookup: idFiliereLookup,
    },
    {
      ...baseColumn,
      field: "nombreAdherents",
      title: t("Nombre d'adhérents"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "nomPrenomPresident",
      title: t("Coordonées de Président (Nom et Prénom)"),
    },
    {
      ...baseColumn,
      field: "numeroCartePresident",
      title: t("Coordonées de Président (N° de la Carte Professionnelle)"),
    },
    {
      ...baseColumn,
      field: "telephonePresident",
      title: t("Coordonées de Président (N° Téléphone)"),
      validate: (rowData) => {
        const regex = new RegExp("([0-9]+(-[0-9]+)+)");
        return regex.test(rowData.telephonePresident);
      },
      initialEditValue: "00-00-00-00-00",
    },
    {
      ...baseColumn,
      field: "nomPrenomSG",
      title: t("Coordonées de SG (Nom et Prénom)"),
    },
    {
      ...baseColumn,
      field: "numeroCarteSG",
      title: t("Coordonées de SG (N° de la Carte Professionnelle)"),
    },
    {
      ...baseColumn,
      field: "telephoneSG",
      title: t("Coordonées de SG (N° Téléphone)"),
      validate: (rowData) => {
        const regex = new RegExp("([0-9]+(-[0-9]+)+)");
        return regex.test(rowData.telephoneSG);
      },
      initialEditValue: "00-00-00-00-00",
    },
    { ...baseColumn, field: "listeMembres", title: t("Liste de Membres") },
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
          headerStyle: { fontSize: 14 },
          rowStyle: { fontSize: 14 },
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
                  idFiliere: idFiliereLookup[row.idFiliere],
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
                    fetch("/api/associations-cooperatives/add", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: relation,
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
                    const { idConseil, tableData, ...properties } = newData;
                    fetch("/api/associations-cooperatives/edit", {
                      method: "post",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: relation,
                        properties,
                        idCol: "idConseil",
                        id: idConseil,
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
                    fetch("/api/associations-cooperatives/delete/" + oldData.idConseil, {
                      method: "delete",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: relation,
                        idCol: "idConseil",
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
        style={{ paddingInlineEnd: 20, maxWidth: "97vw" }}
      />
    </>
  );
};

export default CWIF;
