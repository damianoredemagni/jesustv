async function loadContent() {
    const data = await fetch("content.json").then((res) => res.json());
    const contentSection = document.querySelector("#content");

    for (const [category, videos] of Object.entries(data)) {
        const section = document.createElement("section");
        section.innerHTML = `
            <div class="row">
                <h2>${category}</h2>
                <div class="container column">
                ${videos
                    .map(
                        (video) => `
                    <div class="card">
                        <div class="video-embed" data-video-id="${video.id}"></div>
                        <div class="info-text"></div>
                    </div>
                `,
                    )
                    .join("")}
                </div>
            </div>
        `;
        contentSection.appendChild(section);

        section.querySelectorAll(".card").forEach((card, index) => {
            const videoEmbed = card.querySelector(".video-embed");
            const videoId = videoEmbed.dataset.videoId;

            // Make the card clickable
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                // Navigate to the details page with the video ID as a parameter
                window.location.href = `v.html?id=${videoId}`;
            });

            getVideoData(videoId)
                .then((data) => {
                    console.log(`Processing video: ${videoId}`);
                    console.log(
                        `Dimensions - Width: ${data.width}, Height: ${data.height}`,
                    );

                    // Alternative check for YouTube Shorts
                    const isShort = videoId.includes("shorts/");
                    const isPortrait = isShort || data.height > data.width;

                    videoEmbed.classList.remove("landscape", "portrait");

                    if (isPortrait) {
                        videoEmbed.classList.add("portrait");
                        console.log(`Set as portrait: ${videoId}`);
                    } else {
                        videoEmbed.classList.add("landscape");
                        console.log(`Set as landscape: ${videoId}`);
                    }

                    videoEmbed.style.backgroundImage = `url('${data.thumbnail_url}')`;
                    card.querySelector(".info-text").innerHTML = `
                        <p><strong>${data.title}</strong></p>
                        <a href="${data.author_url}" target="_blank">${data.author_name}</a>
                    `;
                })
                .catch((error) => {
                    console.error(`Error with video ${videoId}:`, error);
                });
        });
    }
}

async function getVideoData(videoId) {
    // Handle both regular videos and shorts
    const baseUrl = videoId.includes("shorts/")
        ? `https://www.youtube.com/shorts/${videoId.split("shorts/")[1]}`
        : `https://www.youtube.com/watch?v=${videoId}`;
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(baseUrl)}&format=json`;
    return (await fetch(url)).json();
}

document.addEventListener("DOMContentLoaded", loadContent);
