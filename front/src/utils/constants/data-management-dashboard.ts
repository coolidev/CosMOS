import type { MenuSelector } from 'src/types/dashboard';

export const MENU_ITEMS: MenuSelector = {
    coverage: [
        { id: 0, dataset: 'coverage', name: 'Key Metrics' },
        { id: 1, dataset: 'coverage', name: 'Running Average' },
        { id: 2, dataset: 'coverage_histogram', name: 'Distribution' },
        { id: 3, dataset: 'coverage_histogram', name: 'Statistics Chart' }
    ],
    gap: [
        { id: 0, dataset: 'gap', name: 'Key Metrics' },
        { id: 1, dataset: 'gap', name: 'Running Average' },
        { id: 2, dataset: 'gap_histogram', name: 'Distribution' },
        { id: 3, dataset: 'gap_histogram', name: 'Statistics Chart' }
    ],
    coverageMinutes: [
        { id: 0, dataset: 'coverage', name: 'Key Metrics' },
        { id: 1, dataset: 'coverage', name: 'Running Average' },
        { id: 2, dataset: 'coverage_histogram', name: 'Distribution' },
        { id: 3, dataset: 'coverage_histogram', name: 'Statistics Chart' }
    ],
};