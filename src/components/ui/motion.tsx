'use client';

import * as React from 'react';
import {
    animate,
    motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type Variants,
} from 'framer-motion';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

/** Shared motion constants so every section animates with the same feel. */
const REVEAL_DISTANCE = 28;
const REVEAL_DURATION = 0.6;
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/** Fire once, slightly before the element reaches the viewport edge. */
const REVEAL_VIEWPORT = { once: true, margin: '-80px' } as const;

const directionOffset: Record<RevealDirection, { x: number; y: number }> = {
    up: { x: 0, y: REVEAL_DISTANCE },
    down: { x: 0, y: -REVEAL_DISTANCE },
    left: { x: REVEAL_DISTANCE, y: 0 },
    right: { x: -REVEAL_DISTANCE, y: 0 },
    none: { x: 0, y: 0 },
};

type MotionDivProps = React.ComponentPropsWithoutRef<typeof motion.div>;

interface RevealProps extends Omit<MotionDivProps, 'initial' | 'whileInView' | 'viewport'> {
    direction?: RevealDirection;
    delay?: number;
}

/**
 * Fades an element in as it scrolls into view. When the visitor asks for
 * reduced motion the element only fades, without sliding.
 */
function Reveal({ direction = 'up', delay = 0, children, ...props }: Readonly<RevealProps>) {
    const shouldReduceMotion = useReducedMotion();
    const offset = shouldReduceMotion ? directionOffset.none : directionOffset[direction];

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{
                duration: shouldReduceMotion ? 0.3 : REVEAL_DURATION,
                delay,
                ease: REVEAL_EASE,
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

const STAGGER_STEP = 0.09;

interface RevealStaggerProps extends Omit<MotionDivProps, 'initial' | 'whileInView' | 'viewport'> {
    /** Seconds to wait before the first child starts. */
    delay?: number;
}

/**
 * Wraps a list or grid so its children appear one after another. Pair it with
 * RevealItem — the children opt into the timing through variants.
 */
function RevealStagger({ delay = 0, children, ...props }: Readonly<RevealStaggerProps>) {
    const variants: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: STAGGER_STEP, delayChildren: delay } },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={REVEAL_VIEWPORT}
            variants={variants}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface RevealItemProps extends Omit<MotionDivProps, 'variants'> {
    direction?: RevealDirection;
}

function RevealItem({ direction = 'up', children, ...props }: Readonly<RevealItemProps>) {
    const shouldReduceMotion = useReducedMotion();
    const offset = shouldReduceMotion ? directionOffset.none : directionOffset[direction];

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, ...offset },
                show: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                        duration: shouldReduceMotion ? 0.3 : REVEAL_DURATION,
                        ease: REVEAL_EASE,
                    },
                },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/** Splits "50K+" into prefix "", number 50 and suffix "K+". */
const parseStatValue = (value: string) => {
    const match = /^(\D*?)([\d.]+)(.*)$/.exec(value.trim());
    if (!match) return null;

    const target = Number(match[2]);
    if (Number.isNaN(target)) return null;

    return { prefix: match[1], target, suffix: match[3] };
};

interface CountUpProps extends React.ComponentPropsWithoutRef<typeof motion.span> {
    /** Stat as written, e.g. "50K+", "100%", "$15B". */
    value: string;
}

/**
 * Counts a stat up from zero the first time it scrolls into view. Values it
 * cannot parse are rendered as plain text, so no stat can silently disappear.
 */
function CountUp({ value, ...props }: Readonly<CountUpProps>) {
    const shouldReduceMotion = useReducedMotion();
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    const parsed = React.useMemo(() => parseStatValue(value), [value]);
    const count = useMotionValue(0);
    const display = useTransform(count, (latest) =>
        parsed ? `${parsed.prefix}${Math.round(latest)}${parsed.suffix}` : value,
    );

    React.useEffect(() => {
        if (!parsed || !isInView) return;

        if (shouldReduceMotion) {
            count.set(parsed.target);
            return;
        }

        const controls = animate(count, parsed.target, { duration: 1.4, ease: 'easeOut' });
        return () => controls.stop();
    }, [count, isInView, parsed, shouldReduceMotion]);

    if (!parsed) {
        return (
            <motion.span ref={ref} {...props}>
                {value}
            </motion.span>
        );
    }

    return (
        <motion.span ref={ref} {...props}>
            {display}
        </motion.span>
    );
}

export { CountUp, Reveal, RevealItem, RevealStagger, REVEAL_EASE, REVEAL_VIEWPORT };
export type { RevealDirection };
