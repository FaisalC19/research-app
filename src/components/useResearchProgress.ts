import { useState, useEffect } from 'react';

const STAGES = [
    { label: 'Scanning Global News Wires...', duration: 20000 }, // 0-20s
    { label: 'Identifying Key Geopolitical Topics...', duration: 30000 }, // 20-50s
    { label: 'Analyzing Cross-Reference Data...', duration: 40000 }, // 50-90s
    { label: 'Synthesizing Final Report...', duration: 30000 } // 90-120s
];

export function useResearchProgress(isSearching: boolean) {
    const [progress, setProgress] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        if (!isSearching) {
            setProgress(0);
            setCurrentStage(0);
            return;
        }

        const totalDuration = STAGES.reduce((acc, stage) => acc + stage.duration, 0);
        let elapsed = 0;

        // Update progress continuously
        const interval = setInterval(() => {
            elapsed += 100; // Update every 100ms
            const percentage = Math.min((elapsed / totalDuration) * 100, 99); // Cap at 99%
            setProgress(percentage);

            // Determine current stage
            let stageElapsed = 0;
            for (let i = 0; i < STAGES.length; i++) {
                stageElapsed += STAGES[i].duration;
                if (elapsed < stageElapsed) {
                    setCurrentStage(i);
                    break;
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isSearching]);

    return {
        progress,
        stageLabel: STAGES[currentStage]?.label || 'Finalizing...',
        stageIndex: currentStage
    };
}
