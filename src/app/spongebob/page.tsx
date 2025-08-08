'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { H1, H2 } from '@/components/ui/typography';

type ChallengeWorld = {
    world: string;
    image: string;
}

const challengeWorlds: ChallengeWorld[] = [
    { world: "Christmas Conch Street", image: "/images/spongebob/Conch_Street_Frozen_Face-Off.webp" },
    { world: "Goo Lagoon", image: "/images/spongebob/Goo_Lagoon.webp" },
    { world: "Mrs. Puff's Boating School", image: "/images/spongebob/Mrs_Puffs_Boating_School.webp" },
    { world: "Patty Vault", image: "/images/spongebob/PattyVault.webp" },
    { world: "Flying Dutchman's Ship", image: "/images/spongebob/Flying_Duchmans_Ship.webp" }
];

function getCurrentChallenge(): { challenge: ChallengeWorld; timeLeft: string } {
    const now = new Date();
    
    // Flying Dutchman will be active at 5AM UTC
    const flyingDutchmanStart = new Date('2025-08-08T05:00:00.000Z');
    const secondsSinceFlyingStart = Math.floor((now.getTime() - flyingDutchmanStart.getTime()) / 1000);
    
    // Flying Dutchman is index 4, so offset by 4 * 15 * 60 = 3600 seconds to get cycle start
    const totalSeconds = secondsSinceFlyingStart + (4 * 15 * 60);
    const cyclePosition = ((totalSeconds % (75 * 60)) + (75 * 60)) % (75 * 60); // Handle negative values
    const challengeIndex = Math.floor(cyclePosition / (15 * 60));
    const secondsInCurrentChallenge = cyclePosition % (15 * 60);
    const secondsLeft = (15 * 60) - secondsInCurrentChallenge;
    
    const minutesLeft = Math.floor(secondsLeft / 60);
    const secsLeft = secondsLeft % 60;
    const timeLeftFormatted = `${minutesLeft}:${secsLeft.toString().padStart(2, '0')}`;
    
    return {
        challenge: challengeWorlds[challengeIndex],
        timeLeft: timeLeftFormatted
    };
}

function ChallengeCard({ world, isActive, timeLeft }: { world: ChallengeWorld, isActive: boolean, timeLeft?: string }) {
    return (
        <div className="relative w-fit">
            {isActive ? <div className="w-fit px-3 p-0.5 outline-2 outline-neutral-900 rounded-full absolute -top-4 mx-auto inset-x-0 bg-neutral-100 z-10">
                <span className="text-sm font-bold text-white uppercase [text-shadow:1px_1px_0_black,-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black]">Expires In: {timeLeft}</span>
            </div> : null}

            <div className="overflow-hidden rounded-xl relative">
                <span className="absolute text-xl top-4 left-2 font-extrabold text-white [text-shadow:2px_2px_0_black,-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black]">{world.world}</span>
                <Image src={world.image} alt={world.world} width={300} height={200} className="object-cover" />
            </div>
        </div>
    )
}

export default function SpongebobPage() {
    const [currentData, setCurrentData] = useState<{ challenge: ChallengeWorld; timeLeft: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setCurrentData(getCurrentChallenge());
        
        const interval = setInterval(() => {
            setCurrentData(getCurrentChallenge());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted || !currentData) {
        return (
            <div className="p-6">
                <H1>Spongebob Tower Defense</H1>
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <H1>Spongebob Tower Defense</H1>

            <div className="flex items-center justify-center mt-8">
                <ChallengeCard world={currentData.challenge} isActive={true} timeLeft={currentData.timeLeft} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {challengeWorlds.map((world, index) => (
                    <ChallengeCard key={index} world={world} isActive={false} />
                ))}
            </div>
        </div>
    )
}