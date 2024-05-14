import { CircularProgress } from "@mui/material";

const Loading = () => {
  const is_rtl =
    localStorage.getItem("i18nextLng") === "ar" ||
    !localStorage.getItem("i18nextLng");
  const label = is_rtl ? "جاري التحميل" : "Chargement en cours";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <h1>{label}</h1>
      <CircularProgress />
    </div>
  );
};

export default Loading;
