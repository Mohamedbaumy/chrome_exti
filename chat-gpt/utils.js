export async function getActiveTabUrl() {
    const queryOptions = {
        active: true,
        currentWindow: true
    };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}