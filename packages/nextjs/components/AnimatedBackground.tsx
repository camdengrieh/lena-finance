import { useEffect, useRef } from "react";
import * as THREE from "three";

const particleVertex = `
  attribute float scale;
  uniform float uTime;

  void main() {
    vec3 p = position;
    float s = scale;

    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragment = `
  uniform bool isDarkMode;

  void main() {
    vec4 darkColor = vec4(1.0, 1.0, 1.0, 0.5);  // White for dark mode
    vec4 lightColor = vec4(0.0, 0.0, 0.0, 0.5);  // Black for light mode
    gl_FragColor = isDarkMode ? darkColor : lightColor;
  }
`;

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    particleMaterial: THREE.ShaderMaterial;
  }>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const config = {
      canvas: canvasRef.current,
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
      mouse: new THREE.Vector2(-10, -10),
    };

    // Initialize Scene
    const scene = new THREE.Scene();
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    scene.background = new THREE.Color(isDarkMode ? "#000000" : "#ffffff");

    const camera = new THREE.PerspectiveCamera(75, config.aspectRatio, 0.01, 1000);
    camera.position.set(0, 6, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(config.winWidth, config.winHeight);

    // Initialize Particles
    const gap = 0.3;
    const amountX = 200;
    const amountY = 200;
    const particleNum = amountX * amountY;
    const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);
    let i = 0;
    let j = 0;

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - (amountX * gap) / 2;
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - (amountX * gap) / 2;
        particleScales[j] = 1;
        i += 3;
        j++;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("scale", new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        isDarkMode: { value: document.documentElement.getAttribute("data-theme") === "dark" },
      },
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    sceneRef.current = { scene, camera, renderer, particles, particleMaterial };

    // Animation
    let animationFrameId: number;
    const animate = () => {
      if (!sceneRef.current) return;
      const { scene, camera, renderer, particleMaterial } = sceneRef.current;

      particleMaterial.uniforms.uTime.value += 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Handlers
    const handleResize = () => {
      if (!sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handleMouseMove = (event: MouseEvent) => {
      config.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      config.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Event Listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Add theme change observer
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "data-theme" && sceneRef.current) {
          const isDark = document.documentElement.getAttribute("data-theme") === "dark";
          sceneRef.current.particleMaterial.uniforms.isDarkMode.value = isDark;
          sceneRef.current.scene.background = new THREE.Color(isDark ? "#000000" : "#ffffff");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Start Animation
    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      scene.remove(particles);
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;
