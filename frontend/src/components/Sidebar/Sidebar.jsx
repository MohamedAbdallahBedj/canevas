import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import OptionsChip from "./OptionsChip";
import { useLocation, useNavigate } from "react-router-dom";
import sidebarElements from "../../json/sidebarElements.json";
import NotFound from "../../pages/NotFound";
import { ListItemButton, ListItemIcon } from "@mui/material";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Sidebar = ({ role, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  let { pathname } = location;
  const is_rtl = document.body.dir === "rtl";
  const sidebarElement = sidebarElements.filter(
    (item) => !item.divider && item.url === pathname
  )[0];
  const header = !is_rtl ? sidebarElement?.textFr : sidebarElement?.textAr;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const LoadSidebarElements = ({ is_rtl, list = [] }) => {
    return list.map((item) => {
      if (item.divider)
        return (
          <Divider key={`Divider ${item.labelFr}`} sx={{ fontSize: 14 }}>
            {!is_rtl ? item.labelFr : item.labelAr}
          </Divider>
        );
      else
        return (
          <ListItem
            key={item.url}
            onClick={() => {
              navigate(item.url);
            }}
            sx={{ p: 0 }}
          >
            <ListItemButton>
              <ListItemText
                sx={{ textAlign: "start" }}
                primary={!is_rtl ? item.textFr : item.textAr}
              />
              {item.new ? (
                <ListItemIcon className="pulse" sx={{ marginInlineStart: 2 }}>
                  <FiberNewIcon color="primary" />
                </ListItemIcon>
              ) : (
                <></>
              )}
            </ListItemButton>
          </ListItem>
        );
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {open ? (
            <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
              {localStorage.getItem("i18nextLng") === "fr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          ) : (
            <></>
          )}
          <Typography variant="h6" noWrap>
            {header || ""}
          </Typography>
          <OptionsChip role={role} />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader></DrawerHeader>
        <List>
          <LoadSidebarElements
            is_rtl={is_rtl}
            list={sidebarElements.filter(
              (item) => item?.access?.includes(role) && !item.hidden
            )}
          />
        </List>
      </Drawer>
      <Main open={open} sx={{ p: 2 }}>
        <DrawerHeader />
        {sidebarElement?.access?.includes(role) ? children : <NotFound />}
      </Main>
    </Box>
  );
};

export default Sidebar;
