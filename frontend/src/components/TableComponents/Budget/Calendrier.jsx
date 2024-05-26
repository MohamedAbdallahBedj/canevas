import React from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable, { MTableBody } from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { hasNullableValues, isObjectContained } from "../../../exports/divers";
import { TableCell, TableFooter, TableRow } from "@mui/material";
import tafqeet from "../../../exports/tafqeet";

const Calendrier = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const fileName = t("Calendrier budgétaire général");
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

  const typeLookup = {
    1: "مداخيل",
    2: "نفقات",
  };
  const designationLookup = {
    "الأجور والمنح ": "الأجور والمنح ",
    "الخدمات ": "الخدمات ",
    "الضرائب والرسوم": "الضرائب والرسوم",
    "المواد المستهلكة": "المواد المستهلكة",
    "أعباء هيئات التسيير": "أعباء هيئات التسيير",
    "أعباء المعدات والاثاث": "أعباء المعدات والاثاث",
    "أعباء معدات النقل": "أعباء معدات النقل",
    "أعباء ترميم المقر": "أعباء ترميم المقر",
    "أعباء بناء المقر": "أعباء بناء المقر",
    "مداخيل الاستمارة البيانية العادية للمستثمرة. ":
      "مداخيل الاستمارة البيانية العادية للمستثمرة. ",
    "مداخيل التسجيلات الجديدة ": "مداخيل التسجيلات الجديدة ",
    "مداخيل الاستمارة البيانية الإضافية للمستثمرة. ":
      "مداخيل الاستمارة البيانية الإضافية للمستثمرة. ",
    "مداخيل الاستمارة البيانية التكميلية للمستثمرة.":
      "مداخيل الاستمارة البيانية التكميلية للمستثمرة.",
    "مداخيل النسخة الثانية من البطاقة المهنية.":
      "مداخيل النسخة الثانية من البطاقة المهنية.",
    "مداخيل الرعاية": "مداخيل الرعاية",
    "مداخيل استثنائية أخرى": "مداخيل استثنائية أخرى",
    "رؤوس الأموال المحولة في الرصيد البنكي.":
      "رؤوس الأموال المحولة في الرصيد البنكي.",
    "الجباية المحولة من الغرفة الوطنية للفلاحة في شكل إعانات الاستثمار ":
      "الجباية المحولة من الغرفة الوطنية للفلاحة في شكل إعانات الاستثمار ",
    "مصادر أخرى لتمويل الاستثمار. ": "مصادر أخرى لتمويل الاستثمار. ",
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
      field: "type",
      title: t("Type"),
      lookup: typeLookup,
    },
    {
      ...baseColumn,
      field: "numeroCompte",
      title: t("Numéro de compte"),
    },
    {
      ...baseColumn,
      field: "designation",
      title: t("Désignation"),
      lookup: designationLookup,
    },
    {
      ...baseColumn,
      field: "montantEstime",
      title: t("Montant estimé pour l'année en cours (DA)"),
      type: "numeric",
    },
    {
      ...baseColumn,
      field: "date",
      title: t("Date"),
      type: "date",
      initialEditValue: new Date(),
    },
    {
      ...baseColumn,
      field: "observation",
      title: t("Observations"),
    },
  ];
  if (id !== 59)
    columns = columns.filter((column) => column.field !== "idWilaya");

  const CustomFooter = (props) => {
    const { renderData } = props;
    const sumRevenues = renderData
      .filter((item) => item.type === 1)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.montantEstime;
      }, 0);
    const sumDepenses = renderData
      .filter((item) => item.type === 2)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.montantEstime;
      }, 0);

    return (
      <>
        <MTableBody {...props} />
        <TableFooter
          sx={{
            paddingInlineEnd: 20,
          }}
        >
          <TableRow>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
              colSpan={id !== 59 ? 3 : 4}
            >
              {t("Revenu total")}
            </TableCell>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
            >{`${sumRevenues} ${t("DA")}`}</TableCell>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
            >
              {tafqeet(sumRevenues)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
              colSpan={id !== 59 ? 3 : 4}
            >
              {t("Dépenses totales")}
            </TableCell>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
            >{`${sumDepenses} ${t("DA")}`}</TableCell>
            <TableCell
              sx={{ textAlign: "center", fontSize: 16, fontWeight: "medium" }}
            >
              {tafqeet(sumDepenses)}
            </TableCell>
          </TableRow>
        </TableFooter>
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
                  type: typeLookup[row.type],
                  designation: designationLookup[row.designation],
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
                    const { differences, ...rest } = newData;
                    if (hasNullableValues(rest)) return reject();
                    fetch("/api/budget/add", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "calendrier",
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
                    const { differences, ...rest } = newData;
                    if (hasNullableValues(rest)) return reject();
                    if (isObjectContained(oldData, rest)) return resolve();
                    const { id, tableData, ...properties } = rest;
                    fetch("/api/budget/edit", {
                      method: "post",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "calendrier",
                        properties,
                        idCol: "id",
                        id,
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
                    fetch("/api/budget/delete/" + oldData.id, {
                      method: "delete",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        tablename: "calendrier",
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
          Body: CustomFooter,
        }}
      />
    </>
  );
};

export default Calendrier;
