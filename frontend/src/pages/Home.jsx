import React from "react";
import Loading from "../components/Loading/Loading";
import Sidebar from "../components/Sidebar/Sidebar";
import AuthContext from "../context/AuthContext";
import Acceuil from "../pages-sub/Acceuil";
import { Route, Routes } from "react-router-dom";
import BettraveSucrierePage from "../pages-sub/BettraveSucrierePage";
import CerealesPage from "../pages-sub/CerealesPage";
import PDTPage from "../pages-sub/PDTPage";
import AgrumesPage from "../pages-sub/AgrumesPage";
import OlivesPage from "../pages-sub/OlivesPage";
import DattesPage from "../pages-sub/DattesPage";
import PlasticulturePage from "../pages-sub/PlasticulturePage";
import AilPage from "../pages-sub/AilPage";
import OignonPage from "../pages-sub/OignonPage";
import ColzaPage from "../pages-sub/ColzaPage";
import MaisPage from "../pages-sub/MaisPage";
import LegumesSecsPage from "../pages-sub/LegumesSecsPage";
import TomateIndustiellePage from "../pages-sub/TomateIndustiellePage";
import IrrigationAppointPage from "../pages-sub/IrrigationAppointPage";
import ChambresFroidesDPVPage from "../pages-sub/ChambresFroidesDPVPage";
import AutresCanevasPage from "../pages-sub/AutresCanevasPage";
import AbbatoirsPage from "../pages-sub/AbbatoirsPage";
import VaccinationPage from "../pages-sub/VaccinationPage";
import ChambresFroidesDPAPage from "../pages-sub/ChambresFroidesDPAPage";
import ProductionAnimalePage from "../pages-sub/ProductionAnimalePage";
import EffectifsBetailsPage from "../pages-sub/EffectifsBetailsPage";
import EffectifsPetitesElevagesPage from "../pages-sub/EffectifsPetitesElevagesPage";
import EleveursPage from "../pages-sub/EleveursPage";
import ProducteursPage from "../pages-sub/ProducteursPage";
import CulturesFourrageresPage from "../pages-sub/CulturesFourrageresPage";
import VulgarisationPage from "../pages-sub/VulgarisationPage";
import CommunicationPage from "../pages-sub/CommunicationPage";
import AssociationsCooperativesPage from "../pages-sub/AssociationsCooperativesPage";
import ConseilsPage from "../pages-sub/ConseilsPage";
import PointVentePage from "../pages-sub/PointVentePage";
import PointVenteNew from "../components/TableComponents/PointVente/PointVenteNew";
import PointVenteEdit from "../components/TableComponents/PointVente/PointVenteEdit";
import TournesolPage from "../pages-sub/TournesolPage";
import PAMHuilesEssentiellesPage from "../pages-sub/PAMHuilesEssentiellesPage";
import CartesFellahPage from "../pages-sub/CartesFellahPage";
import ActivitesPages from "../pages-sub/ActivitesPages";
import BudgetPage from "../pages-sub/BudgetPage";
import FilieresAnimalesPage from "../pages-sub/FilieresAnimalesPage";
import BRQPage from "../pages-sub/BRQPage";
import EmploiPage from "../pages-sub/EmploiPage";
import FemmeRuralePage from "../pages-sub/FemmeRuralePage";
import SettingsPage from "../pages-sub/SettingsPage";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const { user, loading } = React.useContext(AuthContext);
  const params = useFetch("/api/params/years", "GET");
  const { campagnes, years, pap } = params?.data;
  if (loading || params.loading) return <Loading />;
  if (user)
    return (
      <Sidebar role={user?.role}>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route
            path="/bettrave-sucriere"
            element={<BettraveSucrierePage campagnes={campagnes || []} />}
          />
          <Route
            path="/filieres-animales"
            element={<FilieresAnimalesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/tournesol"
            element={<TournesolPage campagnes={campagnes || []} />}
          />
          <Route
            path="/pam-huiles-essentielles"
            element={<PAMHuilesEssentiellesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/cartes-fellah"
            element={<CartesFellahPage campagnes={years || []} />}
          />

          <Route
            path="/femme-rurale"
            element={<FemmeRuralePage campagnes={years || []} />}
          />
          <Route
            path="/bilan-emploi"
            element={<EmploiPage campagnes={campagnes || []} />}
          />
          <Route path="/brq" element={<BRQPage />} />
          <Route
            path="/activites"
            element={<ActivitesPages campagnes={years || []} />}
          />

          <Route
            path="/budget"
            element={<BudgetPage campagnes={years || []} />}
          />

          <Route
            path="/cereales"
            element={<CerealesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/pomme-de-terre"
            element={<PDTPage campagnes={campagnes || []} />}
          />
          <Route
            path="/agrumes"
            element={<AgrumesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/olives"
            element={<OlivesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/dattes"
            element={<DattesPage campagnes={campagnes || []} />}
          />
          <Route
            path="/plasticulture"
            element={<PlasticulturePage campagnes={campagnes || []} />}
          />
          <Route
            path="/ail"
            element={<AilPage campagnes={campagnes || []} />}
          />
          <Route
            path="/oignon"
            element={<OignonPage campagnes={campagnes || []} />}
          />
          <Route
            path="/colza"
            element={<ColzaPage campagnes={campagnes || []} />}
          />
          <Route
            path="/mais"
            element={<MaisPage campagnes={campagnes || []} />}
          />
          <Route
            path="/legumes-secs"
            element={<LegumesSecsPage campagnes={campagnes || []} />}
          />
          <Route
            path="/tomate-industrielle"
            element={<TomateIndustiellePage campagnes={campagnes || []} />}
          />
          <Route
            path="/irrigation-appoint"
            element={<IrrigationAppointPage campagnes={campagnes || []} />}
          />
          <Route
            path="/chambres-froides-DPV"
            element={<ChambresFroidesDPVPage campagnes={campagnes || []} />}
          />
          <Route
            path="/autres-canevas"
            element={<AutresCanevasPage campagnes={campagnes || []} />}
          />
          <Route path="/abbatoirs-et-tueries" element={<AbbatoirsPage />} />
          <Route
            path="/campagne-de-vaccination"
            element={<VaccinationPage campagnes={campagnes || []} />}
          />
          <Route
            path="/chambres-froides-origine-animale"
            element={<ChambresFroidesDPAPage campagnes={campagnes || []} />}
          />
          <Route
            path="/evolution-production-animale"
            element={<ProductionAnimalePage campagnes={pap} />}
          />
          <Route
            path="/evolution-effectif-animale-betail"
            element={<EffectifsBetailsPage campagnes={campagnes || []} />}
          />
          <Route
            path="/evolution-effectif-animale-petites-elevage"
            element={
              <EffectifsPetitesElevagesPage campagnes={campagnes || []} />
            }
          />
          <Route
            path="/identification-eleveurs"
            element={<EleveursPage campagnes={campagnes || []} />}
          />
          <Route
            path="/indentification-producteurs"
            element={<ProducteursPage campagnes={campagnes || []} />}
          />
          <Route
            path="/cultures-fourrageres"
            element={<CulturesFourrageresPage campagnes={campagnes || []} />}
          />
          <Route
            path="/vulgarisation"
            element={<VulgarisationPage campagnes={campagnes || []} />}
          />
          <Route
            path="/communication"
            element={<CommunicationPage campagnes={campagnes || []} />}
          />
          <Route
            path="/associations-cooperatives"
            element={
              <AssociationsCooperativesPage campagnes={campagnes || []} />
            }
          />
          <Route
            path="/associations-cooperatives-autres"
            element={
              <AssociationsCooperativesPage campagnes={campagnes || []} />
            }
          />
          <Route
            path="/conseils-administration"
            element={<ConseilsPage campagnes={campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan"
            element={<PointVentePage campagnes={campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan/nouveau"
            element={<PointVenteNew campagnes={campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan/modifier"
            element={<PointVenteEdit campagnes={campagnes || []} />}
          />
          <Route
            path="/parametres"
            element={<SettingsPage campagnes={campagnes || []} />}
          />
        </Routes>
      </Sidebar>
    );
};

export default Home;
