"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export function ParticleBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: false,
            fpsLimit: 120,
            interactivity: {
                events: {
                    onHover: {
                        enable: false,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ff6b2b",
                },
                links: {
                    color: "#ff6b2b",
                    distance: 200,
                    enable: true,
                    opacity: 0.25,
                    width: 1.4,
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none" as const,
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out" as const,
                    },
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 220,
                },
                opacity: {
                    value: { min: 0.15, max: 0.5 },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1.5, max: 7 },
                },
            },
            detectRetina: true,
        }),
        []
    );

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="fixed inset-0 -z-10"
        />
    );
}
