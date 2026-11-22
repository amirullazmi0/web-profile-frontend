'use client';

import { useMemo } from 'react';
import { Object3D } from 'three';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { districts, buildingPositions } from '@/data/projects';

export const ISLAND_RADIUS = 78;

/** Small deterministic PRNG so the tree layout is the same on every load. */
function mulberry32(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function Trees({ night }: { night: boolean }) {
    const spots = useMemo(() => {
        const rand = mulberry32(7);
        const occupied = [
            ...Object.values(buildingPositions),
            ...districts.map((d) => d.position),
            [0, 0] as [number, number],
        ];
        const out: { x: number; z: number; s: number }[] = [];
        let guard = 0;
        while (out.length < 140 && guard++ < 4000) {
            const a = rand() * Math.PI * 2;
            const r = 10 + Math.sqrt(rand()) * (ISLAND_RADIUS - 14);
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            if (occupied.some(([ox, oz]) => Math.hypot(ox - x, oz - z) < 8)) continue;
            // Keep the roads (center → each district) clear.
            const onRoad = districts.some(({ position: [dx, dz] }) => {
                const len = Math.hypot(dx, dz);
                const t = (x * dx + z * dz) / (len * len);
                if (t < 0 || t > 1) return false;
                return Math.hypot(x - dx * t, z - dz * t) < 5;
            });
            if (onRoad) continue;
            out.push({ x, z, s: 0.7 + rand() * 0.8 });
        }
        return out;
    }, []);

    const ref = (mesh: import('three').InstancedMesh | null) => {
        if (!mesh) return;
        const o = new Object3D();
        spots.forEach((t, i) => {
            o.position.set(t.x, 1.6 * t.s, t.z);
            o.scale.setScalar(t.s);
            o.updateMatrix();
            mesh.setMatrixAt(i, o.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    };
    const trunkRef = (mesh: import('three').InstancedMesh | null) => {
        if (!mesh) return;
        const o = new Object3D();
        spots.forEach((t, i) => {
            o.position.set(t.x, 0.5 * t.s, t.z);
            o.scale.setScalar(t.s);
            o.updateMatrix();
            mesh.setMatrixAt(i, o.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    };

    return (
        <group>
            <instancedMesh ref={ref} args={[undefined, undefined, spots.length]} castShadow>
                <coneGeometry args={[1.3, 3, 6]} />
                <meshStandardMaterial color={night ? '#1f5135' : '#2f8a4f'} flatShading />
            </instancedMesh>
            <instancedMesh ref={trunkRef} args={[undefined, undefined, spots.length]}>
                <cylinderGeometry args={[0.2, 0.25, 1, 5]} />
                <meshStandardMaterial color="#6b4a2f" />
            </instancedMesh>
        </group>
    );
}

function Roads() {
    return (
        <group>
            {districts.map((d) => {
                const [x, z] = d.position;
                const len = Math.hypot(x, z);
                const angle = Math.atan2(x, z);
                return (
                    <mesh key={d.id} position={[x / 2, 0.02, z / 2]} rotation={[0, angle, 0]} receiveShadow>
                        <boxGeometry args={[4, 0.04, len]} />
                        <meshStandardMaterial color="#3f3f46" />
                    </mesh>
                );
            })}
        </group>
    );
}

/** Invisible ring of walls on the shore so the rover cannot drive into the sea. */
function ShoreWalls() {
    const segments = 36;
    return (
        <RigidBody type="fixed" colliders={false}>
            {Array.from({ length: segments }, (_, i) => {
                const a = (i / segments) * Math.PI * 2;
                const r = ISLAND_RADIUS - 1;
                return (
                    <CuboidCollider
                        key={i}
                        args={[7, 3, 0.5]}
                        position={[Math.cos(a) * r, 2, Math.sin(a) * r]}
                        rotation={[0, -a + Math.PI / 2, 0]}
                    />
                );
            })}
        </RigidBody>
    );
}

export default function World({ night }: { night: boolean }) {
    return (
        <group>
            {/* Island */}
            <RigidBody type="fixed" colliders={false}>
                <CylinderCollider args={[1, ISLAND_RADIUS]} position={[0, -1, 0]} />
                <mesh position={[0, -1, 0]} receiveShadow>
                    <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS + 3, 2, 48]} />
                    <meshStandardMaterial color={night ? '#2d4a32' : '#7cc26b'} flatShading />
                </mesh>
            </RigidBody>
            {/* Beach ring */}
            <mesh position={[0, -1.6, 0]}>
                <cylinderGeometry args={[ISLAND_RADIUS + 4, ISLAND_RADIUS + 7, 1.2, 48]} />
                <meshStandardMaterial color={night ? '#6b6146' : '#e8d9a8'} flatShading />
            </mesh>
            {/* Sea */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[600, 48]} />
                <meshStandardMaterial color={night ? '#0b2540' : '#3aa0d8'} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* District plazas */}
            {districts.map((d) => (
                <mesh
                    key={d.id}
                    position={[d.position[0], 0.03, d.position[1]]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow
                >
                    <circleGeometry args={[16, 32]} />
                    <meshStandardMaterial color={d.color} transparent opacity={night ? 0.35 : 0.25} />
                </mesh>
            ))}

            <Roads />
            <Trees night={night} />
            <ShoreWalls />
        </group>
    );
}
