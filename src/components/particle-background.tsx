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
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    repulse: {
                        distance: 200,
                        duration: 0.6,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ff6b2b",
                },
                links: {
                    color: "#ff6b2b",
                    distance: 180,
                    enable: true,
                    opacity: 0.2,
                    width: 1.2,
                },
                move: {
                    enable: true,
                    speed: 1.5,
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
                    value: 150,
                },
                opacity: {
                    value: { min: 0.1, max: 0.375 },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1.5, max: 6.25 },
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
