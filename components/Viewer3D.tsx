import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Grid, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Download, RefreshCw } from 'lucide-react';

interface Viewer3DProps {
  objString: string;
  description: string;
  onReset: () => void;
}

// Custom parser to avoid complex loader dependencies in this standalone environment
const parseObj = (objContent: string): THREE.BufferGeometry => {
  const positions: number[] = [];
  const indices: number[] = [];
  const lines = objContent.split('\n');
  const vertices: number[][] = []; // 1-based index storage for parsing faces

  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        vertices.push([x, y, z]);
      }
    } else if (parts[0] === 'f') {
      // Handle faces (supporting triangles and quads)
      const faceIndices = parts.slice(1).map(part => {
        const indexStr = part.split('/')[0];
        return parseInt(indexStr) - 1; // OBJ is 1-based
      });

      if (faceIndices.length === 3) {
        indices.push(...faceIndices);
      } else if (faceIndices.length === 4) {
        // Triangulate quad
        indices.push(faceIndices[0], faceIndices[1], faceIndices[2]);
        indices.push(faceIndices[0], faceIndices[2], faceIndices[3]);
      }
    }
  });

  // Flatten vertices for BufferAttribute
  vertices.forEach(v => positions.push(...v));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const ModelMesh: React.FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => {
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#e4e4e7" 
        roughness={0.5} 
        metalness={0.2}
        side={THREE.DoubleSide}
      />
      <lineSegments>
        <wireframeGeometry args={[geometry]} />
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.15} />
      </lineSegments>
    </mesh>
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = ({ objString, description, onReset }) => {
  
  const geometry = useMemo(() => {
    try {
      return parseObj(objString);
    } catch (e) {
      console.error("Failed to parse OBJ", e);
      return new THREE.BoxGeometry(1, 1, 1); // Fallback
    }
  }, [objString]);

  const handleDownload = () => {
    const blob = new Blob([objString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemini-model.obj';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full">
      <div className="flex-1 relative bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 m-4">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            onClick={onReset}
            className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 shadow-lg"
            title="Create New"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg flex items-center gap-2 px-4"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium">Download OBJ</span>
          </button>
        </div>

        {/* Info Panel */}
        <div className="absolute top-4 left-4 z-10 max-w-sm pointer-events-none">
          <div className="bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 shadow-xl pointer-events-auto">
            <h3 className="text-white font-semibold mb-1">Generated Model</h3>
            <p className="text-zinc-400 text-sm">{description}</p>
            <div className="mt-3 flex gap-2 text-xs text-zinc-500 font-mono">
              <span>{geometry.attributes.position.count} vertices</span>
              <span>•</span>
              <span>{geometry.index ? geometry.index.count / 3 : 0} triangles</span>
            </div>
          </div>
        </div>
        
        <Canvas shadows camera={{ position: [3, 3, 3], fov: 45 }}>
          <fog attach="fog" args={['#18181b', 5, 20]} />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          <Center>
            <ModelMesh geometry={geometry} />
          </Center>

          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
          <Grid 
            position={[0, -1.1, 0]} 
            args={[10, 10]} 
            cellColor="#3f3f46" 
            sectionColor="#52525b" 
            fadeDistance={10} 
            infiniteGrid
          />
        </Canvas>
      </div>
    </div>
  );
};