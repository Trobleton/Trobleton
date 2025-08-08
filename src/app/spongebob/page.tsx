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

function ChallengeCard({ world, isActive, timeLeft, isNext }: { world: ChallengeWorld, isActive: boolean, timeLeft?: string, isNext?: boolean }) {
    return (
        <div className="relative w-fit outline-2 outline-white rounded-xl">
            {(isActive || isNext) ? <div className="w-fit rounded-full absolute -top-4 mx-auto inset-x-0 bg-neutral-100 z-10 outline-2 outline-black">
                <svg viewBox="0 0 140 30" width="140px" height="30px">
                    {/* Stroke layer (behind) */}
                    <text 
                        fill="none"
                        stroke="black" 
                        strokeWidth="3px" 
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        x="50%" 
                        y="20"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        {isActive ? `EXPIRES IN: ${timeLeft}` : 'UP NEXT'}
                    </text>
                    {/* Fill layer (on top) */}
                    <text 
                        fill="white" 
                        stroke="none"
                        x="50%" 
                        y="20"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        {isActive ? `EXPIRES IN: ${timeLeft}` : 'UP NEXT'}
                    </text>
                </svg>
            </div> : null}

            <div className="overflow-hidden rounded-xl relative w-[330px] h-[140px]">
                <svg viewBox="0 0 330 50" width="100%" height="50px" className="absolute top-2 left-2 z-10">
                    {/* Stroke layer (behind) */}
                    <text 
                        fill="none"
                        stroke="black" 
                        strokeWidth="4px" 
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        x="5" 
                        y="30"
                        fontSize="18"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        {world.world.toUpperCase()}
                    </text>
                    {/* Fill layer (on top) */}
                    <text 
                        fill="white" 
                        stroke="none"
                        x="5" 
                        y="30"
                        fontSize="18"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        {world.world.toUpperCase()}
                    </text>
                </svg>

                <Image src={world.image} alt={world.world} width={330} height={140} className="w-full h-full object-cover" />
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

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">All Challenges</h2>
                <div className="overflow-x-auto pb-4 pt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-4 w-max px-2">
                        {(() => {
                            const currentIndex = challengeWorlds.findIndex(world => world === currentData.challenge);
                            const nextIndex = (currentIndex + 1) % challengeWorlds.length;
                            const reorderedChallenges = [
                                ...challengeWorlds.slice(nextIndex),
                                ...challengeWorlds.slice(0, nextIndex)
                            ];
                            return reorderedChallenges.map((world, index) => (
                                <ChallengeCard 
                                    key={world.world} 
                                    world={world} 
                                    isActive={false}
                                    isNext={index === 0 && world !== currentData.challenge}
                                />
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}