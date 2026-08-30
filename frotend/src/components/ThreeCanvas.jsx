import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

/**
 * ThreeCanvas - Wrapper for ThreeUI Canvas with project-specific defaults
 *
 * Features:
 * - Responsive sizing (fills container)
 * - Design system color integration (copper, forest, sand)
 * - Performance optimizations (dpr clamping, shadows config)
 * - RTL support for Arabic locale
 */
export function ThreeCanvas({
  children,
  className = '',
  style = {},
  cameraPosition = [0, 0, 5],
  enableOrbitControls = true,
  enablePerformanceMode = false,
  onCreated,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Apply RTL transform for Arabic
  useEffect(() => {
    const html = document.documentElement;
    const isRTL = html.getAttribute('lang') === 'ar' || html.getAttribute('dir') === 'rtl';
    if (canvasRef.current && isRTL) {
      // Three.js scenes don't auto-flip; we mirror the camera instead
      canvasRef.current.camera.position.x *= -1;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        ...style,
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: cameraPosition, fov: 50 }}
        shadows={!enablePerformanceMode}
        dpr={[1, 2]} // clamp device pixel ratio for performance
        gl={{
          antialias: !enablePerformanceMode,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
        }}
        onCreated={(state) => {
          // Configure renderer defaults
          state.gl.setClearColor(0x000000, 0); // transparent background
          state.gl.shadowMap.enabled = !enablePerformanceMode;
          state.gl.shadowMap.type = 1; // PCFSoftShadowMap
          state.gl.toneMapping = 1; // ACESFilmicToneMapping
          state.gl.toneMappingExposure = 1;

          // Apply design system fog color (forest-dark)
          state.scene.fog = new state.THREE.Fog(0x15241f, 10, 100);

          onCreated?.(state);
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}

/**
 * ThreeCanvasFullscreen - Full-screen canvas for hero/background scenes
 */
export function ThreeCanvasFullscreen({
  children,
  className = '',
  cameraPosition = [0, 0, 5],
  ...props
}) {
  return (
    <ThreeCanvas
      className={`fixed inset-0 z-0 ${className}`}
      style={{ width: '100vw', height: '100vh', ...props.style }}
      cameraPosition={cameraPosition}
      {...props}
    >
      {children}
    </ThreeCanvas>
  );
}

/**
 * ThreeCanvasCard - Canvas sized for card components
 */
export function ThreeCanvasCard({
  children,
  className = '',
  aspectRatio = '4/3',
  cameraPosition = [0, 0, 3],
  ...props
}) {
  return (
    <ThreeCanvas
      className={`aspect-${aspectRatio} ${className}`}
      cameraPosition={cameraPosition}
      enablePerformanceMode={true}
      {...props}
    >
      {children}
    </ThreeCanvas>
  );
}