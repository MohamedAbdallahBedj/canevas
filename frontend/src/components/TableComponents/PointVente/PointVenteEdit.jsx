import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "../../../pages/NotFound";
import DeleteIcon from "@mui/icons-material/Delete";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../Loading/Loading";
import { isObjectContained } from "../../../exports/divers";
import { toast } from "react-toastify";
import AuthContext from "../../../context/AuthContext";

const is_rtl =
  localStorage.getItem("i18nextLng") === "ar" ||
  !localStorage.getItem("i18nextLng");

const PointVenteEdit = () => {
  const { data, loading, error } = useFetch("/api/api/table", "GET", {
    table: "pointsVentesProduits",
  });
  const { user } = React.useContext(AuthContext);
  const { idWilaya: id } = user;
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const enteries = data.map((item) => [
    item.idProduit,
    item[`produit${is_rtl ? "Ar" : "Fr"}`],
  ]);
  const dict = Object.fromEntries(enteries);
  const { t } = useTranslation();
  const { state: pointVente } = useLocation();
  const [products, setProducts] = React.useState(pointVente.products || []);
  const [latLong, setLatLong] = React.useState([
    pointVente.latitude,
    pointVente.longitude,
  ]);

  const handleProductSubmit = (event) => {
    event.preventDefault();
    const idProduit = parseInt(event.target.idProduit.value);
    const quantiteDisponible = parseInt(event.target.quantiteDisponible.value);
    const prixVente = parseInt(event.target.prixVente.value);
    const ids = products.map((p) => p.idProduit);
    if (ids.includes(idProduit))
      return toast.error(t("Produit existe deja!"), {
        autoClose: 2000,
        hideProgressBar: true,
      });

    setProducts((previous) => [
      ...previous,
      {
        idProduit,
        quantiteDisponible,
        prixVente,
        idPointVente: pointVente.idPointVente,
      },
    ]);
    event.target.reset();
    return;
  };
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setLatLong([lat, lng]);
        }
      },
    }),
    []
  );
  const handleSubmit = async (event) => {
    if (id === 59) return;
    event.preventDefault();
    const nomPointVente = event.target.nomPointVente.value;
    const addresse = event.target.addresse.value;
    const type = event.target.type.value;
    const newData = {
      nomPointVente,
      addresse,
      type,
      products,
      latitude: latLong[0],
      longitude: latLong[1],
    };

    fetch("/api/pvr/edit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: pointVente.idPointVente,
        row: { ...newData },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          navigate(-1);
          toast.error(response.statusText, {
            autoClose: 2000,
            hideProgressBar: true,
          });
          throw new Error(response.statusText);
        }
        toast.success(t("Succès"), {
          autoClose: 2000,
          hideProgressBar: true,
        });
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!pointVente || error) return <NotFound />;
  if (loading) return <Loading />;
  return (
    <Box sx={{ mb: 5, py: 2, width: "70%", mx: "auto" }}>
      <Stack component="form" onSubmit={handleSubmit} gap={2} mb={2}>
        <Stack gap={1} direction="row">
          <TextField
            required
            fullWidth
            id="nomPointVente"
            label={t("Nom de Point de Vente")}
            name="nomPointVente"
            defaultValue={pointVente.nomPointVente}
          />
          <TextField
            required
            fullWidth
            id="addresse"
            label={t("Addresse de Point de Vente")}
            name="addresse"
            defaultValue={pointVente.addresse}
          />
        </Stack>
        <TextField
          required
          fullWidth
          id="type"
          label={t("Type de Point de Vente")}
          name="type"
          defaultValue={pointVente.type}
        />
        <Stack gap={1} direction="row">
          <TextField
            required
            fullWidth
            id="longitude"
            label={t("Longitude")}
            name="longitude"
            value={latLong[0]}
            onChange={(e) => {
              setLatLong((previous) => [e.target.value, previous[1]]);
            }}
          />
          <TextField
            required
            fullWidth
            id="latitude"
            label={t("Latitude")}
            name="latitude"
            value={latLong[1]}
            onChange={(e) => {
              setLatLong((previous) => [previous[0], e.target.value]);
            }}
          />
        </Stack>
        <MapContainer
          zoom={7}
          style={{ width: "100%", height: "400px", marginInline: "auto" }}
          center={[latLong[0], latLong[1]]}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
          <Marker
            ref={markerRef}
            position={latLong}
            draggable={true}
            eventHandlers={eventHandlers}
          >
            <Popup></Popup>
          </Marker>
        </MapContainer>
        <Typography align="center" variant="h6" display="block" gutterBottom>
          {t(
            "Veuillez Glisser le Pointeur, ou Modifier les Valeurs Longitude/Latitude dans Les Champs Correspondants pour Déterminer la Position du Point de Vente"
          )}
        </Typography>
        <Stack
          gap={1}
          sx={{
            position: "fixed",
            right: 5,
            bottom: 5,
          }}
        >
          {id !== 59 ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ minWidth: 150 }}
            >
              {t("Modifier")}
            </Button>
          ) : (
            <></>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              navigate(-1);
            }}
            sx={{ minWidth: 150 }}
          >
            {t("Annuler")}
          </Button>
        </Stack>
      </Stack>
      {id !== 59 ? (
        <Stack
          component="form"
          onSubmit={handleProductSubmit}
          gap={1}
          direction="row"
          flexWrap="wrap"
        >
          <TextField
            id="idProduit"
            select
            label={t("Liste de Produits Disponibles")}
            variant="outlined"
            name="idProduit"
            sx={{ width: 250 }}
            defaultValue={"1"}
          >
            {data.map((item, index) => (
              <MenuItem key={index} value={item.idProduit}>
                {item[`produit${is_rtl ? "Ar" : "Fr"}`]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            fullWidth
            type="number"
            id="quantiteDisponible"
            label={t("Quantité (Kg)")}
            name="quantiteDisponible"
            sx={{ maxWidth: 350 }}
          />
          <TextField
            required
            type="number"
            fullWidth
            id="prixVente"
            label={t("Prix de Vente (DA)")}
            sx={{ maxWidth: 350 }}
            name="prixVente"
          />
          <Button
            variant="contained"
            color="info"
            type="submit"
            sx={{ minWidth: 150 }}
          >
            {t("Ajouter")}
          </Button>
        </Stack>
      ) : (
        <></>
      )}

      <Typography mt={2} variant="h6">
        {t("Liste de Produits Disponibles")}
      </Typography>
      {products.length ? (
        <></>
      ) : (
        <Typography component="span" variant="body1" color="text.primary">
          {t("Liste Vide")}
        </Typography>
      )}
      <Stack
        direction="row"
        gap={1}
        sx={{
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {products.map((item, index) => (
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            bgcolor="#e6e6e6"
            p={2}
            borderRadius={1}
            key={`Product ${index}`}
          >
            <Typography component="span" variant="h6" color="text.primary">
              {dict[item.idProduit]}
            </Typography>
            <Typography component="span" variant="body1" color="text.primary">
              {item.quantiteDisponible + " " + (is_rtl ? "كغ" : "KG")}
            </Typography>
            |
            <Typography component="span" variant="body1" color="text.primary">
              {item.prixVente + " " + (is_rtl ? "دج" : "DA")}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => {
                setProducts((previous) =>
                  previous.filter(
                    (element) => !isObjectContained(item, element)
                  )
                );
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default PointVenteEdit;
