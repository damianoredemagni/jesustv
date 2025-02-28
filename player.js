document.addEventListener("DOMContentLoaded", () => {
    // Get video ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("id");

    if (!videoId) {
        document.getElementById("content").innerHTML =
            '<div class="container"><p>No video selected. <a href="index.html">Go back</a></p></div>';
        return;
    }

    const playerDiv = document.getElementById("player");
    const videoContainer = document.getElementById("video-container");

    // Set initial aspect ratio based on URL
    const isShort = videoId.includes("shorts/");
    if (isShort) {
        playerDiv.classList.add("portrait");
    } else {
        playerDiv.classList.add("landscape");
    }

    // Get video data and render
    getVideoData(videoId)
        .then((data) => {
            document.title = data.title;

            // Set background image first for a smoother loading experience
            playerDiv.style.backgroundImage = `url('${data.thumbnail_url}')`;

            // Refine aspect ratio based on actual dimensions from oembed
            const isPortrait = isShort || data.height > data.width;
            playerDiv.classList.remove("landscape", "portrait");
            playerDiv.classList.add(isPortrait ? "portrait" : "landscape");

            // Set video information
            document.getElementById("video-info").innerHTML = `
                <h1>${data.title}</h1>
                <p><a href="${data.author_url}" target="_blank">${data.author_name}</a></p>
            `;

            // After a slight delay to ensure background is visible, load the actual player
            setTimeout(() => {
                // Handle both regular videos and shorts
                let embedUrl;
                let playerParams = "autoplay=1";

                if (isShort) {
                    const shortId = videoId.split("shorts/")[1];
                    embedUrl = `https://www.youtube.com/embed/${shortId}`;
                    // For shorts: remove controls, hide info, remove YouTube branding
                    playerParams +=
                        "&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1";
                } else {
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }

                // Create and insert the iframe with appropriate parameters
                const iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.src = `${embedUrl}?${playerParams}`;
                iframe.frameBorder = "0";
                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;

                // Clear background and add iframe
                playerDiv.style.backgroundImage = "";
                playerDiv.appendChild(iframe);
            }, 500); // 500ms delay to show thumbnail before video loads
        })
        .catch((err) => {
            console.error("Error fetching video details:", err);
            document.getElementById("video-info").innerHTML = `
                <p>Error loading video information.</p>
            `;
        });
});

async function getVideoData(videoId) {
    // Handle both regular videos and shorts
    const baseUrl = videoId.includes("shorts/")
        ? `https://www.youtube.com/shorts/${videoId.split("shorts/")[1]}`
        : `https://www.youtube.com/watch?v=${videoId}`;
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(baseUrl)}&format=json`;
    return (await fetch(url)).json();
}
