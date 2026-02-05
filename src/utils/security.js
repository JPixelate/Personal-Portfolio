/**
 * SERJO STUDIO - SECURITY UTILITIES
 * Basic client-side security helpers.
 */

/**
 * Simple HTML Sanitizer to prevent basic XSS if rendering user input.
 * For production-grade sanitization, use a library like DOMPurify.
 */
export const sanitizeHTML = (str) => {
    if (!str) return "";
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
 * Validates email format using a standard regex.
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Prevents rapid-fire submissions (Basic Throttling).
 */
const submissionCache = new Set();
export const canSubmit = (formId, limitMs = 5000) => {
    if (submissionCache.has(formId)) return false;

    submissionCache.add(formId);
    setTimeout(() => {
        submissionCache.delete(formId);
    }, limitMs);

    return true;
};
