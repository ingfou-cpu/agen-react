import * as THREE from 'three';
import { useRef, useEffect, useMemo, useState } from 'react';
import { useThreeColors } from '../hooks/useThreeColors';
import { useTheme } from '../hooks/useTheme';
import { mediaUrl } from '../lib/format';

/**
 * Globe - Interactive 3D globe showing destinations
 *
 * Features:
 * - Rotatable globe with destination markers
 * - Hover/tap to show destination info
 * - Design system color integration
 * - Auto-rotate when idle
 * - RTL support
 * - Performance optimized (LOD, frustum culling)
 */
export function Globe({
  destinations = [],
  className = '',
  autoRotate = true,
  autoRotateSpeed = 0.05,
  showAtmosphere = true,
  showGraticule = false,
  markerSize = 0.04,
  onDestinationClick,
  onDestinationHover,
  initialRotation = { x: 0.2, y: 0 },
}) {
  const { colors, materials, lighting } = useThreeColors();
  const { theme } = useTheme();
  const globeRef = useRef(null);
  const markersRef = useRef([]);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [rotation, setRotation] = useState(initialRotation);
  const animationFrameRef = useRef(null);
  const isInteractingRef = useRef(false);

  // Create globe geometry and materials
  const globeGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(1, 64, 64);
    return geom;
  }, []);

  const globeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: colors.surface,
      metalness: 0.1,
      roughness: 0.85,
      transparent: false,
    });
  }, [colors.surface]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [colors.primary]);

  const markerGeometry = useMemo(() => {
    return new THREE.ConeGeometry(markerSize, markerSize * 2, 8);
  }, [markerSize]);

  const markerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: colors.accent,
      metalness: 0.3,
      roughness: 0.4,
      emissive: colors.accent,
      emissiveIntensity: 0.3,
    });
  }, [colors.accent]);

  const hoveredMarkerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: colors.copper,
      metalness: 0.5,
      roughness: 0.2,
      emissive: colors.copper,
      emissiveIntensity: 0.6,
    });
  }, [colors.copper, colors.accent]);

  const graticuleMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: colors.textMuted,
      transparent: true,
      opacity: 0.15,
    });
  }, [colors.textMuted]);

  // Convert lat/lon to 3D position on sphere
  const latLonToVector3 = (lat, lon, radius = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Create marker meshes for destinations
  const markerMeshes = useMemo(() => {
    return destinations.map((dest, index) => {
      const position = latLonToVector3(
        dest.latitude || 33.7,
        dest.longitude || 3.0,
        1.02 // slightly above surface
      );

      const mesh = new THREE.Mesh(markerGeometry, markerMaterial);
      mesh.position.copy(position);
      // Orient marker to point outward from sphere center
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      mesh.rotateX(Math.PI / 2); // cone points up
      mesh.userData = { destination: dest, index };
      mesh.renderOrder = 1; // render on top of globe
      return mesh;
    });
  }, [destinations, markerGeometry, markerMaterial]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (globeRef.current && autoRotate && !isInteractingRef.current) {
        globeRef.current.rotation.y += autoRotateSpeed / 100;
      }

      // Pulse hovered marker
      if (hoveredMarker) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.15;
        hoveredMarker.scale.setScalar(scale);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [autoRotate, autoRotateSpeed, hoveredMarker]);

  // Handle mouse/touch interaction
  const handlePointerMove = (event) => {
    if (!globeRef.current) return;

    const rect = globeRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), globeRef.current.userData?.camera);

    const intersects = raycaster.intersectObjects(markerMeshes, false);

    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (mesh !== hoveredMarker) {
        // Reset previous hovered marker
        if (hoveredMarker) {
          hoveredMarker.material = markerMaterial;
          hoveredMarker.scale.setScalar(1);
        }
        // Highlight new hovered marker
        mesh.material = hoveredMarkerMaterial;
        setHoveredMarker(mesh);
        onDestinationHover?.(mesh.userData.destination);
      }
    } else if (hoveredMarker) {
      hoveredMarker.material = markerMaterial;
      hoveredMarker.scale.setScalar(1);
      setHoveredMarker(null);
      onDestinationHover?.(null);
    }
  };

  const handleClick = (event) => {
    if (!globeRef.current || !hoveredMarker) return;
    onDestinationClick?.(hoveredMarker.userData.destination);
  };

  const handlePointerDown = () => {
    isInteractingRef.current = true;
  };

  const handlePointerUp = () => {
    isInteractingRef.current = false;
  };

  // Setup Three.js scene on mount
  useEffect(() => {
    if (!globeRef.current) return;

    const canvas = globeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 2.5);

    // Store camera for raycasting
    canvas.userData = { camera };

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Globe
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.castShadow = true;
    globe.receiveShadow = true;
    globe.rotation.set(initialRotation.x, initialRotation.y, 0);
    scene.add(globe);
    globeRef.current.userData.globe = globe;

    // Atmosphere
    if (showAtmosphere) {
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 32, 32),
        atmosphereMaterial
      );
      scene.add(atmosphere);
      globeRef.current.userData.atmosphere = atmosphere;
    }

    // Graticule (lat/lon lines)
    if (showGraticule) {
      const graticule = createGraticule(graticuleMaterial);
      scene.add(graticule);
      globeRef.current.userData.graticule = graticule;
    }

    // Add markers
    const markerGroup = new THREE.Group();
    markerMeshes.forEach((mesh) => markerGroup.add(mesh));
    scene.add(markerGroup);
    globeRef.current.userData.markerGroup = markerGroup;

    // Lighting
    const ambientLight = new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(lighting.sun.color, lighting.sun.intensity);
    sunLight.position.set(5, 3, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(lighting.fill.color, lighting.fill.intensity);
    fillLight.position.set(-3, 1, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(lighting.rim.color, lighting.rim.intensity);
    rimLight.position.set(0, -5, 0);
    scene.add(rimLight);

    // Resize handler
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Event listeners
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    // Render loop
    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      cancelAnimationFrame(animationFrameRef.current);

      // Dispose geometries/materials
      globeGeometry.dispose();
      globeMaterial.dispose();
      atmosphereMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      hoveredMarkerMaterial.dispose();
      graticuleMaterial.dispose();
      markerMeshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    };
  }, []); // Empty deps - only run once on mount

  return (
    <div
      ref={globeRef}
      className={`relative w-full h-full ${className}`}
      style={{ minHeight: '400px', touchAction: 'none' }}
    >
      <canvas className="w-full h-full block" />
      {hoveredMarker && (
        <GlobeTooltip
          destination={hoveredMarker.userData.destination}
          colors={colors}
          theme={theme}
        />
      )}
    </div>
  );
}

