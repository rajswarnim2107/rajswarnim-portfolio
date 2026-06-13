import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralNetworkProps {
  colors: {
    neuron: string;
    connection: string;
  };
  nodeCount?: number;
}

export function NeuralNetwork({ colors, nodeCount = 30 }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      scale: Math.random() * 0.08 + 0.06
    }));
  }, [nodeCount]);

  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(
          nodes[i].position[0] - nodes[j].position[0],
          nodes[i].position[1] - nodes[j].position[1],
          nodes[i].position[2] - nodes[j].position[2]
        );
        if (dist < 4) {
          conns.push({ start: nodes[i].position, end: nodes[j].position });
        }
      }
    }
    return conns;
  }, [nodes]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Sphere key={`node-${i}`} args={[node.scale, 8, 8]} position={node.position}>
          <meshBasicMaterial
            color={colors.neuron}
            transparent
            opacity={0.25}
          />
        </Sphere>
      ))}

      {connections.map((conn, i) => (
        <Line
          key={`conn-${i}`}
          points={[conn.start, conn.end]}
          color={colors.connection}
          lineWidth={0.8}
          transparent
          opacity={0.12}
        />
      ))}
    </group>
  );
}
