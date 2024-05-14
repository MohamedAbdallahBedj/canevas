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

const Home = () => {
  const { user, loading } = React.useContext(AuthContext);
  const data = { campagnes: [2021, 2022, 2023] };
  if (loading) return <Loading />;
  if (user)
    return (
      <Sidebar role={user?.role}>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route
            path="/bettrave-sucriere"
            element={<BettraveSucrierePage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/filieres-animales"
            element={<FilieresAnimalesPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/tournesol"
            element={<TournesolPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/pam-huiles-essentielles"
            element={
              <PAMHuilesEssentiellesPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/cartes-fellah"
            element={<CartesFellahPage campagnes={data.campagnes || []} />}
          />

          <Route
            path="/femme-rurale"
            element={<FemmeRuralePage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/bilan-emploi"
            element={<EmploiPage campagnes={data.campagnes || []} />}
          />
          <Route path="/brq" element={<BRQPage />} />
          <Route
            path="/activites"
            element={<ActivitesPages campagnes={data.campagnes || []} />}
          />

          <Route
            path="/budget"
            element={<BudgetPage campagnes={data.campagnes || []} />}
          />

          <Route
            path="/cereales"
            element={<CerealesPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/pomme-de-terre"
            element={<PDTPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/agrumes"
            element={<AgrumesPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/olives"
            element={<OlivesPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/dattes"
            element={<DattesPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/plasticulture"
            element={<PlasticulturePage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/ail"
            element={<AilPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/oignon"
            element={<OignonPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/colza"
            element={<ColzaPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/mais"
            element={<MaisPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/legumes-secs"
            element={<LegumesSecsPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/tomate-industrielle"
            element={<TomateIndustiellePage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/irrigation-appoint"
            element={<IrrigationAppointPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/chambres-froides-DPV"
            element={
              <ChambresFroidesDPVPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/autres-canevas"
            element={<AutresCanevasPage campagnes={data.campagnes || []} />}
          />
          <Route path="/abbatoirs-et-tueries" element={<AbbatoirsPage />} />
          <Route
            path="/campagne-de-vaccination"
            element={<VaccinationPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/chambres-froides-origine-animale"
            element={
              <ChambresFroidesDPAPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/evolution-production-animale"
            element={
              <ProductionAnimalePage
                campagnes={[2017, 2018, 2019, 2020, 2021, 2022]}
              />
            }
          />
          <Route
            path="/evolution-effectif-animale-betail"
            element={<EffectifsBetailsPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/evolution-effectif-animale-petites-elevage"
            element={
              <EffectifsPetitesElevagesPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/identification-eleveurs"
            element={<EleveursPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/indentification-producteurs"
            element={<ProducteursPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/cultures-fourrageres"
            element={
              <CulturesFourrageresPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/vulgarisation"
            element={<VulgarisationPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/communication"
            element={<CommunicationPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/associations-cooperatives"
            element={
              <AssociationsCooperativesPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/associations-cooperatives-autres"
            element={
              <AssociationsCooperativesPage campagnes={data.campagnes || []} />
            }
          />
          <Route
            path="/conseils-administration"
            element={<ConseilsPage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan"
            element={<PointVentePage campagnes={data.campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan/nouveau"
            element={<PointVenteNew campagnes={data.campagnes || []} />}
          />
          <Route
            path="/points-vente-ramadhan/modifier"
            element={<PointVenteEdit campagnes={data.campagnes || []} />}
          />
          <Route
            path="/parametres"
            element={<SettingsPage campagnes={data.campagnes || []} />}
          />
        </Routes>
      </Sidebar>
    );
};

export default Home;
