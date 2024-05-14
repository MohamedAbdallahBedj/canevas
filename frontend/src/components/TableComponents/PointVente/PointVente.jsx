import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";
import MaterialTable from "@material-table/core";
import localizationFR from "../../../json/localizationFR.json";
import localizationAR from "../../../json/localizationAR.json";
import { toast } from "react-toastify";
import excel from "../../../exports/excel";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const PointVente = ({ campagne, data = [], refetch, loading = false }) => {
  const { t } = useTranslation();
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;  const fileName = t("Suivi de Points de Vente du Mois Ramadhan");
  const markerRef = useRef(null);
  const navigate = useNavigate();

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
      align: "center",
      field: "nomPointVente",
      title: t("Nom de Point de Vente"),
    },
    {
      align: "center",
      field: "addresse",
      title: t("Addresse de Point de Vente"),
    },
    { align: "center", field: "latitude", title: t("Latitude") },
    { align: "center", field: "longitude", title: t("Longitude") },
  ];
  const actions = [
    {
      icon: () => <EditIcon />,
      tooltip: t("Modifier le point de vente"),
      onClick: (event, rowData) => {
        navigate("modifier", { state: rowData });
      },
    },
  ];
  if (id !== 59) {
    columns = columns.filter((column) => column.field !== "idWilaya");
    actions.push({
      icon: () => <AddBoxIcon />,
      tooltip: t("Ajouter un point de vente"),
      isFreeAction: true,
      onClick: () => {
        navigate("nouveau", { state: campagne });
      },
    });
  }
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
        actions={actions}
        editable={
          id === 59
            ? {}
            : {
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    fetch("/api/pvr/delete/" + oldData.idPointVente, {
                      method: "delete",
                      credentials: 'include',
                      headers: {
                        "Content-Type": "application/json",
                      },
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
      <MapContainer
        attributionControl={false}
        center={[36.733088178381614 - 6, 3.1573597556203725]}
        zoom={5}
        style={{ width: "100%", height: "500px", marginBlockStart: 20 }}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        {data.map((item, index) => (
          <Marker
            key={`pin ${index}`}
            ref={markerRef}
            position={[item.latitude, item.longitude]}
          >
            <Popup>
              <div
                style={{
                  textAlign:
                    localStorage.getItem("i18nextLng") === "fr"
                      ? "left"
                      : "right",
                  fontFamily: "Tajawal",
                  fontSize: "14px",
                }}
              >
                <p>
                  {t("Nom de Point de Vente") + ": " + item.nomPointVente}{" "}
                  <br />{" "}
                  {t("Addresse de Point de Vente") + ": " + item.addresse}{" "}
                  <br />
                  {t("Longitude") + ": " + item.longitude} <br />
                  {t("Latitude") + ": " + item.latitude}{" "}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Typography align="center" variant="h6" display="block" gutterBottom>
        {t(
          "Veuillez Clicker sur le Pointeur, Pour Afficher les Informations Correspondants"
        )}
      </Typography>
    </>
  );
};

export default PointVente;
