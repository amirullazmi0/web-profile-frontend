'use client';

import { useEffect, useRef } from 'react';
import { buildingPositions, districts } from '@/data/projects';
import { gameRuntime, useGameStore } from '@/stores/game.store';
import { ISLAND_RADIUS } from '../World';

const SIZE = 150;
const RANGE = ISLAND_RADIUS + 6;
const toMap = (v: number) => ((v + RANGE) / (RANGE * 2)) * SIZE;

/** Top-down map. Clicking a district or HQ teleports the rover there. */
export default function Minimap() {
    const rover = useRef<SVGGElement>(null);
    const teleport = useGameStore((s) => s.teleport);
    const active = useGameStore((s) => s.activeDistrict);

    useEffect(() => {
        let id = 0;
        const loop = () => {
            const { x, z, heading } = gameRuntime.rover;
            // Map x → right, world z → down; heading 0 points to +z (down on the map).
            const deg = 180 - (heading * 180) / Math.PI;
            rover.current?.setAttribute('transform', `translate(${toMap(x)} ${toMap(z)}) rotate(${deg})`);
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="rounded-full border border-white/20 bg-slate-900/70 shadow-lg backdrop-blur"
            role="img"
            aria-label="Island map"
        >
            <circle cx={SIZE / 2} cy={SIZE / 2} r={(ISLAND_RADIUS / RANGE) * (SIZE / 2)} fill="#3f7d3a" opacity={0.6} />
            {districts.map((d) => (
                <line
                    key={`road-${d.id}`}
                    x1={SIZE / 2}
                    y1={SIZE / 2}
                    x2={toMap(d.position[0])}
                    y2={toMap(d.position[1])}
                    stroke="#52525b"
                    strokeWidth={2}
                />
            ))}
            {Object.entries(buildingPositions).map(([slug, [x, z]]) => (
                <rect key={slug} x={toMap(x) - 1.5} y={toMap(z) - 1.5} width={3} height={3} fill="#e2e8f0" opacity={0.7} />
            ))}
            {districts.map((d) => (
                <circle
                    key={d.id}
                    cx={toMap(d.position[0])}
                    cy={toMap(d.position[1])}
                    r={active === d.id ? 10 : 8}
                    fill={d.color}
                    opacity={active === d.id ? 0.7 : 0.4}
                    className="cursor-pointer"
                    onClick={() => teleport(d.position)}
                >
                    <title>{`Go to ${d.name}`}</title>
                </circle>
            ))}
            <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={5}
                fill="#22d3ee"
                className="cursor-pointer"
                onClick={() => teleport([0, 7])}
            >
                <title>Go to HQ</title>
            </circle>
            <g ref={rover}>
                <path d="M0 -6 L4 5 L0 3 L-4 5 Z" fill="#ef4444" stroke="white" strokeWidth={1} />
            </g>
        </svg>
    );
}
