import React, { lazy, Suspense } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Spinner from './components/Spinner.jsx';
import HomeVariantSwitcher from './components/HomeVariantSwitcher.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const HomeV1 = lazy(() => import('./pages/HomeV1.jsx'));
const HomeV2 = lazy(() => import('./pages/HomeV2.jsx'));
const HomeV3 = lazy(() => import('./pages/HomeV3.jsx'));
const HomeV4 = lazy(() => import('./pages/HomeV4.jsx'));
const Destinations = lazy(() => import('./pages/Destinations.jsx'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail.jsx'));
const Circuits = lazy(() => import('./pages/Circuits.jsx'));
const CircuitDetail = lazy(() => import('./pages/CircuitDetail.jsx'));
const Croisiere = lazy(() => import('./pages/Croisiere.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Currency = lazy(() => import('./pages/Currency.jsx'));
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Weather = lazy(() => import('./pages/Weather.jsx'));
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const PaymentHome = lazy(() => import('./pages/PaymentHome.jsx'));
const PaymentHistory = lazy(() => import('./pages/PaymentHistory.jsx'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess.jsx'));
const HadjOmra = lazy(() => import('./pages/HadjOmra.jsx'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const ThreeUIDemo = lazy(() => import('./pages/ThreeUIDemo.jsx'));

/**
 * Home route: renders the current accueil by default, or an alternative
 * concept via ?v=1|2|3|4. A floating switcher lets reviewers flip between
 * them without editing the URL.
 */
function HomeRoute() {
  const [params] = useSearchParams();
  const v = params.get('v');
  const activeV = v === '1' || v === '2' || v === '3' || v === '4' ? v : null;
  const HomePage = activeV === '1' ? HomeV1 : activeV === '2' ? HomeV2 : activeV === '3' ? HomeV3 : activeV === '4' ? HomeV4 : Home;

  return (
    <>
      <HomePage />
      <HomeVariantSwitcher activeV={activeV} />
    </>
  );
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/reselieuChoisi/:id/" element={<DestinationDetail />} />
            <Route path="/circuit/" element={<Circuits />} />
            <Route path="/circuitChoisi/:id/" element={<CircuitDetail />} />
            <Route path="/hadj-omra/" element={<HadjOmra />} />
            <Route path="/croisiere/" element={<Croisiere />} />
            <Route path="/reservCroisiere/:id/" element={<CircuitDetail />} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/blog/:slug/" element={<BlogPost />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/about/" element={<About />} />
            <Route path="/currency/" element={<Currency />} />
            <Route path="/map/" element={<MapPage />} />
            <Route path="/search/" element={<Search />} />
            <Route path="/weather/" element={<Weather />} />
            <Route path="/temoignage/" element={<Testimonials />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/payment/" element={<PaymentHome />} />
            <Route path="/payment/history/" element={<PaymentHistory />} />
            <Route path="/payment/success/" element={<PaymentSuccess />} />
            <Route path="/payment/cancel/" element={<PaymentCancel />} />
            <Route path="/threeui-demo/" element={<ThreeUIDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
