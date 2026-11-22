'use client';

import { useRef, useState } from 'react';
import { gameRuntime } from '@/stores/game.store';

const RADIUS = 48;

/** Virtual joystick for touch screens. Writes to gameRuntime.joystick. */
export default function TouchControls() {
    const base = useRef<HTMLDivElement>(null);
    const [knob, setKnob] = useState({ x: 0, y: 0 });
    const pointer = useRef<number | null>(null);

    const update = (clientX: number, clientY: number) => {
        const rect = base.current!.getBoundingClientRect();
        let dx = clientX - (rect.left + rect.width / 2);
        let dy = clientY - (rect.top + rect.height / 2);
        const len = Math.hypot(dx, dy);
        if (len > RADIUS) {
            dx = (dx / len) * RADIUS;
            dy = (dy / len) * RADIUS;
        }
        setKnob({ x: dx, y: dy });
        gameRuntime.joystick.x = dx / RADIUS;
        gameRuntime.joystick.y = -dy / RADIUS;
    };

    const release = () => {
        pointer.current = null;
        setKnob({ x: 0, y: 0 });
        gameRuntime.joystick.x = 0;
        gameRuntime.joystick.y = 0;
    };

    return (
        <div
            ref={base}
            className="pointer-events-auto relative h-32 w-32 touch-none rounded-full border border-white/30 bg-slate-900/40 backdrop-blur"
            onPointerDown={(e) => {
                pointer.current = e.pointerId;
                e.currentTarget.setPointerCapture(e.pointerId);
                update(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
                if (pointer.current === e.pointerId) update(e.clientX, e.clientY);
            }}
            onPointerUp={release}
            onPointerCancel={release}
            aria-label="Drive joystick"
        >
            <div
                className="absolute top-1/2 left-1/2 h-14 w-14 rounded-full bg-white/80 shadow"
                style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
            />
        </div>
    );
}
