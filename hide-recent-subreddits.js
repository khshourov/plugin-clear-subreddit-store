(function() {
    function getElement(elementName) {
        let retries = 0;

        return new Promise((resolve, _) => {
            function findElement() {
                const element = document.querySelector(elementName);
                if (element) {
                    resolve(element);
                } else if (retries < 5) {
                    retries = retries + 1;
                    setTimeout(findElement, 100);
                } else {
                    resolve(null);
                }
            }

            findElement();
        })
    }

    function makeNodeHidden(node) {
        node.style.visibility = 'hidden';
        node.style.display = 'none';
    }

    function makeNodeVisible(node) {
        node.style.removeProperty('visibility');
        node.style.removeProperty('display');
    }

    async function updateRecentPagesVisibility(redditRecentPages, isVisible) {
        redditRecentPages = redditRecentPages ?? await getElement('reddit-recent-pages');
        if (!redditRecentPages) {
            return;
        }

        if (isVisible) {
            makeNodeVisible(redditRecentPages);
            // We also need to hide the <hr /> tag under the
            // <reddit-recent-page>, otherwise there'll be
            // one extra <hr /> tag.
            makeNodeVisible(redditRecentPages.nextElementSibling);
        } else {
            makeNodeHidden(redditRecentPages);
            makeNodeHidden(redditRecentPages.nextElementSibling);
        }
    }

    async function updateVisibility(nodeName, node) {
        const storage = await browser.storage.local.get('visibility');
        const isVisible = storage.visibility === 'visible';

        console.info(`${(new Date()).toLocaleString()}: Change visibility for ${nodeName} to ${storage.visibility}`);
        if (nodeName === 'REDDIT-RECENT-PAGES') {
            updateRecentPagesVisibility(node, isVisible);
        }
    }

    const observe = (observeWindow, observeNodeName, options) => {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === observeNodeName) {
                            updateVisibility(observeNodeName, node);
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(observeWindow, Object.assign({ childList: true, subtree: true }, options));
    };

    observe(document.querySelector('reddit-sidebar-nav'), 'REDDIT-RECENT-PAGES');

    browser.storage.onChanged.addListener(async () => {
        await updateVisibility('REDDIT-RECENT-PAGES');
    });
})();
