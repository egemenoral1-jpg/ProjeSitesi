/** Label text shrinks with its length so long titles still fit on the tape. */
export const labelFontSize = (label = '') => Math.min(28, Math.round(400 / Math.max(8, label.length)));
