import { useState, useRef, useEffect } from 'react';
import Reveal from '../components/Reveal.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import {
  ThreeCanvas,
  ThreeCanvasFullscreen,
  ThreeCanvasCard,
} from '../components/ThreeCanvas.jsx';
import { Globe } from '../components/Globe.jsx';
import { Hotel3DCard, Circuit3DCard } from '../components/ThreeDPreviews.jsx';
import { Hero3D, Hero3DBackground } from '../components/Hero3D.jsx';
import { useLanguage } from '../lib/i18n';
import { useThreeColors } from '../hooks/useThreeColors';

/**
 * ThreeUIDemo - Showcase page for ThreeUI components
 *
 * This page demonstrates all ThreeUI components integrated with the
 * El Bayadh Travels design system (colors, theming, RTL, i18n)
 */
export default function ThreeUIDemo() {
  const { language, t } = useLanguage();
  const [globeVariant, setGlobeVariant] = useState('auto');
  const [heroVariant, setHeroVariant] = useState('terrain');
  const [intensity, setIntensity] = useState(1);

  // Sample destination data (matching Django models)
  const sampleDestinations = [
    { id: 1, name: 'El Bayadh', city_name: 'El Bayadh', latitude: 33.68, longitude: 1.02, price: 120 },
    { id: 2, name: 'Timimoun', city_name: 'Timimoun', latitude: 29.27, longitude: 0.23, price: 180 },
    { id: 3, name: 'Taghit', city_name: 'Taghit', latitude: 30.92, longitude: -2.03, price: 150 },
    { id: 4, name: 'Béni Abbès', city_name: 'Béni Abbès', latitude: 30.13, longitude: -2.17, price: 200 },
    { id: 5, name: 'Tamanrasset', city_name: 'Tamanrasset', latitude: 22.79, longitude: 5.52, price: 300 },
    { id: 6, name: 'Djanet', city_name: 'Djanet', latitude: 24.56, longitude: 9.48, price: 350 },
    { id: 7, name: 'Ghardaïa', city_name: 'Ghardaïa', latitude: 32.49, longitude: 3.67, price: 160 },
    { id: 8, name: 'Ouargla', city_name: 'Ouargla', latitude: 31.95, longitude: 5.33, price: 140 },
  ];

  // Sample hotel data
  const sampleHotels = [
    { id: 1, hotel_name: 'Hotel Sahara Palace', calification_stars: 4, price: 85, city_name: 'El Bayadh' },
    { id: 2, hotel_name: 'Desert Rose Resort', calification_stars: 5, price: 150, city_name: 'Timimoun' },
    { id: 3, hotel_name: 'Oasis Hotel', calification_stars: 3, price: 60, city_name: 'Taghit' },
  ];

  // Sample circuit data
  const sampleCircuits = [
    {
      id: 1,
      pack_name: 'Grand Sahara Circuit',
      price: 850,
      means_of_transport: '4x4',
      duration_days: 7,
      description: 'Complete desert tour with camping under stars',
    },
    {
      id: 2,
      pack_name: 'Oasis Discovery',
      price: 550,
      means_of_transport: 'minibus',
      duration_days: 4,
      description: 'Visit hidden oases and ancient ksour',
    },
  ];

  const handleDestinationClick = (dest) => {
    alert(`${t('demo.destinationSelected')}: ${dest.name} (${dest.city_name})`);
  };

  const handleDestinationHover = (dest) => {
    // Could update a sidebar or tooltip
    console.log('Hovered:', dest?.name);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero with 3D background */}
      <Hero3D
        variant={heroVariant}
        intensity={intensity}
        kicker={t('demo.heroKicker')}
        title={t('demo.heroTitle')}
        subtitle={t('demo.heroSubtitle')}
        cta={{
          label: t('demo.exploreCircuits'),
          href: '#circuits',
        }}
        secondaryCta={{
          label: t('demo.viewDestinations'),
          href: '#destinations',
        }}
      >
        {/* Variant controls overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-4 px-4">
          <div className="glass-panel rounded-xl p-3 flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-terracotta">
              {t('demo.heroVariant')}
            </label>
            <select
              value={heroVariant}
              onChange={(e) => setHeroVariant(e.target.value)}
              className="input bg-transparent text-sm min-w-[140px]"
            >
              <option value="terrain">{t('demo.variant.terrain')}</option>
              <option value="particles">{t('demo.variant.particles')}</option>
              <option value="geometry">{t('demo.variant.geometry')}</option>
              <option value="constellation">{t('demo.variant.constellation')}</option>
            </select>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-terracotta">
              {t('demo.intensity')}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-32 accent-copper"
            />
            <span className="text-sm text-forest-dark w-10 text-right">{intensity.toFixed(1)}x</span>
          </div>
        </div>
      </Hero3D>

      <main className="container-site py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Interactive Globe Section */}
        <section id="destinations" className="mb-24">
          <Reveal className="mb-10">
            <SectionTitle
              kicker={t('demo.destinationsKicker')}
              title={t('demo.destinationsTitle')}
              subtitle={t('demo.destinationsSubtitle')}
              centered
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="aspect-video relative">
                <Globe
                  destinations={sampleDestinations}
                  autoRotate={globeVariant === 'auto'}
                  autoRotateSpeed={0.03}
                  showAtmosphere={true}
                  showGraticule={false}
                  markerSize={0.04}
                  onDestinationClick={handleDestinationClick}
                  onDestinationHover={handleDestinationHover}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-forest-dark">
                  <input
                    type="checkbox"
                    checked={globeVariant === 'auto'}
                    onChange={(e) => setGlobeVariant(e.target.checked ? 'auto' : 'manual')}
                    className="w-4 h-4 accent-copper rounded"
                  />
                  {t('demo.autoRotate')}
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-forest-dark">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 accent-copper rounded"
                  />
                  {t('demo.showAtmosphere')}
                </label>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Hotel 3D Previews Section */}
        <section id="hotels" className="mb-24">
          <Reveal className="mb-10">
            <SectionTitle
              kicker={t('demo.hotelsKicker')}
              title={t('demo.hotelsTitle')}
              subtitle={t('demo.hotelsSubtitle')}
              centered
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleHotels.map((hotel, index) => (
                <Reveal key={hotel.id} delay={index * 100}>
                  <Hotel3DCard hotel={hotel} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Circuit 3D Previews Section */}
        <section id="circuits" className="mb-24">
          <Reveal className="mb-10">
            <SectionTitle
              kicker={t('demo.circuitsKicker')}
              title={t('demo.circuitsTitle')}
              subtitle={t('demo.circuitsSubtitle')}
              centered
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sampleCircuits.map((circuit, index) => (
                <Reveal key={circuit.id} delay={index * 100}>
                  <Circuit3DCard circuit={circuit} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Canvas Variants Showcase */}
        <section id="canvas-variants" className="mb-24">
          <Reveal className="mb-10">
            <SectionTitle
              kicker={t('demo.canvasKicker')}
              title={t('demo.canvasTitle')}
              subtitle={t('demo.canvasSubtitle')}
              centered
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ThreeCanvasFullscreen */}
              <Reveal delay={200}>
                <div className="glass-panel rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-sand/30">
                    <h4 className="font-display font-bold text-forest-dark">{t('demo.fullscreenCanvas')}</h4>
                  </div>
                  <div className="aspect-video relative">
                    <ThreeCanvasFullscreen
                      cameraPosition={[0, 0, 5]}
                      enablePerformanceMode={false}
                    >
                      <DemoScene />
                    </ThreeCanvasFullscreen>
                  </div>
                </div>
              </Reveal>

              {/* ThreeCanvasCard */}
              <Reveal delay={300}>
                <div className="glass-panel rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-sand/30">
                    <h4 className="font-display font-bold text-forest-dark">{t('demo.cardCanvas')}</h4>
                  </div>
                  <div className="aspect-square relative p-4">
                    <ThreeCanvasCard
                      cameraPosition={[0, 0, 3]}
                      aspectRatio="1/1"
                      enablePerformanceMode={true}
                    >
                      <DemoScene />
                    </ThreeCanvasCard>
                  </div>
                </div>
              </Reveal>

              {/* ThreeCanvas (basic) */}
              <Reveal delay={400}>
                <div className="glass-panel rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-sand/30">
                    <h4 className="font-display font-bold text-forest-dark">{t('demo.basicCanvas')}</h4>
                  </div>
                  <div className="h-80 relative p-4">
                    <ThreeCanvas
                      cameraPosition={[0, 0, 4]}
                      enablePerformanceMode={true}
                    >
                      <DemoScene />
                    </ThreeCanvas>
                  </div>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <Reveal>
          <CtaBanner
            title={t('demo.ctaTitle')}
            subtitle={t('demo.ctaSubtitle')}
            primaryCta={{ label: t('demo.ctaPrimary'), href: '/contact' }}
            secondaryCta={{ label: t('demo.ctaSecondary'), href: '/circuits' }}
          />
        </Reveal>
      </main>
    </div>
  );
}

/**
 * DemoScene - Simple animated scene for canvas demos
 */
function DemoScene() {
  const { colors, materials, lighting } = useThreeColors();
  const groupRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.003;
        groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      }
    };
    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  useEffect(() => {
    // Scene setup is handled by ThreeCanvas wrapper
    // This is just for the demo objects inside
  }, []);

  return (
    <>
      {/* The actual scene content is rendered by ThreeCanvas onCreated callback */}
      {/* This component just provides the animation loop */}
      <group ref={groupRef} />
    </>
  );
}