document.addEventListener("DOMContentLoaded", () => {
    // Get video ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("id");

    if (!videoId) {
        document.getElementById("content").innerHTML =
            '<div class="container"><p>No video selected. <a href="index.html">Go back</a></p></div>';
        return;
    }

    const videoContainer = document.getElementById("video-container");
    const thumbnailPlaceholder = document.getElementById(
        "thumbnail-placeholder",
    );
    const youtubePlayer = document.getElementById("youtube-player");

    // Determine if it's a short video
    const isShort = videoId.includes("shorts/");

    // Set initial aspect ratio class
    videoContainer.classList.add(isShort ? "portrait" : "landscape");

    // Get video data and render
    getVideoData(videoId)
        .then((data) => {
            document.title = data.title;

            // Set video information
            document.getElementById("video-info").innerHTML = `
                <h1>${data.title}</h1>
                <p><a href="${data.author_url}" target="_blank">${data.author_name}</a></p>
            `;

            // Refine aspect ratio based on actual dimensions from oembed
            const isPortrait = isShort || data.height > data.width;
            videoContainer.classList.remove("landscape", "portrait");
            videoContainer.classList.add(isPortrait ? "portrait" : "landscape");

            // Set thumbnail
            thumbnailPlaceholder.style.backgroundImage = `url('${data.thumbnail_url}')`;

            // Setup the YouTube iframe with appropriate parameters
            let embedId;
            let playerParams = "autoplay=1";

            if (isShort) {
                embedId = videoId.split("shorts/")[1];
                // For shorts: remove controls, hide info, remove YouTube branding
                playerParams +=
                    "&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1";
            } else {
                embedId = videoId;
            }

            // Set iframe source
            youtubePlayer.src = `https://www.youtube.com/embed/${embedId}?${playerParams}`;
            youtubePlayer.title = data.title;

            // After a slight delay, show the YouTube player
            setTimeout(() => {
                thumbnailPlaceholder.style.display = "none";
                youtubePlayer.style.display = "block";
            }, 500);
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
    let actualId = videoId;
    if (videoId.includes("shorts/")) {
        actualId = videoId.split("shorts/")[1];
    }

    const baseUrl = videoId.includes("shorts/")
        ? `https://www.youtube.com/shorts/${actualId}`
        : `https://www.youtube.com/watch?v=${actualId}`;

    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(baseUrl)}&format=json`;
    return (await fetch(url)).json();
}
