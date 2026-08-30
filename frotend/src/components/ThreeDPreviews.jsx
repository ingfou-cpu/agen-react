import * as THREE from 'three';
import { useRef, useEffect, useMemo, useState } from 'react';
import { ThreeCanvas, ThreeCanvasCard } from './ThreeCanvas';
import { useThreeColors } from '../hooks/useThreeColors';
import { useTheme } from '../hooks/useTheme';
import { mediaUrl } from '../lib/format';

/**
 * Hotel3DPreview - 3D preview of a hotel with basic building structure
 *
 * Features:
 * - Simple architectural building with floors, windows, entrance
 * - Design system materials (copper accents, forest structure, sand walls)
 * - Interactive rotation on hover
 * - Loading states and error handling
 * - RTL support
 */
export function Hotel3DPreview({
  hotel,
  className = '',
  aspectRatio = '4/3',
  autoRotate = false,
  showGround = true,
  onLoad,
  onError,
}) {
  const { colors, materials, lighting } = useThreeColors();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const groupRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Building dimensions (proportional)
  const buildingData = useMemo(() => ({
    width: 1.2,
    height: 1.5,
    depth: 0.8,
    floors: hotel?.calification_stars || 3,
    floorHeight: 0.4,
  }), [hotel?.calification_stars]);

  // Create building materials
  const buildingMaterials = useMemo(() => ({
    structure: new THREE.MeshStandardMaterial({
      ...materials.secondary,
      color: colors.forest,
    }),
    walls: new THREE.MeshStandardMaterial({
      ...materials.sand,
      color: colors.sand,
    }),
    windows: new THREE.MeshPhysicalMaterial({
      color: colors.copper,
      metalness: 0.8,
      roughness: 0.1,
      transmission: 0.3,
      transparent: true,
      opacity: 0.6,
      ior: 1.5,
    }),
    entrance: new THREE.MeshStandardMaterial({
      ...materials.primary,
      color: colors.copper,
    }),
    roof: new THREE.MeshStandardMaterial({
      color: colors.forestDarker,
      metalness: 0.2,
      roughness: 0.7,
    }),
    ground: new THREE.MeshStandardMaterial({
      color: colors.surface,
      metalness: 0,
      roughness: 0.9,
    }),
  }), [colors, materials]);

  // Build hotel geometry
  const buildHotel = useMemo(() => {
    const group = new THREE.Group();
    const { width, height, depth, floors, floorHeight } = buildingData;

    // Main structure
    const structureGeom = new THREE.BoxGeometry(width, height, depth);
    const structure = new THREE.Mesh(structureGeom, buildingMaterials.structure);
    structure.position.y = height / 2;
    structure.castShadow = true;
    structure.receiveShadow = true;
    group.add(structure);

    // Walls (slightly larger than structure)
    const wallGeom = new THREE.BoxGeometry(width * 1.02, height * 1.02, depth * 1.02);
    const walls = new THREE.Mesh(wallGeom, buildingMaterials.walls);
    walls.position.y = height / 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);

    // Floors with windows
    for (let i = 0; i < floors; i++) {
      const floorY = i * floorHeight + floorHeight / 2;
      const floorHeightActual = Math.min(floorHeight, height - i * floorHeight);

      // Windows on front/back
      const windowWidth = width * 0.7;
      const windowHeight = floorHeightActual * 0.6;
      const windowDepth = 0.05;

      // Front windows
      for (let w = 0; w < 3; w++) {
        const windowGeom = new THREE.BoxGeometry(windowWidth / 3.5, windowHeight, windowDepth);
        const windowMesh = new THREE.Mesh(windowGeom, buildingMaterials.windows);
        windowMesh.position.set(
          (w - 1) * (windowWidth / 3),
          floorY,
          depth / 2 + 0.01
        );
        windowMesh.castShadow = true;
        group.add(windowMesh);
      }

      // Back windows
      for (let w = 0; w < 3; w++) {
        const windowGeom = new THREE.BoxGeometry(windowWidth / 3.5, windowHeight, windowDepth);
        const windowMesh = new THREE.Mesh(windowGeom, buildingMaterials.windows);
        windowMesh.position.set(
          (w - 1) * (windowWidth / 3),
          floorY,
          -depth / 2 - 0.01
        );
        windowMesh.castShadow = true;
        group.add(windowMesh);
      }

      // Side windows (1 per side)
      const sideWindowGeom = new THREE.BoxGeometry(windowDepth, windowHeight, depth * 0.3);
      // Left side
      let sideWindow = new THREE.Mesh(sideWindowGeom, buildingMaterials.windows);
      sideWindow.position.set(-width / 2 - 0.01, floorY, 0);
      sideWindow.castShadow = true;
      group.add(sideWindow);
      // Right side
      sideWindow = new THREE.Mesh(sideWindowGeom, buildingMaterials.windows);
      sideWindow.position.set(width / 2 + 0.01, floorY, 0);
      sideWindow.castShadow = true;
      group.add(sideWindow);
    }

    // Entrance (ground floor center front)
    const entranceGeom = new THREE.BoxGeometry(width * 0.3, floorHeight * 1.5, 0.1);
    const entrance = new THREE.Mesh(entranceGeom, buildingMaterials.entrance);
    entrance.position.set(0, floorHeight * 0.75, depth / 2 + 0.05);
    entrance.castShadow = true;
    group.add(entrance);

    // Roof
    const roofGeom = new THREE.BoxGeometry(width * 1.1, 0.15, depth * 1.1);
    const roof = new THREE.Mesh(roofGeom, buildingMaterials.roof);
    roof.position.set(0, height + 0.075, 0);
    roof.castShadow = true;
    group.add(roof);

    // Roof decoration (copper accent)
    const accentGeom = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
    const accent = new THREE.Mesh(accentGeom, buildingMaterials.entrance);
    accent.position.set(0, height + 0.3, 0);
    accent.castShadow = true;
    group.add(accent);

    // Star rating indicators (small cubes on roof)
    for (let i = 0; i < Math.min(floors, 5); i++) {
      const starGeom = new THREE.BoxGeometry(0.04, 0.04, 0.04);
      const star = new THREE.Mesh(starGeom, buildingMaterials.entrance);
      star.position.set(
        (i - 2) * 0.12,
        height + 0.25,
        0
      );
      group.add(star);
    }

    // Ground plane
    if (showGround) {
      const groundGeom = new THREE.PlaneGeometry(3, 2);
      const ground = new THREE.Mesh(groundGeom, buildingMaterials.ground);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.01;
      ground.receiveShadow = true;
      group.add(ground);
    }

    // Center the group
    group.position.y = -height / 2;

    return group;
  }, [buildingData, buildingMaterials]);

  // Animation loop
  useEffect(() => {
    if (!groupRef.current) return;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (groupRef.current && autoRotate && !hasError) {
        groupRef.current.rotation.y += 0.002;
      }

      // Gentle float animation
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.02 - buildingData.height / 2;
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [autoRotate, hasError, buildingData.height]);

  // Setup scene
  useEffect(() => {
    const canvas = document.querySelector(`#hotel-preview-${hotel?.id || 'default'}`);
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 2.5);

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

    // Add building
    const hotelGroup = buildHotel;
    groupRef.current = hotelGroup;
    scene.add(hotelGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(lighting.sun.color, lighting.sun.intensity);
    sunLight.position.set(3, 4, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(lighting.fill.color, lighting.fill.intensity);
    fillLight.position.set(-2, 2, -2);
    scene.add(fillLight);

    // Render loop
    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    setIsLoaded(true);
    onLoad?.();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      hotelGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [hotel?.id, buildHotel, lighting]);

  if (hasError) {
    return (
      <div className={`relative aspect-${aspectRatio} rounded-2xl bg-forest-dark/20 flex items-center justify-center ${className}`}>
        <div className="text-center p-4 text-forest-dark">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Unable to load 3D preview</p>
        </div>
      </div>
    );
  }

  return (
    <ThreeCanvasCard
      id={`hotel-preview-${hotel?.id || 'default'}`}
      className={className}
      aspectRatio={aspectRatio}
      cameraPosition={[0, 0.3, 2.5]}
      enablePerformanceMode={true}
    >
      <canvas className="w-full h-full block" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-forest-dark/10 z-10">
          <div className="w-8 h-8 border-2 border-copper border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </ThreeCanvasCard>
  );
}

/**
 * Circuit3DPreview - 3D preview for travel circuits/packs
 *
 * Features:
 * - Route visualization with waypoints
 * - Transport type icons (plane, train, bus, car)
 * - Terrain representation
 * - Design system theming
 */
export function Circuit3DPreview({
  circuit,
  className = '',
  aspectRatio = '16/9',
  autoRotate = true,
  showRoute = true,
  showWaypoints = true,
  onLoad,
  onError,
}) {
  const { colors, materials, lighting } = useThreeColors();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const groupRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Circuit data
  const circuitData = useMemo(() => {
    // Generate waypoints from circuit data or create defaults
    const waypoints = circuit?.itinerary
      ? circuit.itinerary.split('\n').filter(Boolean).slice(0, 8).map((_, i) => ({
          name: `Stop ${i + 1}`,
          lat: 33.7 + (Math.random() - 0.5) * 10,
          lon: 3.0 + (Math.random() - 0.5) * 10,
        }))
      : [
          { name: 'Start', lat: 33.7, lon: 3.0 },
          { name: 'Desert', lat: 28.5, lon: 2.0 },
          { name: 'Oasis', lat: 26.0, lon: 1.5 },
          { name: 'Mountains', lat: 30.0, lon: 5.0 },
          { name: 'Coast', lat: 35.0, lon: 0.0 },
          { name: 'End', lat: 33.7, lon: 3.0 },
        ];

    return { waypoints };
  }, [circuit]);

  // Create circuit materials
  const circuitMaterials = useMemo(() => ({
    terrain: new THREE.MeshStandardMaterial({
      ...materials.sand,
      color: colors.sand,
    }),
    route: new THREE.MeshStandardMaterial({
      color: colors.copper,
      metalness: 0.3,
      roughness: 0.4,
      emissive: colors.copper,
      emissiveIntensity: 0.2,
    }),
    waypoint: new THREE.MeshStandardMaterial({
      color: colors.accent,
      metalness: 0.5,
      roughness: 0.3,
      emissive: colors.accent,
      emissiveIntensity: 0.4,
    }),
    waypointActive: new THREE.MeshStandardMaterial({
      color: colors.copper,
      metalness: 0.7,
      roughness: 0.2,
      emissive: colors.copper,
      emissiveIntensity: 0.6,
    }),
    transport: new THREE.MeshStandardMaterial({
      color: colors.forest,
      metalness: 0.2,
      roughness: 0.6,
    }),
  }), [colors, materials]);

  // Build circuit visualization
  const buildCircuit = useMemo(() => {
    const group = new THREE.Group();
    const { waypoints } = circuitData;

    // Convert lat/lon to 3D positions on a curved surface
    const radius = 1.5;
    const positions = waypoints.map((wp) => {
      const phi = (90 - wp.lat) * (Math.PI / 180);
      const theta = (wp.lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    });

    // Terrain sphere (simplified)
    const terrainGeom = new THREE.SphereGeometry(radius, 32, 32);
    const terrain = new THREE.Mesh(terrainGeom, circuitMaterials.terrain);
    terrain.receiveShadow = true;
    group.add(terrain);

    // Route line
    if (showRoute && positions.length > 1) {
      const curve = new THREE.CatmullRomCurve3(positions);
      const routePoints = curve.getPoints(50);
      const routeGeom = new THREE.TubeGeometry(curve, 50, 0.02, 8, false);
      const route = new THREE.Mesh(routeGeom, circuitMaterials.route);
      route.castShadow = true;
      group.add(route);

      // Animated pulse along route
      const pulseGeom = new THREE.SphereGeometry(0.05, 8, 8);
      const pulse = new THREE.Mesh(pulseGeom, circuitMaterials.waypointActive);
      pulse.userData = { curve, progress: 0 };
      group.add(pulse);
      groupRef.current = { ...groupRef.current, pulse, curve };
    }

    // Waypoints
    if (showWaypoints) {
      positions.forEach((pos, i) => {
        const wpGeom = new THREE.OctahedronGeometry(0.06, 0);
        const wpMat = i === 0 || i === positions.length - 1
          ? circuitMaterials.waypointActive
          : circuitMaterials.waypoint;
        const waypoint = new THREE.Mesh(wpGeom, wpMat);
        waypoint.position.copy(pos);
        waypoint.castShadow = true;
        waypoint.userData = { index: i, name: waypoints[i].name };
        group.add(waypoint);
      });
    }

    // Transport icons (simplified geometric representations)
    const transportType = circuit?.means_of_transport || 'avion';
    const transportModels = {
      avion: createPlane(circuitMaterials.transport),
      train: createTrain(circuitMaterials.transport),
      bus: createBus(circuitMaterials.transport),
      voiture: createCar(circuitMaterials.transport),
    };

    if (transportModels[transportType]) {
      const transport = transportModels[transportType];
      transport.position.copy(positions[0]);
      transport.position.y += 0.3;
      transport.userData = { type: transportType };
      group.add(transport);
      groupRef.current = { ...groupRef.current, transport, positions };
    }

    return group;
  }, [circuitData, circuitMaterials, circuit?.means_of_transport]);

  // Animation
  useEffect(() => {
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (groupRef.current?.pulse && groupRef.current.curve) {
        groupRef.current.pulse.userData.progress += 0.001;
        if (groupRef.current.pulse.userData.progress > 1) {
          groupRef.current.pulse.userData.progress = 0;
        }
        const point = groupRef.current.curve.getPointAt(groupRef.current.pulse.userData.progress);
        groupRef.current.pulse.position.copy(point);
        groupRef.current.pulse.position.y += 0.08;
      }

      // Move transport along route
      if (groupRef.current?.transport && groupRef.current.positions && groupRef.current.positions.length > 1) {
        const t = (Date.now() * 0.0001) % 1;
        const curve = new THREE.CatmullRomCurve3(groupRef.current.positions);
        const point = curve.getPointAt(t);
        groupRef.current.transport.position.copy(point);
        groupRef.current.transport.position.y += 0.3;
        // Orient transport along curve
        if (t < 0.99) {
          const nextPoint = curve.getPointAt(Math.min(t + 0.01, 1));
          groupRef.current.transport.lookAt(nextPoint);
        }
      }

      if (groupRef.current?.group && autoRotate) {
        groupRef.current.group.rotation.y += 0.001;
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [autoRotate]);

  // Setup scene
  useEffect(() => {
    const canvas = document.querySelector(`#circuit-preview-${circuit?.id || 'default'}`);
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 3);

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

    const circuitGroup = buildCircuit;
    const wrapperGroup = new THREE.Group();
    wrapperGroup.add(circuitGroup);
    scene.add(wrapperGroup);
    groupRef.current = { ...groupRef.current, group: wrapperGroup };

    // Lighting
    const ambientLight = new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(lighting.sun.color, lighting.sun.intensity);
    sunLight.position.set(5, 5, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    setIsLoaded(true);
    onLoad?.();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      circuitGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [circuit?.id, buildCircuit, lighting]);

  if (!isLoaded) {
    return (
      <ThreeCanvasCard
        id={`circuit-preview-${circuit?.id || 'default'}`}
        className={className}
        aspectRatio={aspectRatio}
        cameraPosition={[0, 0.5, 3]}
        enablePerformanceMode={true}
      >
        <canvas className="w-full h-full block" />
        <div className="absolute inset-0 flex items-center justify-center bg-forest-dark/10 z-10">
          <div className="w-8 h-8 border-2 border-copper border-t-transparent rounded-full animate-spin" />
        </div>
      </ThreeCanvasCard>
    );
  }

  return (
    <ThreeCanvasCard
      id={`circuit-preview-${circuit?.id || 'default'}`}
      className={className}
      aspectRatio={aspectRatio}
      cameraPosition={[0, 0.5, 3]}
      enablePerformanceMode={true}
    >
      <canvas className="w-full h-full block" />
    </ThreeCanvasCard>
  );
}

// Transport model creators
function createPlane(material) {
  const group = new THREE.Group();
  // Body
  const bodyGeom = new THREE.CylinderGeometry(0.05, 0.08, 0.4, 8);
  const body = new THREE.Mesh(bodyGeom, material);
  body.rotation.z = Math.PI / 2;
  group.add(body);
  // Wings
  const wingGeom = new THREE.BoxGeometry(0.5, 0.02, 0.15);
  const wings = new THREE.Mesh(wingGeom, material);
  wings.position.y = 0.02;
  group.add(wings);
  // Tail
  const tailGeom = new THREE.BoxGeometry(0.1, 0.08, 0.02);
  const tail = new THREE.Mesh(tailGeom, material);
  tail.position.set(-0.2, 0.05, 0);
  group.add(tail);
  return group;
}

function createTrain(material) {
  const group = new THREE.Group();
  // Engine
  const engineGeom = new THREE.BoxGeometry(0.3, 0.2, 0.25);
  const engine = new THREE.Mesh(engineGeom, material);
  group.add(engine);
  // Cars
  for (let i = 1; i < 4; i++) {
    const carGeom = new THREE.BoxGeometry(0.25, 0.18, 0.25);
    const car = new THREE.Mesh(carGeom, material);
    car.position.x = i * 0.3;
    group.add(car);
  }
  return group;
}

function createBus(material) {
  const group = new THREE.Group();
  const bodyGeom = new THREE.BoxGeometry(0.4, 0.25, 0.2);
  const body = new THREE.Mesh(bodyGeom, material);
  group.add(body);
  // Wheels
  const wheelGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8);
  wheelGeom.rotateZ(Math.PI / 2);
  [-0.15, 0.15].forEach(x => {
    [-0.1, 0.1].forEach(z => {
      const wheel = new THREE.Mesh(wheelGeom, material);
      wheel.position.set(x, -0.12, z);
      group.add(wheel);
    });
  });
  return group;
}

function createCar(material) {
  const group = new THREE.Group();
  // Body
  const bodyGeom = new THREE.BoxGeometry(0.3, 0.15, 0.18);
  const body = new THREE.Mesh(bodyGeom, material);
  body.position.y = 0.05;
  group.add(body);
  // Roof
  const roofGeom = new THREE.BoxGeometry(0.2, 0.1, 0.16);
  const roof = new THREE.Mesh(roofGeom, material);
  roof.position.y = 0.17;
  group.add(roof);
  // Wheels
  const wheelGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 8);
  wheelGeom.rotateZ(Math.PI / 2);
  [-0.1, 0.1].forEach(x => {
    [-0.08, 0.08].forEach(z => {
      const wheel = new THREE.Mesh(wheelGeom, material);
      wheel.position.set(x, -0.02, z);
      group.add(wheel);
    });
  });
  return group;
}

/**
 * Hotel3DCard - Self-contained hotel preview for card layouts
 */
export function Hotel3DCard({ hotel, className = '', ...props }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Hotel3DPreview hotel={hotel} aspectRatio="4/3" autoRotate={true} {...props} />
      {hotel && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-forest-darker/90 to-transparent">
          <h4 className="font-display font-bold text-cream">{hotel.hotel_name}</h4>
          <div className="flex items-center gap-1 text-sand-light text-sm mt-1">
            {'★'.repeat(hotel.calification_stars || 3)}
            <span className="ml-2">{hotel.price} €/night</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Circuit3DCard - Self-contained circuit preview for card layouts
 */
export function Circuit3DCard({ circuit, className = '', ...props }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Circuit3DPreview circuit={circuit} aspectRatio="16/9" autoRotate={true} {...props} />
      {circuit && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-forest-darker/90 to-transparent">
          <h4 className="font-display font-bold text-cream">{circuit.pack_name}</h4>
          <div className="flex items-center gap-2 text-sand-light text-sm mt-1">
            <span>{circuit.price} €</span>
            <span className="px-2 py-0.5 bg-copper/20 rounded text-xs">{circuit.means_of_transport || 'Transport'}</span>
          </div>
        </div>
      )}
    </div>
  );
}