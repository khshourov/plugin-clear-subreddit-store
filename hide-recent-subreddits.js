(function() {
    function getRedditRecentPagesElement() {
        let retries = 0;

        return new Promise((resolve, _) => {
            function findElement() {
                const element = document.querySelector('reddit-recent-pages');
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

    async function updateVisibility() {
        const redditRecentPages = await getRedditRecentPagesElement();
        if (redditRecentPages) {
            const storage = await browser.storage.local.get('visibility');
            if (storage.visibility === 'visible') {
                redditRecentPages.style.removeProperty('visibility');
                redditRecentPages.style.removeProperty('display');
            } else {
                redditRecentPages.style.visibility = 'hidden';
                redditRecentPages.style.display = 'none';
            }
        }
    }

    window.addEventListener('load', async function() {
        await updateVisibility();
    });

    browser.storage.onChanged.addListener(async () => {
        await updateVisibility();
    });
})();
