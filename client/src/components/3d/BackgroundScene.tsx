import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { NeuralNetwork } from './NeuralNetwork';
import { DataParticles } from './DataParticles';

interface BackgroundSceneProps {
  particleCount?: number;
  quality?: 'low' | 'high';
  theme?: 'light' | 'dark';
}

export function BackgroundScene({
  particleCount = 200,
  quality = 'high',
  theme = 'dark'
}: BackgroundSceneProps) {
  const colors = {
    light: {
      neuron: '#000000',
      connection: '#333333',
      particle: '#666666',
      ambient: '#ffffff'
    },
    dark: {
      neuron: '#ffffff',
      connection: '#cccccc',
      particle: '#999999',
      ambient: '#0a0a0a'
    }
  };

  const palette = colors[theme];

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        pointerEvents: 'none',
        opacity: 0.3
      }}
    >
      <Canvas
        dpr={[1, quality === 'high' ? 2 : 1]}
        performance={{ min: 0.5 }}
        gl={{ alpha: true, antialias: quality === 'high' }}
        frameloop="always"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <NeuralNetwork colors={palette} nodeCount={quality === 'low' ? 25 : 40} />
        <DataParticles count={particleCount} color={palette.particle} />
      </Canvas>
    </div>
  );
}