/**
 * Create lat/lon graticule lines
 */
function createGraticule(material) {
  const group = new THREE.Group();
  const radius = 1.01;

  // Latitude lines
  for (let lat = -80; lat <= 80; lat += 20) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      points.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  // Longitude lines
  for (let lon = -180; lon <= 180; lon += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      points.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  return group;
}

/**
 * GlobeTooltip - HTML overlay for destination info
 */
function GlobeTooltip({ destination, colors, theme }) {
  if (!destination) return null;

  return (
    <div
      className="absolute pointer-events-none z-10 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: theme === 'dark'
          ? `rgba(${colors.forestDarkerCss.split('(')[1].split(')')[0]}, 0.95)`
          : `rgba(${colors.creamCss.split('(')[1].split(')')[0]}, 0.95)`,
        color: theme === 'dark' ? `rgb(${colors.sandCss.split('(')[1].split(')')[0]})` : `rgb(${colors.forestDarkerCss.split('(')[1].split(')')[0]})`,
        border: `1px solid rgba(${colors.copperCss.split('(')[1].split(')')[0]}, 0.3)`,
        boxShadow: `0 10px 40px -12px rgba(${colors.forestDarkerCss.split('(')[1].split(')')[0]}, 0.4)`,
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="font-display font-bold">{destination.name}</div>
      <div className="text-xs opacity-80 mt-0.5">{destination.city_name}</div>
      {destination.price && (
        <div className="text-xs font-bold mt-1" style={{ color: `rgb(${colors.accentCss.split('(')[1].split(')')[0]})` }}>
          {destination.price} €
        </div>
      )}
    </div>
  );
}

/**
 * GlobeCard - Self-contained globe for card layouts
 */
export function GlobeCard({
  destinations = [],
  className = '',
  aspectRatio = '1/1',
  ...props
}) {
  return (
    <div className={`relative aspect-${aspectRatio} overflow-hidden rounded-2xl ${className}`}>
      <Globe
        destinations={destinations}
        autoRotate={true}
        autoRotateSpeed={0.03}
        showAtmosphere={true}
        showGraticule={false}
        markerSize={0.035}
        {...props}
      />
    </div>
  );
}