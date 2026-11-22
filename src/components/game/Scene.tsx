'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, KeyboardControls, PerformanceMonitor, Sky, Stars } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import World from './World';
import Rover, { type Controls } from './Rover';
import Buildings from './Buildings';
import { useGameStore } from '@/stores/game.store';

const keyMap: { name: Controls; keys: string[] }[] = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'back', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'brake', keys: ['Space'] },
    { name: 'reset', keys: ['KeyR'] },
];

export default function Scene({ night }: { night: boolean }) {
    const lowQuality = useGameStore((s) => s.lowQuality);
    const setLowQuality = useGameStore((s) => s.setLowQuality);

    return (
        <KeyboardControls map={keyMap}>
            <Canvas
                shadows={!lowQuality}
                dpr={[1, 1.75]}
                camera={{ position: [0, 14, 34], fov: 55, near: 0.5, far: 900 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                <PerformanceMonitor onDecline={() => setLowQuality(true)} />
                <AdaptiveDpr pixelated />

                <color attach="background" args={[night ? '#050816' : '#bfe3ff']} />
                <fog attach="fog" args={[night ? '#050816' : '#bfe3ff', 90, 260]} />
                {night ? (
                    <Stars radius={300} depth={60} count={3000} factor={6} fade speed={0.5} />
                ) : (
                    <Sky sunPosition={[80, 60, 40]} turbidity={6} rayleigh={1.2} />
                )}

                <ambientLight intensity={night ? 0.35 : 0.65} />
                <hemisphereLight args={[night ? '#6366f1' : '#ffffff', night ? '#0f172a' : '#5a8f4e', night ? 0.4 : 0.6]} />
                <directionalLight
                    position={[60, 80, 40]}
                    intensity={night ? 0.4 : 1.6}
                    color={night ? '#a5b4fc' : '#fff7e6'}
                    castShadow={!lowQuality}
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-90}
                    shadow-camera-right={90}
                    shadow-camera-top={90}
                    shadow-camera-bottom={-90}
                    shadow-camera-far={250}
                />

                <Suspense fallback={null}>
                    <Physics gravity={[0, -20, 0]}>
                        <World night={night} />
                        <Buildings night={night} />
                        <Rover />
                    </Physics>
                </Suspense>
            </Canvas>
        </KeyboardControls>
    );
}
