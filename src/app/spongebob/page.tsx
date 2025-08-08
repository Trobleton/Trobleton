import { H1 } from '@/components/ui/typography';
import { ChallengeTracker } from './_components/challenges';

export const metadata = {
    title: 'Spongebob Tower Defense',
    description: 'Defend your Krabby Patty from the evil Plankton!',
};

export default function SpongebobPage() {
    return (
        <div className="p-6">
            <H1>Spongebob Tower Defense</H1>
            <ChallengeTracker />
        </div>
    )
}