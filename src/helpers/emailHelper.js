// helper functions for email service

/**
 * Creates array of email ids
 * @returns Array
 */
export function toArray(emailIds) {
    return emailIds.map(item => {
        return item._id;
    });
}