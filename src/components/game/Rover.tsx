'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { Quaternion, Vector3, type Group } from 'three';
import { buildingPositions, districts } from '@/data/projects';
import { HQ_SLUG, gameRuntime, useGameStore } from '@/stores/game.store';

export type Controls = 'forward' | 'back' | 'left' | 'right' | 'brake' | 'reset';

const MAX_SPEED = 20;
const REVERSE_SPEED = 8;
const ACCEL = 2.6;
const TURN_RATE = 2.2;
const NEAR_DISTANCE = 7.5;
const START: [number, number, number] = [0, 1, 16];

const proximityTargets: { slug: string; x: number; z: number }[] = [
    { slug: HQ_SLUG, x: 0, z: 0 },
    ...Object.entries(buildingPositions).map(([slug, [x, z]]) => ({ slug, x, z })),
];

const quat = new Quaternion();
const up = new Vector3(0, 1, 0);
const camTarget = new Vector3();
const camLook = new Vector3();

export default function Rover() {
    const body = useRef<RapierRigidBody>(null);
    const wheels = useRef<Group>(null);
    const speed = useRef(0);
    const heading = useRef(Math.PI);
    const [, getKeys] = useKeyboardControls<Controls>();

    useFrame((state, rawDt) => {
        const rb = body.current;
        if (!rb) return;
        const dt = Math.min(rawDt, 0.05);
        const store = useGameStore.getState();

        // Teleport (minimap click) or reset key.
        const keys = getKeys();
        const tp = store.teleportTo ?? (keys.reset ? ([START[0], START[2]] as [number, number]) : null);
        if (tp) {
            rb.setTranslation({ x: tp[0], y: 1, z: tp[1] + (store.teleportTo ? 9 : 0) }, true);
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
            speed.current = 0;
            heading.current = Math.PI;
            if (store.teleportTo) store.teleport(null);
        }

        // Input is blocked while a detail panel is open.
        const blocked = !store.started || store.selectedSlug !== null;
        const joy = gameRuntime.joystick;
        let throttle = blocked ? 0 : (keys.forward ? 1 : 0) - (keys.back ? 1 : 0) + joy.y;
        let steer = blocked ? 0 : (keys.left ? 1 : 0) - (keys.right ? 1 : 0) - joy.x;
        throttle = Math.max(-1, Math.min(1, throttle));
        steer = Math.max(-1, Math.min(1, steer));

        const target = throttle >= 0 ? throttle * MAX_SPEED : throttle * REVERSE_SPEED;
        const rate = keys.brake ? ACCEL * 3 : ACCEL;
        speed.current += (target - speed.current) * Math.min(1, rate * dt);
        if (keys.brake && !blocked) speed.current *= 1 - Math.min(1, 4 * dt);

        const turnFactor = Math.min(1, Math.abs(speed.current) / 4) * Math.sign(speed.current);
        heading.current += steer * TURN_RATE * dt * turnFactor;

        const h = heading.current;
        const vel = rb.linvel();
        rb.setLinvel({ x: Math.sin(h) * speed.current, y: vel.y, z: Math.cos(h) * speed.current }, true);
        quat.setFromAxisAngle(up, h);
        rb.setRotation(quat, true);

        const p = rb.translation();
        // Safety net if the rover ever falls off.
        if (p.y < -5) rb.setTranslation({ x: START[0], y: 2, z: START[2] }, true);

        gameRuntime.rover.x = p.x;
        gameRuntime.rover.z = p.z;
        gameRuntime.rover.heading = h;

        if (wheels.current) {
            wheels.current.children.forEach((w) => {
                w.rotation.x += speed.current * dt * 1.5;
            });
        }

        // Proximity to buildings and districts.
        let nearest: string | null = null;
        let best = NEAR_DISTANCE;
        for (const t of proximityTargets) {
            const d = Math.hypot(t.x - p.x, t.z - p.z);
            if (d < best) {
                best = d;
                nearest = t.slug;
            }
        }
        if (nearest !== store.nearbySlug) store.setNearby(nearest);

        let district = null;
        let bestD = 22;
        for (const d of districts) {
            const dist = Math.hypot(d.position[0] - p.x, d.position[1] - p.z);
            if (dist < bestD) {
                bestD = dist;
                district = d.id;
            }
        }
        if (district !== store.activeDistrict) store.setActiveDistrict(district);

        // Chase camera.
        const camDist = 13;
        camTarget.set(p.x - Math.sin(h) * camDist, p.y + 7.5, p.z - Math.cos(h) * camDist);
        state.camera.position.lerp(camTarget, 1 - Math.exp(-4 * dt));
        camLook.set(p.x + Math.sin(h) * 4, p.y + 1, p.z + Math.cos(h) * 4);
        state.camera.lookAt(camLook);
    });

    return (
        <RigidBody
            ref={body}
            position={START}
            colliders={false}
            enabledRotations={[false, false, false]}
            linearDamping={0.5}
            canSleep={false}
        >
            <CuboidCollider args={[1.1, 0.6, 1.7]} position={[0, 0.6, 0]} />
            <group>
                {/* Body */}
                <mesh position={[0, 0.8, 0]} castShadow>
                    <boxGeometry args={[2, 0.7, 3.2]} />
                    <meshStandardMaterial color="#ef4444" flatShading />
                </mesh>
                {/* Cabin */}
                <mesh position={[0, 1.4, -0.3]} castShadow>
                    <boxGeometry args={[1.6, 0.6, 1.6]} />
                    <meshStandardMaterial color="#f8fafc" flatShading />
                </mesh>
                {/* Windshield */}
                <mesh position={[0, 1.4, 0.52]}>
                    <boxGeometry args={[1.4, 0.45, 0.05]} />
                    <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} />
                </mesh>
                {/* Antenna */}
                <mesh position={[0.6, 2, -0.8]}>
                    <cylinderGeometry args={[0.03, 0.03, 1]} />
                    <meshStandardMaterial color="#111827" />
                </mesh>
                <mesh position={[0.6, 2.55, -0.8]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={2} />
                </mesh>
                {/* Headlights */}
                {[-0.6, 0.6].map((x) => (
                    <mesh key={x} position={[x, 0.85, 1.62]}>
                        <boxGeometry args={[0.35, 0.2, 0.05]} />
                        <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={1.5} />
                    </mesh>
                ))}
                {/* Wheels */}
                <group ref={wheels}>
                    {[
                        [-1.05, 0.45, 1.05],
                        [1.05, 0.45, 1.05],
                        [-1.05, 0.45, -1.05],
                        [1.05, 0.45, -1.05],
                    ].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
                            <cylinderGeometry args={[0.45, 0.45, 0.35, 10]} />
                            <meshStandardMaterial color="#1f2937" flatShading />
                        </mesh>
                    ))}
                </group>
            </group>
        </RigidBody>
    );
}
