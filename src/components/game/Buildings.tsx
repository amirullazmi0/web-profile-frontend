'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import type { Mesh } from 'three';
import { buildingPositions, districtOf, districts, projects, type Project } from '@/data/projects';
import { profile } from '@/data/profile';
import { HQ_SLUG, useGameStore } from '@/stores/game.store';
import Avatar3D from './Avatar3D';

const LABEL_Z = [10, 0] as [number, number];

/** Spinning diamond above the building the rover is parked next to. */
function Marker({ height, color }: { height: number; color: string }) {
    const ref = useRef<Mesh>(null);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.elapsedTime * 2;
        ref.current.position.y = height + 2 + Math.sin(clock.elapsedTime * 3) * 0.3;
    });
    return (
        <mesh ref={ref}>
            <octahedronGeometry args={[0.7]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
    );
}

function ProjectBuilding({ project, night }: { project: Project; night: boolean }) {
    const [x, z] = buildingPositions[project.slug];
    const color = districtOf(project.district).color;
    const isNear = useGameStore((s) => s.nearbySlug === project.slug);
    const select = useGameStore((s) => s.select);
    const allPrivate = project.repos.every((r) => r.private);

    const w = project.featured ? 5.5 : 4.5;
    const h = project.featured ? 9 : 3.5 + Math.min(project.repos.length, 4) * 1.1;
    const floors = Math.max(1, Math.floor(h / 1.6));

    return (
        <group position={[x, 0, z]}>
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[w / 2, h / 2, w / 2]} position={[0, h / 2, 0]} />
            </RigidBody>
            <mesh
                position={[0, h / 2, 0]}
                castShadow
                receiveShadow
                onClick={(e) => {
                    e.stopPropagation();
                    select(project.slug);
                }}
                onPointerOver={() => (document.body.style.cursor = 'pointer')}
                onPointerOut={() => (document.body.style.cursor = '')}
            >
                <boxGeometry args={[w, h, w]} />
                <meshStandardMaterial color={night ? '#334155' : '#f1f5f9'} flatShading />
            </mesh>
            {/* Window stripes, lit at night */}
            {Array.from({ length: floors }, (_, i) => (
                <mesh key={i} position={[0, 1 + i * 1.6, 0]}>
                    <boxGeometry args={[w + 0.04, 0.45, w + 0.04]} />
                    <meshStandardMaterial
                        color={night ? '#fde68a' : '#94a3b8'}
                        emissive={night ? '#fbbf24' : '#000000'}
                        emissiveIntensity={night ? 0.8 : 0}
                    />
                </mesh>
            ))}
            {/* Roof in the district color */}
            <mesh position={[0, h + 0.25, 0]} castShadow>
                <boxGeometry args={[w + 0.4, 0.5, w + 0.4]} />
                <meshStandardMaterial
                    color={color}
                    emissive={project.featured ? color : '#000000'}
                    emissiveIntensity={project.featured ? 0.6 : 0}
                />
            </mesh>
            {isNear && <Marker height={h} color={color} />}
            <Html position={[0, h + 1.6, 0]} center zIndexRange={LABEL_Z} distanceFactor={38}>
                <button
                    type="button"
                    onClick={() => select(project.slug)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-md py-1 pr-2 pl-1 text-xs font-medium shadow-md transition ${
                        isNear ? 'scale-110 bg-white text-slate-900' : 'bg-slate-900/80 text-white'
                    }`}
                >
                    {project.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.logo} alt="" className="h-5 w-5 rounded bg-white object-contain p-0.5" />
                    ) : (
                        <span className="h-5 w-1.5 rounded-full" style={{ background: color }} />
                    )}
                    {project.featured && '★ '}
                    {project.title.split(' — ')[0]}
                    {allPrivate && ' 🔒'}
                </button>
            </Html>
        </group>
    );
}

function HQ({ night }: { night: boolean }) {
    const ring = useRef<Mesh>(null);
    const isNear = useGameStore((s) => s.nearbySlug === HQ_SLUG);
    const select = useGameStore((s) => s.select);
    useFrame((_, dt) => {
        if (ring.current) ring.current.rotation.z += dt * 0.6;
    });

    return (
        <group>
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[4, 7, 4]} position={[0, 7, 0]} />
            </RigidBody>
            <mesh position={[0, 0.3, 0]} receiveShadow>
                <cylinderGeometry args={[9, 9.5, 0.6, 32]} />
                <meshStandardMaterial color={night ? '#1e293b' : '#cbd5e1'} />
            </mesh>
            <mesh
                position={[0, 7, 0]}
                castShadow
                onClick={(e) => {
                    e.stopPropagation();
                    select(HQ_SLUG);
                }}
            >
                <cylinderGeometry args={[3.2, 4.2, 14, 6]} />
                <meshStandardMaterial color={night ? '#0f172a' : '#1e293b'} flatShading />
            </mesh>
            <mesh ref={ring} position={[0, 15.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[3, 0.25, 8, 32]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} />
            </mesh>
            <mesh position={[0, 15.5, 0]}>
                <icosahedronGeometry args={[1.2]} />
                <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} flatShading />
            </mesh>
            {/* Statue of me in front of HQ */}
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[1.4, 1, 1.4]} position={[0, 1, 7.5]} />
            </RigidBody>
            <mesh position={[0, 0.6, 7.5]} castShadow receiveShadow>
                <cylinderGeometry args={[1.5, 1.8, 1.2, 8]} />
                <meshStandardMaterial color={night ? '#334155' : '#e2e8f0'} flatShading />
            </mesh>
            <Avatar3D position={[0, 1.2, 7.5]} scale={1.6} waveHead />
            {isNear && <Marker height={17} color="#22d3ee" />}
            <Html position={[0, 19.5, 0]} center zIndexRange={LABEL_Z} distanceFactor={45}>
                <button
                    type="button"
                    onClick={() => select(HQ_SLUG)}
                    className="whitespace-nowrap rounded-lg bg-slate-900/85 px-3 py-1.5 text-center text-white shadow-lg"
                >
                    <div className="text-sm font-bold">{profile.name}</div>
                    <div className="text-[10px] opacity-80">HQ · {profile.role}</div>
                </button>
            </Html>
        </group>
    );
}

function DistrictSigns() {
    return (
        <>
            {districts.map((d) => {
                // Sign on the road side of the plaza, facing the island center.
                const len = Math.hypot(d.position[0], d.position[1]);
                const sx = d.position[0] - (d.position[0] / len) * 15;
                const sz = d.position[1] - (d.position[1] / len) * 15;
                return (
                    <group key={d.id} position={[sx, 0, sz]}>
                        <mesh position={[0, 1.5, 0]}>
                            <cylinderGeometry args={[0.12, 0.12, 3]} />
                            <meshStandardMaterial color="#334155" />
                        </mesh>
                        <Html position={[0, 3.6, 0]} center zIndexRange={LABEL_Z} distanceFactor={45}>
                            <div
                                className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold text-white shadow"
                                style={{ background: d.color }}
                            >
                                {d.name}
                            </div>
                        </Html>
                    </group>
                );
            })}
        </>
    );
}

export default function Buildings({ night }: { night: boolean }) {
    return (
        <group>
            <HQ night={night} />
            <DistrictSigns />
            {projects.map((p) => (
                <ProjectBuilding key={p.slug} project={p} night={night} />
            ))}
        </group>
    );
}
