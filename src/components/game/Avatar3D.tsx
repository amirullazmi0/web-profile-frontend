'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MeshStandardMaterial, SRGBColorSpace, type Group } from 'three';

const HAIR = '#16110f';
const SHIRT = '#1b2440';
const SKIN = '#c58c63';
const PANTS = '#111827';

/**
 * Low-poly figure whose face is the GitHub profile photo.
 * Origin is at the feet; total height is about 3.2 units at scale 1.
 */
export default function Avatar3D({
    idle = true,
    waveHead = false,
    ...props
}: { idle?: boolean; waveHead?: boolean } & React.ComponentProps<'group'>) {
    const face = useTexture('/avatar-face.jpg', (t) => {
        t.colorSpace = SRGBColorSpace;
    });

    const headMaterials = useMemo(() => {
        const hair = new MeshStandardMaterial({ color: HAIR, flatShading: true });
        const front = new MeshStandardMaterial({ map: face, roughness: 0.8 });
        // Box face order: +x, -x, +y, -y, +z (front), -z
        return [hair, hair, hair, new MeshStandardMaterial({ color: SKIN }), front, hair];
    }, [face]);

    const root = useRef<Group>(null);
    const head = useRef<Group>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (idle && root.current) root.current.position.y = Math.sin(t * 2) * 0.04;
        if (waveHead && head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.35;
    });

    return (
        <group {...props}>
            <group ref={root}>
                {/* Legs */}
                {[-0.22, 0.22].map((x) => (
                    <mesh key={x} position={[x, 0.45, 0]} castShadow>
                        <boxGeometry args={[0.34, 0.9, 0.36]} />
                        <meshStandardMaterial color={PANTS} flatShading />
                    </mesh>
                ))}
                {/* Torso: navy work shirt */}
                <mesh position={[0, 1.35, 0]} castShadow>
                    <boxGeometry args={[1.05, 1, 0.55]} />
                    <meshStandardMaterial color={SHIRT} flatShading />
                </mesh>
                {/* Name tag and badge on the shirt */}
                <mesh position={[-0.25, 1.62, 0.28]}>
                    <boxGeometry args={[0.3, 0.06, 0.01]} />
                    <meshStandardMaterial color="#e5e7eb" />
                </mesh>
                <mesh position={[0.3, 1.58, 0.28]}>
                    <boxGeometry args={[0.14, 0.16, 0.01]} />
                    <meshStandardMaterial color="#facc15" />
                </mesh>
                {/* Crossed arms */}
                <mesh position={[0, 1.25, 0.34]} castShadow>
                    <boxGeometry args={[1.15, 0.26, 0.26]} />
                    <meshStandardMaterial color={SHIRT} flatShading />
                </mesh>
                {[-0.6, 0.6].map((x) => (
                    <mesh key={x} position={[x, 1.42, 0.08]} castShadow>
                        <boxGeometry args={[0.24, 0.62, 0.3]} />
                        <meshStandardMaterial color={SHIRT} flatShading />
                    </mesh>
                ))}
                {[-0.42, 0.42].map((x) => (
                    <mesh key={x} position={[x, 1.25, 0.48]}>
                        <boxGeometry args={[0.16, 0.16, 0.06]} />
                        <meshStandardMaterial color={SKIN} />
                    </mesh>
                ))}
                {/* Neck */}
                <mesh position={[0, 1.92, 0]}>
                    <boxGeometry args={[0.3, 0.16, 0.3]} />
                    <meshStandardMaterial color={SKIN} />
                </mesh>
                {/* Head with the photo on the front face */}
                <group ref={head} position={[0, 2.45, 0]}>
                    <mesh material={headMaterials} castShadow>
                        <boxGeometry args={[0.9, 1.04, 0.9]} />
                    </mesh>
                    {/* Long hair down the back and sides */}
                    <mesh position={[0, -0.3, -0.2]} castShadow>
                        <boxGeometry args={[1.02, 0.75, 0.6]} />
                        <meshStandardMaterial color={HAIR} flatShading />
                    </mesh>
                    <mesh position={[0, 0.56, -0.02]}>
                        <boxGeometry args={[0.98, 0.14, 0.98]} />
                        <meshStandardMaterial color={HAIR} flatShading />
                    </mesh>
                </group>
            </group>
        </group>
    );
}

useTexture.preload('/avatar-face.jpg');
