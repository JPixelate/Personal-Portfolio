
const LIMIT_KEY = 'ai_chat_usage_metrics';
const MAX_MESSAGES = 5;

/**
 * Manages chat rate limiting for the AI assistant.
 * Persists usage data in localStorage to survive refreshes.
 */
export const getChatUsage = () => {
    try {
        const stored = localStorage.getItem(LIMIT_KEY);
        if (!stored) return { count: 0, date: new Date().toDateString() };
        
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset if it's a new day
        if (data.date !== today) {
            return { count: 0, date: today };
        }
        
        return data;
    } catch (e) {
        return { count: 0, date: new Date().toDateString() };
    }
};

export const incrementChatUsage = () => {
    const data = getChatUsage();
    data.count += 1;
    localStorage.setItem(LIMIT_KEY, JSON.stringify(data));
    return data;
};

export const hasReachedLimit = () => {
    const data = getChatUsage();
    return data.count >= MAX_MESSAGES;
};

export const getRemainingMessages = () => {
    const data = getChatUsage();
    return Math.max(0, MAX_MESSAGES - data.count);
};

export const CONTACT_INFO_MESSAGE = `
**Chat limit reached for today.** 

To ensure everyone gets a chance to interact with the AI, I've had to set a small daily limit. But don't worry! Chat will resume tomorrow.

In the meantime, you can reach Jonald directly here:
- 📧 **Email**: [jonaldpenpillo@gmail.com](mailto:jonaldpenpillo@gmail.com)
- 📱 **WhatsApp**: [+63 910 787 6246](https://wa.me/639107876246)
- 💜 **Viber**: +63 992 713 3582
- 📸 **Instagram**: [@h4kuna_11](https://instagram.com/h4kuna_11)
`;
