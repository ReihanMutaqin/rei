import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function OrganicMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const clock = useRef(new THREE.Clock());

  useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 0.5 },
        uAmplitude: { value: 3.0 },
        uDensity: { value: 1.0 },
        uStrength: { value: 0.3 },
        uDeepPurple: { value: 0.6 },
        uOpacity: { value: 0.7 },
      },
      vertexShader: `
        uniform float uFrequency;
        uniform float uAmplitude;
        uniform float uDensity;
        uniform float uStrength;
        varying float vDistortion;

        // Simplex noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        mat3 rotation3dY(float angle) {
          float s = sin(angle);
          float c = cos(angle);
          return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
        }

        vec3 rotateY(vec3 v, float angle) {
          return rotation3dY(angle) * v;
        }

        void main() {
          float distortion = snoise(normal * uDensity) * uStrength;
          vec3 pos = position + (normal * distortion);
          float angle = sin(uv.y * uFrequency) * uAmplitude;
          pos = rotateY(pos, angle);
          vDistortion = distortion;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uDeepPurple;
        varying float vDistortion;

        vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
          return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
          float distort = vDistortion * 3.0;
          // Bright warm gold palette: higher brightness base
          vec3 brightness = vec3(0.5, 0.35, 0.05);
          vec3 contrast   = vec3(0.5, 0.4,  0.15);
          vec3 oscilation = vec3(0.5, 0.5,  0.5);
          vec3 phase      = vec3(0.0, 0.05, 0.1);
          vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);
          // Blend in a warm gold tint
          color += vec3(min(uDeepPurple, 1.0) * 0.15, 0.05, 0.0);
          gl_FragColor = vec4(color, uOpacity);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    const update = clock.current.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = update * 0.05;
      meshRef.current.rotation.z = update * 0.03;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = update;
      materialRef.current.uniforms.uOpacity.value = 0.6 + Math.sin(update) * 0.1;
    }

    // Mouse-driven camera
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    state.camera.position.x = mouse.current.x * 2;
    state.camera.position.y = mouse.current.y * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <pointLight position={[-3, 3, 3]} intensity={2} color="#ffffff" />
      <pointLight position={[3, -3, 3]} intensity={20} color="#d4af37" />
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />

      <Icosahedron ref={meshRef} args={[1, 64]} scale={[2.5, 2.5, 2.5]}>
        <shaderMaterial ref={materialRef} attach="material" {...shaderArgs} />
      </Icosahedron>

      <fogExp2 attach="fog" args={['#0a0a0a', 0.04]} />
    </>
  );
}

export default function GoldenFlow() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      textRef.current,
      { opacity: 0, filter: 'blur(8px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }
    );

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '600px',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, #0a0a0a 80%)',
        }}
      />

      {/* Decorative text */}
      <h2
        ref={textRef}
        className="absolute inset-0 z-20 flex items-center justify-center text-display-l color-paper pointer-events-none opacity-0"
        style={{ opacity: 0.15 }}
      >
        {t('goldenFlow.title')}
      </h2>

      {/* Three.js canvas */}
      <div className="absolute inset-0 z-0" style={{ background: '#0a0a0a' }}>
        <Canvas
          camera={{ position: [0, 0, 5] }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <OrganicMesh />
        </Canvas>
      </div>
    </section>
  );
}
