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
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    repulse: {
                        distance: 120,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ff6b2b",
                },
                links: {
                    color: "#ff6b2b",
                    distance: 150,
                    enable: true,
                    opacity: 0.08,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.6,
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
                    value: 60,
                },
                opacity: {
                    value: { min: 0.05, max: 0.15 },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 2.5 },
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
