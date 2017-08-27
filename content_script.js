function lookup(selection) {
    var searchUrl = 'http://showphone.market.alicloudapi.com/6-1?num=' +
        encodeURI(selection.selectionText);
    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    x.setRequestHeader('Authorization', 'APPCODE ');
    x.responseType = 'json';
    x.onload = function() {
        // Parse and process the response from Google Image Search.
        var response = x.response;
        if (response && response.showapi_res_body.ret_code === 0) {
            alert(response.showapi_res_body.prov + response.showapi_res_body.city);
        } else {
            alert('查询失败。');
        }
    };
    x.onerror = function() {
        errorCallback('我们遇到了一点小问题...');
    };
    x.send();
    return true;
}

function lookupInjected() {
    chrome.tabs.executeScript(null, {
        code: 'var text = ""; if (window.getSelection) { text = window.getSelection().toString(); } else if (document.selection && document.selection.type != "Control") { text = document.selection.createRange().text; } { selectionText: text }'
    }, function(results) {
        lookup({ selectionText: results })
    })
}

chrome.commands.onCommand.addListener(function(command){
    if(command === "location-lookup") {
        lookupInjected()
    }
});

chrome.contextMenus.onClicked.addListener(lookup);
chrome.browserAction.onClicked.addListener(lookupInjected);

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "urbanDictionaryContext",
        "title": "Lookup the selected text on Urban Directory",
        "contexts": ["selection"]
    }, function () {
        if (chrome.extension.lastError) {
            console.error("Got expected error: " + chrome.extension.lastError.message);
        }
    });
});