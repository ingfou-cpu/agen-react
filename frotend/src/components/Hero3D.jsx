import * as THREE from 'three';
import { useRef, useEffect, useMemo, useState } from 'react';
import { ThreeCanvasFullscreen } from './ThreeCanvas';
import { useThreeColors } from '../hooks/useThreeColors';
import { useTheme } from '../hooks/useTheme';

/**
 * Hero3DBackground - Animated 3D background for Home page hero section
 *
 * Variants:
 * - 'particles': Floating copper/sand particles with flow field
 * - 'geometry': Morphing geometric shapes (saharan dunes theme)
 * - 'terrain': Procedural desert terrain with wind animation
 * - 'constellation': Star-like points connecting with lines
 *
 * All variants respect design system colors, dark/light mode, and RTL
 */
export function Hero3DBackground({
  variant = 'particles',
  className = '',
  intensity = 1, // 0.5 - 2, scales particle count, animation speed
  interactive = true, // mouse/touch parallax
  showOverlay = true, // gradient overlay for text readability
  children,
  ...props
}) {
  const { colors, effects } = useThreeColors();
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Variant configurations
  const variantConfig = useMemo(() => ({
    particles: {
      count: Math.floor(800 * intensity),
      size: 0.015 * intensity,
      speed: 0.15 * intensity,
      colors: [colors.copper, colors.sand, colors.cream, colors.accent],
      opacityRange: [0.3, 0.8],
    },
    geometry: {
      count: Math.floor(12 * intensity),
      size: 1.5 * intensity,
      speed: 0.05 * intensity,
      colors: [colors.copper, colors.forest, colors.accent, colors.terracotta],
      opacityRange: [0.15, 0.4],
    },
    terrain: {
      resolution: Math.floor(64 * Math.sqrt(intensity)),
      size: 10,
      speed: 0.08 * intensity,
      amplitude: 0.8 * intensity,
      colors: [colors.forestDarker, colors.forest, colors.sand, colors.copper],
    },
    constellation: {
      count: Math.floor(120 * intensity),
      connectionDistance: 3 * intensity,
      speed: 0.08 * intensity,
      colors: [colors.copper, colors.sand, colors.cream],
      opacityRange: [0.2, 0.6],
    },
  }), [colors, intensity]);

  const config = variantConfig[variant] || variantConfig.particles;

  // Create particle system
  const createParticleSystem = useMemo(() => {
    if (variant === 'terrain') return null;

    const positions = new Float32Array(config.count * 3);
    const colorsArray = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const velocities = new Float32Array(config.count * 3);
    const opacities = new Float32Array(config.count);

    const colorChoices = config.colors;

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Initial positions - spread in a sphere/dome
      const radius = variant === 'geometry' ? 4 : 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi) * 0.5; // Flatten slightly

      // Random color from palette
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      const rColor = (color >> 16 & 255) / 255;
      const gColor = (color >> 8 & 255) / 255;
      const bColor = (color & 255) / 255;
      colorsArray[i3] = rColor;
      colorsArray[i3 + 1] = gColor;
      colorsArray[i3 + 2] = bColor;

      // Size variation
      sizes[i] = config.size * (0.5 + Math.random() * 1.5);

      // Velocity for flow field
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;

      // Opacity
      opacities[i] = config.opacityRange[0] + Math.random() * (config.opacityRange[1] - config.opacityRange[0]);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }, [variant, config]);

  // Create geometry shapes
  const createGeometryShapes = useMemo(() => {
    if (variant !== 'geometry') return null;

    const group = new THREE.Group();
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
    ];

    for (let i = 0; i < config.count; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: config.opacityRange[0] + Math.random() * (config.opacityRange[1] - config.opacityRange[0]),
        transmission: 0.1,
        clearcoat: 0.5,
      });

      const mesh = new THREE.Mesh(geom, material);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10 - 5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.scale.setScalar(config.size * (0.5 + Math.random()));
      mesh.userData = {
        initialPosition: mesh.position.clone(),
        initialRotation: mesh.rotation.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
          z: (Math.random() - 0.5) * 0.001,
        },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.0005 + Math.random() * 0.001,
      };
      group.add(mesh);
    }

    return group;
  }, [variant, config]);

  // Create terrain
  const createTerrain = useMemo(() => {
    if (variant !== 'terrain') return null;

    const { resolution, size, amplitude } = config;
    const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
    const position = geometry.attributes.position;

    // Generate initial heights using noise
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      // Simple noise function
      const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) +
        Math.sin(x * 0.3 + 1.5) * Math.cos(y * 0.3 + 2.0) * 0.5 +
        Math.sin(x * 0.8 - 1.0) * Math.cos(y * 0.8 + 0.5) * 0.25;
      position.setZ(i, noise * amplitude);
    }
    geometry.computeVertexNormals();

    // Create gradient material
    const material = new THREE.MeshStandardMaterial({
      color: colors.forestDarker,
      metalness: 0,
      roughness: 0.9,
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    // Add vertex colors based on height
    const colorArray = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) {
      const z = position.getZ(i);
      const normalized = (z + amplitude) / (amplitude * 2);
      const colorIndex = Math.floor(normalized * (config.colors.length - 1));
      const color = config.colors[Math.min(colorIndex, config.colors.length - 1)];
      const r = (color >> 16 & 255) / 255;
      const g = (color >> 8 & 255) / 255;
      const b = (color & 255) / 255;
      colorArray[i * 3] = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -2;
    mesh.receiveShadow = true;
    mesh.userData = { originalPositions: position.array.slice(), time: 0 };

    return mesh;
  }, [variant, config, colors]);

  // Create constellation
  const createConstellation = useMemo(() => {
    if (variant !== 'constellation') return null;

    const group = new THREE.Group();

    // Points
    const positions = new Float32Array(config.count * 3);
    const pointColors = new Float32Array(config.count * 3);
    const pointSizes = new Float32Array(config.count);

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;
      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i3 + 2] = radius * Math.cos(phi) - 2;

      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      pointColors[i3] = (color >> 16 & 255) / 255;
      pointColors[i3 + 1] = (color >> 8 & 255) / 255;
      pointColors[i3 + 2] = (color >> 8 & 255) / 255;

      pointSizes[i] = 0.02 + Math.random() * 0.03;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
    pointsGeometry.setAttribute('size', new THREE.BufferAttribute(pointSizes, 1));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    // Lines (connections)
    const linePositions = [];
    const lineColors = [];
    const positionsArray = Array.from(positions);
    for (let i = 0; i < config.count; i += 3) {
      const i3 = i * 3;
      const p1 = new THREE.Vector3(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
      for (let j = i + 3; j < config.count; j += 3) {
        const j3 = j * 3;
        const p2 = new THREE.Vector3(positionsArray[j3], positionsArray[j3 + 1], positionsArray[j3 + 2]);
        const dist = p1.distanceTo(p2);
        if (dist < config.connectionDistance) {
          linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          const color = config.colors[Math.floor(Math.random() * config.colors.length)];
          const r = (color >> 16 & 255) / 255;
          const g = (color >> 8 & 255) / 255;
          const b = (color & 255) / 255;
          lineColors.push(r, g, b, r, g, b);
        }
      }
    }

    if (linePositions.length > 0) {
      const linesGeometry = new THREE.BufferGeometry();
      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
      group.add(lines);
      group.userData = { lines, linesGeometry };
    }

    group.userData.points = points;
    group.userData.pointsGeometry = pointsGeometry;

    return group;
  }, [variant, config]);

  // Mouse/touch interaction for parallax
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMove = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      targetMouseRef.current.x = (clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [interactive]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      const time = Date.now() * 0.001;

      // Animate particles
      if (createParticleSystem) {
        const positions = createParticleSystem.geometry.attributes.position.array;
        const velocities = createParticleSystem.geometry.attributes.velocity.array;
        const count = config.count;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          // Flow field based on position and time
          const flowX = Math.sin(positions[i3 + 1] * 0.5 + time * config.speed) * 0.002;
          const flowY = Math.cos(positions[i3] * 0.5 + time * config.speed) * 0.002;
          const flowZ = Math.sin((positions[i3] + positions[i3 + 1]) * 0.3 + time * config.speed) * 0.001;

          // Mouse influence
          const mouseInfluence = 0.0005 * intensity;
          positions[i3] += velocities[i3] + flowX + mouseRef.current.x * mouseInfluence;
          positions[i3 + 1] += velocities[i3 + 1] + flowY - mouseRef.current.y * mouseInfluence;
          positions[i3 + 2] += velocities[i3 + 2] + flowZ;

          // Wrap around boundaries
          const bound = 6;
          if (positions[i3] > bound) positions[i3] = -bound;
          if (positions[i3] < -bound) positions[i3] = bound;
          if (positions[i3 + 1] > 4) positions[i3 + 1] = -4;
          if (positions[i3 + 1] < -4) positions[i3 + 1] = 4;
          if (positions[i3 + 2] > 3) positions[i3 + 2] = -3;
          if (positions[i3 + 2] < -3) positions[i3 + 2] = 3;
        }
        createParticleSystem.geometry.attributes.position.needsUpdate = true;

        // Pulse opacity
        const opacities = createParticleSystem.geometry.attributes.opacity.array;
        for (let i = 0; i < count; i++) {
          opacities[i] = config.opacityRange[0] +
            Math.sin(time * 2 + i * 0.1) * 0.5 *
            (config.opacityRange[1] - config.opacityRange[0]);
        }
        createParticleSystem.geometry.attributes.opacity.needsUpdate = true;
      }

      // Animate geometry shapes
      if (createGeometryShapes) {
        createGeometryShapes.children.forEach((mesh) => {
          const data = mesh.userData;
          mesh.rotation.x += data.rotationSpeed.x;
          mesh.rotation.y += data.rotationSpeed.y;
          mesh.rotation.z += data.rotationSpeed.z;

          // Floating motion
          mesh.position.y = data.initialPosition.y +
            Math.sin(time * data.floatSpeed + data.floatOffset) * 0.3;
          mesh.position.x = data.initialPosition.x +
            Math.cos(time * data.floatSpeed * 0.7 + data.floatOffset) * 0.2;

          // Mouse parallax
          mesh.position.x += mouseRef.current.x * 0.5 * intensity;
          mesh.position.y -= mouseRef.current.y * 0.3 * intensity;
        });
      }

      // Animate terrain
      if (createTerrain) {
        const position = createTerrain.geometry.attributes.position;
        const originalPositions = createTerrain.userData.originalPositions;
        createTerrain.userData.time += config.speed * 0.01;

        for (let i = 0; i < position.count; i++) {
          const x = position.getX(i);
          const y = position.getY(i);
          const t = createTerrain.userData.time;
          const noise = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) +
            Math.sin(x * 0.3 + 1.5 + t * 0.7) * Math.cos(y * 0.3 + 2.0 + t * 0.7) * 0.5 +
            Math.sin(x * 0.8 - 1.0 + t * 1.3) * Math.cos(y * 0.8 + 0.5 + t * 0.5) * 0.25;
          position.setZ(i, originalPositions[i * 3 + 2] + noise * config.amplitude);
        }
        position.needsUpdate = true;
        createTerrain.geometry.computeVertexNormals();
      }

      // Animate constellation
      if (createConstellation) {
        const points = createConstellation.userData.points;
        const positions = points.geometry.attributes.position.array;
        const count = config.count;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          // Subtle orbital motion
          const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
          const angle = Math.atan2(positions[i3 + 2], positions[i3]) + config.speed * 0.001;
          positions[i3] = radius * Math.sin(angle);
          positions[i3 + 2] = radius * Math.cos(angle);
          positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.001;
        }
        points.geometry.attributes.position.needsUpdate = true;

        // Rotate whole constellation slowly
        createConstellation.rotation.y += config.speed * 0.0002;
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [variant, config, createParticleSystem, createGeometryShapes, createTerrain, createConstellation, interactive, intensity]);

  // Setup scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Fog for depth
    scene.fog = new THREE.Fog(colors.fogColor, 5, 25);

    // Add variant content
    if (createParticleSystem) scene.add(createParticleSystem);
    if (createGeometryShapes) scene.add(createGeometryShapes);
    if (createTerrain) scene.add(createTerrain);
    if (createConstellation) scene.add(createConstellation);

    // Lighting
    const ambientLight = new THREE.AmbientLight(colors.cream, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(colors.copper, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(colors.forest, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);

      // Cleanup
      [createParticleSystem, createGeometryShapes, createTerrain, createConstellation].forEach(obj => {
        if (obj) {
          obj.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
      });
      renderer.dispose();
    };
  }, []); // Run once

  return (
    <ThreeCanvasFullscreen
      ref={canvasRef}
      className={className}
      cameraPosition={[0, 0, 8]}
      enablePerformanceMode={intensity < 1}
      {...props}
    >
      <canvas className="w-full h-full block" />
      {showOverlay && (
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-forest-darker/60 via-forest-darker/20 to-forest-darker/60" />
      )}
      {children && (
        <div className="relative z-20 w-full h-full">
          {children}
        </div>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-10 h-10 border-2 border-copper border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </ThreeCanvasFullscreen>
  );
}

/**
 * Hero3DParticles - Specialized particle variant for hero
 */
export function Hero3DParticles({ className = '', ...props }) {
  return <Hero3DBackground variant="particles" className={className} {...props} />;
}

/**
 * Hero3DGeometry - Specialized geometry variant for hero
 */
export function Hero3DGeometry({ className = '', ...props }) {
  return <Hero3DBackground variant="geometry" className={className} {...props} />;
}

/**
 * Hero3DTerrain - Specialized terrain variant for hero
 */
export function Hero3DTerrain({ className = '', ...props }) {
  return <Hero3DBackground variant="terrain" className={className} {...props} />;
}

/**
 * Hero3DConstellation - Specialized constellation variant for hero
 */
export function Hero3DConstellation({ className = '', ...props }) {
  return <Hero3DBackground variant="constellation" className={className} {...props} />;
}

/**
 * Hero3D - Main hero component with integrated 3D background
 *
 * Usage:
 * <Hero3D
 *   kicker="El Bayadh Travels"
 *   title="Discover the Sahara"
 *   subtitle="Authentic desert experiences"
 *   variant="terrain"
 *   cta={{ label: "Explore Circuits", href: "/circuits" }}
 * />
 */
export function Hero3D({
  kicker,
  title,
  subtitle,
  variant = 'terrain',
  intensity = 1,
  cta,
  secondaryCta,
  className = '',
  children,
}) {
  const { theme } = useTheme();

  return (
    <Hero3DBackground
      variant={variant}
      intensity={intensity}
      className={`relative min-h-[90vh] flex items-center justify-center ${className}`}
      showOverlay={true}
    >
      <div className="container-site relative z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {kicker && (
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
              {kicker}
            </p>
          )}
          <h1 className="display-text font-display font-bold mb-6 text-cream">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-sand-light mb-10 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {cta && (
              <a
                href={cta.href}
                className="btn-primary px-8 py-4 text-lg font-semibold"
              >
                {cta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="btn-outline px-8 py-4 text-lg font-semibold border-sand/50 hover:bg-sand/10"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
          {children && (
            <div className="mt-16">
              {children}
            </div>
          )}
        </div>
      </div>
    </Hero3DBackground>
  );
}