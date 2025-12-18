"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Building = {
  id: string;
  name: string;
  type: string;
  maturity: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  importance: number;
};

const NexonomaCity = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);

  // Building data structure
  const buildings: Building[] = [
    // Core Platform (center)
    { id: "core", name: "Core Platform", type: "CONCEPT", maturity: "Adopt", x: 0, z: 0, width: 3, depth: 3, height: 2, importance: 95 },

    // Software & Architecture Cluster
    { id: "k8s", name: "Kubernetes", type: "TECHNOLOGY", maturity: "Adopt", x: -6, z: -6, width: 1.5, depth: 1.5, height: 5, importance: 90 },
    { id: "kafka", name: "Kafka", type: "TECHNOLOGY", maturity: "Adopt", x: 6, z: -6, width: 1.5, depth: 1.5, height: 5, importance: 85 },
    { id: "react", name: "React", type: "TECHNOLOGY", maturity: "Adopt", x: -3, z: 3, width: 1.5, depth: 1.5, height: 4, importance: 88 },
    { id: "spring", name: "Spring Boot", type: "TECHNOLOGY", maturity: "Adopt", x: 3, z: 3, width: 1.5, depth: 1.5, height: 4, importance: 87 },

    // Methods & Tools
    { id: "ddd", name: "Domain Driven Design", type: "CONCEPT", maturity: "Adopt", x: -6, z: 3, width: 1.2, depth: 1.2, height: 3, importance: 80 },
    { id: "scrum", name: "Scrum", type: "METHOD", maturity: "Adopt", x: 6, z: 3, width: 1.2, depth: 1.2, height: 3.5, importance: 85 },
    { id: "terraform", name: "Terraform", type: "TOOL", maturity: "Adopt", x: -3, z: -6, width: 1.3, depth: 1.3, height: 4.5, importance: 82 },
    { id: "argocd", name: "ArgoCD", type: "TOOL", maturity: "Trial", x: 3, z: -6, width: 1.3, depth: 1.3, height: 3, importance: 70 },

    // Smaller experimental items
    { id: "eventstore", name: "Event Storming", type: "METHOD", maturity: "Trial", x: -6, z: 0, width: 1, depth: 1, height: 2.5, importance: 65 },
    { id: "grpc", name: "gRPC", type: "TECHNOLOGY", maturity: "Trial", x: 6, z: 0, width: 1, depth: 1, height: 2.8, importance: 68 },
    { id: "rust", name: "Rust", type: "TECHNOLOGY", maturity: "Assess", x: 0, z: -3, width: 0.9, depth: 0.9, height: 2, importance: 50 },
    {
      id: "microfrontend",
      name: "Micro Frontends",
      type: "CONCEPT",
      maturity: "Trial",
      x: 0,
      z: 6,
      width: 1.1,
      depth: 1.1,
      height: 2.7,
      importance: 72,
    },
  ];

  const getColorByType = (type: string) => {
    const colors = {
      CONCEPT: "#4A90E2", // Blue
      METHOD: "#50C878", // Green
      TOOL: "#9B59B6", // Purple
      TECHNOLOGY: "#E67E22", // Orange
    };
    return colors[type as keyof typeof colors] || "#95A5A6";
  };

  const getMaturityColor = (maturity: string | number) => {
    const colors: Record<string, string> = {
      Adopt: "#2ECC71",
      Trial: "#F39C12",
      Assess: "#3498DB",
      Hold: "#E74C3C",
    };
    return typeof maturity === "string" && maturity in colors ? colors[maturity] : "#95A5A6";
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a2332);
    scene.fog = new THREE.Fog(0x1a2332, 20, 50);

    // Isometric-style camera
    const aspect = window.innerWidth / window.innerHeight;
    const distance = 25;
    const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    camera.position.set(distance, distance * 0.8, distance);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add grid lines
    const gridHelper = new THREE.GridHelper(40, 20, 0x3d5266, 0x3d5266);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Create buildings
    const buildingMeshes: THREE.Object3D<THREE.Object3DEventMap>[] = [];
    buildings.forEach((building) => {
      const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
      const material = new THREE.MeshStandardMaterial({
        color: getColorByType(building.type),
        roughness: 0.5,
        metalness: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(building.x, building.height / 2, building.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = building;
      buildingMeshes.push(mesh);
      scene.add(mesh);

      // Add subtle top face highlight
      const topGeo = new THREE.PlaneGeometry(building.width, building.depth);
      const topMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
      });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.set(building.x, building.height + 0.01, building.z);
      scene.add(topMesh);

      // Add text label (simplified as a sprite would be complex)
      if (building.id === "core") {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "bold 32px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Core Platform", 128, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(building.x, building.height + 1.5, building.z);
        sprite.scale.set(4, 2, 1);
        scene.add(sprite);
      }
    });

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: { clientX: number; clientY: number }) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      buildingMeshes.forEach((mesh) => {
        if (mesh instanceof THREE.Mesh && "material" in mesh && "emissive" in (mesh.material as any)) {
          (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
        }
      });

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj instanceof THREE.Mesh && "material" in obj && "emissive" in (obj.material as any)) {
          (obj.material as THREE.MeshStandardMaterial).emissive.setHex(0x333333);
        }
        setHoveredBuilding(obj.userData as Building);
        document.body.style.cursor = "pointer";
      } else {
        setHoveredBuilding(null);
        document.body.style.cursor = "default";
      }
    };

    const onClick = (event: { clientX: number; clientY: number }) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      if (intersects.length > 0) {
        setSelectedBuilding(intersects[0].object.userData as Building);
      } else {
        setSelectedBuilding(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Gentle camera rotation
      const time = Date.now() * 0.0001;
      camera.position.x = Math.cos(time) * distance;
      camera.position.z = Math.sin(time) * distance;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-4xl font-bold text-white mb-2">Nexonoma · Enterprise City Preview</h1>
        <p className="text-gray-300 text-sm max-w-2xl">Gebäudehöhen stellen Reifegrad oder Wichtigkeit dar, Farben zeigen Content-Types</p>
      </div>

      {/* Legend */}
      <div className="absolute top-8 left-8 bg-gray-900 bg-opacity-90 p-4 rounded-lg text-white text-sm">
        <h3 className="font-bold mb-2">Content Types</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4A90E2" }}></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#50C878" }}></div>
            <span>Method</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#9B59B6" }}></div>
            <span>Tool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#E67E22" }}></div>
            <span>Technology</span>
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredBuilding && !selectedBuilding && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-95 px-6 py-3 rounded-lg text-white pointer-events-none">
          <div className="font-bold text-lg">{hoveredBuilding.name}</div>
          <div className="text-sm text-gray-300">{hoveredBuilding.type}</div>
        </div>
      )}

      {/* Detail panel */}
      {selectedBuilding && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-gray-900 bg-opacity-95 p-6 rounded-lg text-white w-80 shadow-2xl">
          <button onClick={() => setSelectedBuilding(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            ✕
          </button>

          <div className="mb-4">
            <div className="w-12 h-12 rounded mb-3" style={{ backgroundColor: getColorByType(selectedBuilding.type) }}></div>
            <h2 className="text-2xl font-bold mb-1">{selectedBuilding.name}</h2>
            <div className="text-sm text-gray-400">{selectedBuilding.type}</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Maturity Level</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMaturityColor(selectedBuilding.maturity) }}></div>
                <span className="font-medium">{selectedBuilding.maturity}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Importance</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${selectedBuilding.importance}%` }}></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{selectedBuilding.importance}%</div>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <p className="text-sm text-gray-300">Klicken Sie außerhalb um die Ansicht zu schließen oder wählen Sie ein anderes Gebäude.</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-8 right-8 bg-gray-900 bg-opacity-90 p-4 rounded-lg text-white text-xs max-w-xs">
        <div className="font-bold mb-2">Interaktion</div>
        <ul className="space-y-1 text-gray-300">
          <li>• Hover über Gebäude für Info</li>
          <li>• Klick für Details</li>
          <li>• Kamera rotiert automatisch</li>
        </ul>
      </div>
    </div>
  );
};

export default NexonomaCity;
