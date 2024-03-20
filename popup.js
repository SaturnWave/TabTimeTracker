chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let currentTab = tabs[0];
    chrome.runtime.sendMessage({action: "getTabTime", tabId: currentTab.id}, (response) => {
        document.getElementById('active-time').textContent = `${response / 1000} seconds`;
    });
});
// Path: popup.js