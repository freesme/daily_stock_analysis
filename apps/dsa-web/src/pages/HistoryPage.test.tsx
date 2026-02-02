import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import HistoryPage from './HistoryPage';
import * as apiHooks from '@/hooks/useApi';
import {MemoryRouter} from 'react-router';

// Mock the hook
vi.mock('@/hooks/useApi', () => ({
    useAnalysisHistory: vi.fn(),
}));

const mockHistoryData = [
    {
        id: 1,
        query_id: 'q1',
        code: '600519',
        name: 'Moutai',
        sentiment_score: 85,
        operation_advice: 'Buy strongly',
        report_type: 'full',
        created_at: '2023-01-01T10:00:00',
    },
    {
        id: 2,
        query_id: 'q2',
        code: '000001',
        name: 'PingAn',
        sentiment_score: 40,
        operation_advice: 'Sell now',
        report_type: 'simple',
        created_at: '2023-01-02T10:00:00',
    },
];

describe('HistoryPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        (apiHooks.useAnalysisHistory as any).mockReturnValue({
            isLoading: true,
            data: undefined,
        });

        render(
            <MemoryRouter>
                <HistoryPage/>
            </MemoryRouter>
        );

        // Should show skeletons (checking for table rows that contain skeletons is hard,
        // but we can check if data is NOT there)
        expect(screen.queryByText('Moutai')).not.toBeInTheDocument();
    });

    it('renders data correctly', () => {
        (apiHooks.useAnalysisHistory as any).mockReturnValue({
            isLoading: false,
            data: {data: mockHistoryData},
        });

        render(
            <MemoryRouter>
                <HistoryPage/>
            </MemoryRouter>
        );

        expect(screen.getByText('Moutai')).toBeInTheDocument();
        expect(screen.getByText('PingAn')).toBeInTheDocument();
        expect(screen.getByText('600519')).toBeInTheDocument();
    });

    it('filters by search query', async () => {
        (apiHooks.useAnalysisHistory as any).mockReturnValue({
            isLoading: false,
            data: {data: mockHistoryData},
        });

        render(
            <MemoryRouter>
                <HistoryPage/>
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText('Search by stock code or name...');
        fireEvent.change(searchInput, {target: {value: 'PingAn'}});

        expect(screen.getByText('PingAn')).toBeInTheDocument();
        expect(screen.queryByText('Moutai')).not.toBeInTheDocument();
    });

    it('filters by status', async () => {
        (apiHooks.useAnalysisHistory as any).mockReturnValue({
            isLoading: false,
            data: {data: mockHistoryData},
        });

        render(
            <MemoryRouter>
                <HistoryPage/>
            </MemoryRouter>
        );

        // Mock data has 1 Buy (Moutai) and 1 Sell (PingAn)

        // Click 'Buy' filter (MUI ToggleButton)
        const buyButton = screen.getByRole('button', {name: /buy/i});
        fireEvent.click(buyButton);

        expect(screen.getByText('Moutai')).toBeInTheDocument();
        expect(screen.queryByText('PingAn')).not.toBeInTheDocument();

        // Click 'Sell' filter
        const sellButton = screen.getByRole('button', {name: /sell/i});
        fireEvent.click(sellButton);

        expect(screen.queryByText('Moutai')).not.toBeInTheDocument();
        expect(screen.getByText('PingAn')).toBeInTheDocument();
    });
});
