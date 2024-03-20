let tabTimes = {};
let activeTabId = null;
let lastTime = Date.now();

chrome.tabs.onActivated.addListener(activeInfo => {
    if (activeTabId !== null) {
        let currentTime = Date.now();
        tabTimes[activeTabId] = (tabTimes[activeTabId] || 0) + (currentTime - lastTime);
    }
    activeTabId = activeInfo.tabId;
    lastTime = Date.now();
});

function getTabTime(tabId, callback) {
    let currentTime = Date.now();
    let activeTime = tabTimes[tabId] || 0;
    if (tabId === activeTabId) {
        activeTime += currentTime - lastTime;
    }
    callback(activeTime);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabTime" && request.tabId) {
        getTabTime(request.tabId, sendResponse);
        return true;  // Indicates response will be sent asynchronously
    }
});
// Path: background.js


chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let currentTab = tabs[0];
    chrome.runtime.sendMessage({action: "getTabTime", tabId: currentTab.id}, (response) => {
        document.getElementById('active-time').textContent = `${response / 1000} seconds`;
    });
});
// Path: popup.js