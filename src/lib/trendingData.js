import { FMCG_PRODUCTS } from './products';

// Mock trending data for each supermarket
// In production, this would be calculated from actual price submissions and user activity
export const TRENDING_DATA = {
    carrefour: [
        { productId: 'cf-14', currentPrice: 145, previousPrice: 150, trend: 'down', popularity: 95 },
        { productId: 'bev-6', currentPrice: 125, previousPrice: 120, trend: 'up', popularity: 92 },
        { productId: 'dr-1', currentPrice: 68, previousPrice: 68, trend: 'stable', popularity: 88 },
        { productId: 'sn-1', currentPrice: 285, previousPrice: 280, trend: 'up', popularity: 85 },
        { productId: 'oil-2', currentPrice: 385, previousPrice: 395, trend: 'down', popularity: 82 },
        { productId: 'fl-2', currentPrice: 145, previousPrice: 145, trend: 'stable', popularity: 80 },
        { productId: 'bc-3', currentPrice: 425, previousPrice: 430, trend: 'down', popularity: 78 },
        { productId: 'pc-13', currentPrice: 520, previousPrice: 510, trend: 'up', popularity: 75 },
        { productId: 'hh-1', currentPrice: 185, previousPrice: 190, trend: 'down', popularity: 72 },
        { productId: 'bev-17', currentPrice: 195, previousPrice: 195, trend: 'stable', popularity: 70 },
        { productId: 'rp-4', currentPrice: 245, previousPrice: 250, trend: 'down', popularity: 68 },
        { productId: 'cg-1', currentPrice: 95, previousPrice: 92, trend: 'up', popularity: 65 },
    ],
    naivas: [
        { productId: 'dr-1', currentPrice: 65, previousPrice: 70, trend: 'down', popularity: 98 },
        { productId: 'fl-2', currentPrice: 140, previousPrice: 140, trend: 'stable', popularity: 95 },
        { productId: 'bev-6', currentPrice: 120, previousPrice: 125, trend: 'down', popularity: 90 },
        { productId: 'oil-2', currentPrice: 375, previousPrice: 380, trend: 'down', popularity: 87 },
        { productId: 'sg-2', currentPrice: 235, previousPrice: 240, trend: 'down', popularity: 85 },
        { productId: 'hh-1', currentPrice: 180, previousPrice: 185, trend: 'down', popularity: 82 },
        { productId: 'bk-1', currentPrice: 58, previousPrice: 55, trend: 'up', popularity: 80 },
        { productId: 'pc-2', currentPrice: 85, previousPrice: 85, trend: 'stable', popularity: 78 },
        { productId: 'bev-8', currentPrice: 48, previousPrice: 50, trend: 'down', popularity: 75 },
        { productId: 'dr-9', currentPrice: 165, previousPrice: 170, trend: 'down', popularity: 72 },
        { productId: 'rp-1', currentPrice: 185, previousPrice: 190, trend: 'down', popularity: 70 },
        { productId: 'fp-8', currentPrice: 95, previousPrice: 92, trend: 'up', popularity: 68 },
    ],
    quickmart: [
        { productId: 'bev-6', currentPrice: 118, previousPrice: 120, trend: 'down', popularity: 94 },
        { productId: 'dr-1', currentPrice: 66, previousPrice: 68, trend: 'down', popularity: 92 },
        { productId: 'fl-2', currentPrice: 138, previousPrice: 145, trend: 'down', popularity: 89 },
        { productId: 'oil-2', currentPrice: 370, previousPrice: 375, trend: 'down', popularity: 86 },
        { productId: 'bev-14', currentPrice: 95, previousPrice: 92, trend: 'up', popularity: 83 },
        { productId: 'sn-2', currentPrice: 145, previousPrice: 145, trend: 'stable', popularity: 80 },
        { productId: 'hh-1', currentPrice: 178, previousPrice: 180, trend: 'down', popularity: 78 },
        { productId: 'pc-1', currentPrice: 95, previousPrice: 98, trend: 'down', popularity: 75 },
        { productId: 'bev-15', currentPrice: 68, previousPrice: 65, trend: 'up', popularity: 72 },
        { productId: 'rp-5', currentPrice: 88, previousPrice: 90, trend: 'down', popularity: 70 },
        { productId: 'bc-4', currentPrice: 215, previousPrice: 220, trend: 'down', popularity: 68 },
        { productId: 'fp-3', currentPrice: 125, previousPrice: 120, trend: 'up', popularity: 65 },
    ],
    magunas: [
        { productId: 'dr-1', currentPrice: 62, previousPrice: 65, trend: 'down', popularity: 96 },
        { productId: 'fl-2', currentPrice: 135, previousPrice: 140, trend: 'down', popularity: 93 },
        { productId: 'bev-6', currentPrice: 115, previousPrice: 118, trend: 'down', popularity: 90 },
        { productId: 'oil-2', currentPrice: 365, previousPrice: 370, trend: 'down', popularity: 87 },
        { productId: 'sg-2', currentPrice: 230, previousPrice: 235, trend: 'down', popularity: 84 },
        { productId: 'hh-1', currentPrice: 175, previousPrice: 178, trend: 'down', popularity: 81 },
        { productId: 'bk-1', currentPrice: 55, previousPrice: 58, trend: 'down', popularity: 78 },
        { productId: 'pc-1', currentPrice: 92, previousPrice: 95, trend: 'down', popularity: 75 },
        { productId: 'bev-8', currentPrice: 45, previousPrice: 48, trend: 'down', popularity: 72 },
        { productId: 'rp-1', currentPrice: 180, previousPrice: 185, trend: 'down', popularity: 70 },
        { productId: 'fp-1', currentPrice: 85, previousPrice: 88, trend: 'down', popularity: 68 },
        { productId: 'fp-2', currentPrice: 78, previousPrice: 80, trend: 'down', popularity: 65 },
    ]
};

// Helper function to get trending items for a supermarket
export function getTrendingItems(supermarketId) {
    const trendingData = TRENDING_DATA[supermarketId] || [];

    return trendingData.map(item => {
        const product = FMCG_PRODUCTS.find(p => p.id === item.productId);
        if (!product) return null;

        return {
            ...product,
            currentPrice: item.currentPrice,
            previousPrice: item.previousPrice,
            trend: item.trend,
            popularity: item.popularity,
            priceChange: item.currentPrice - item.previousPrice,
            priceChangePercent: ((item.currentPrice - item.previousPrice) / item.previousPrice * 100).toFixed(1)
        };
    }).filter(Boolean);
}
