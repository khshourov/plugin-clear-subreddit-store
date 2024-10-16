(function() {
    function getRedditRecentPagesElement() {
        const MAX_RETRIES = 5;
        const INTERVAL = 100;

        let retries = 0;

        return new Promise((resolve, _) => {
            function findElement() {
                const element = document.querySelector('reddit-recent-pages');
                if (element) {
                    resolve(element);
                } else if (retries < MAX_RETRIES) {
                    retries = retries + 1;
                    setTimeout(findElement, INTERVAL);
                } else {
                    resolve(null);
                }
            }

            findElement();
        })
    }

    window.addEventListener('load', async function() {
        const redditRecentPages = await getRedditRecentPagesElement();
        if (redditRecentPages) {
            redditRecentPages.style.visibility = 'hidden';
            redditRecentPages.style.display = 'none';
        }
    });
})();
