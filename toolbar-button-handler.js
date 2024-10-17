browser.runtime.onInstalled.addListener(async () => {
    try {
        await browser.storage.local.set({ 'visibility': 'hidden' });
    } catch(err) {
        console.log('Error occurred when setting `visibility` property in local-storage: ', err.message);
    }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    const storage = await browser.storage.local.get('visibility');
    const updatedVisibility = storage.visibility;
    await browser.pageAction.setIcon({
        tabId: tabId,
        path: {
            16: `icons/toolbar/${updatedVisibility}/hrs-16.png`,
            32: `icons/toolbar/${updatedVisibility}/hrs-32.png`,
            64: `icons/toolbar/${updatedVisibility}/hrs-64.png`,
        },
    });
}, { urls: ["https://www.reddit.com/*"] })

browser.pageAction.onClicked.addListener(async (tab) => {
    try {
        const storage = await browser.storage.local.get('visibility');
        const updatedVisibility = storage.visibility === 'hidden' ? 'visible' : 'hidden';
        await browser.storage.local.set({ 'visibility': updatedVisibility });
    } catch(err) {
        console.log('Error occurred when updating `visibility` property in local-storage: ', err.message);
    }
});

browser.storage.onChanged.addListener(async () => {
    try {
        const storage = await browser.storage.local.get('visibility');
        const updatedVisibility = storage.visibility;
        const tabs = await browser.tabs.query({ url: "https://www.reddit.com/*" });
        for (const tab of tabs) {
            await browser.pageAction.setIcon({
                tabId: tab.id,
                path: {
                    16: `icons/toolbar/${updatedVisibility}/hrs-16.png`,
                    32: `icons/toolbar/${updatedVisibility}/hrs-32.png`,
                    64: `icons/toolbar/${updatedVisibility}/hrs-64.png`,
                },
            });
        }
    } catch(err) {
        console.log('Error occurred when updating icon: ', err.message);
    }
});
