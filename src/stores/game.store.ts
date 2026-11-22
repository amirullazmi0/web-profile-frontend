import { create } from 'zustand';
import type { DistrictId } from '@/data/projects';

/** Special slug for the HQ building in the middle of the island. */
export const HQ_SLUG = 'hq';

export interface GameState {
    started: boolean;
    /** Building the rover is parked next to (project slug or HQ_SLUG). */
    nearbySlug: string | null;
    /** Building whose detail panel is open. */
    selectedSlug: string | null;
    activeDistrict: DistrictId | null;
    lowQuality: boolean;
    /** Pending teleport target (x, z), consumed by the rover. */
    teleportTo: [number, number] | null;

    start: () => void;
    setNearby: (slug: string | null) => void;
    select: (slug: string | null) => void;
    setActiveDistrict: (id: DistrictId | null) => void;
    setLowQuality: (low: boolean) => void;
    teleport: (target: [number, number] | null) => void;
}

export const useGameStore = create<GameState>()((set) => ({
    started: false,
    nearbySlug: null,
    selectedSlug: null,
    activeDistrict: null,
    lowQuality: false,
    teleportTo: null,

    start: () => set({ started: true }),
    setNearby: (slug) => set({ nearbySlug: slug }),
    select: (slug) => set({ selectedSlug: slug }),
    setActiveDistrict: (id) => set({ activeDistrict: id }),
    setLowQuality: (low) => set({ lowQuality: low }),
    teleport: (target) => set({ teleportTo: target }),
}));

/**
 * Per-frame values kept outside React state so they never trigger re-renders.
 * The rover writes its pose here; touch controls write the joystick here.
 */
export const gameRuntime = {
    rover: { x: 0, z: 8, heading: Math.PI },
    joystick: { x: 0, y: 0 },
};
