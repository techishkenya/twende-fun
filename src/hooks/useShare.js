import { useState } from 'react';

export function useShare() {
    const [sharing, setSharing] = useState(false);

    const handleShare = async ({ title, text, url }) => {
        setSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text,
                    url
                });
                return { success: true, method: 'native' };
            } else {
                await navigator.clipboard.writeText(`${text} ${url}`);
                return { success: true, method: 'clipboard' };
            }
        } catch (error) {
            console.error('Error sharing:', error);
            return { success: false, error };
        } finally {
            setSharing(false);
        }
    };

    return { handleShare, sharing };
}
