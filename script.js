// Function to load and display video content from JSON
async function loadContent() {
    // Fetch the content.json file and parse it as JSON
    const data = await fetch("content.json").then((res) => res.json());
    // Get the main content section from the DOM
    const contentSection = document.querySelector("#content");

    // Loop through each category and its videos in the JSON data
    for (const [category, videos] of Object.entries(data)) {
        // Create a section element for each category
        const section = document.createElement("section");
        // Set the section's HTML with category header and container using "row" class
        section.innerHTML = `
            <div class="row">
                <h2>${category}</h2>
                <div class="container column">
                    ${videos
                        .map(
                            (video) => `
                        <div class="card">
                            <div class="video-embed landscape"></div>
                            <div class="info-text"></div>
                        </div>
                    `,
                        )
                        .join("")}
                </div>
            </div>
        `;
        // Append the section to the content section as it's generated
        contentSection.appendChild(section);

        // Update each card with oEmbed data as soon as the section is added
        section.querySelectorAll(".card").forEach((card, index) => {
            // Fetch oEmbed data for the current video and update the card
            getVideoData(videos[index].id).then((data) => {
                card.querySelector(".video-embed").style.backgroundImage =
                    `url('${data.thumbnail_url}')`;
                card.querySelector(".info-text").innerHTML = `
                    <p><strong>${data.title}</strong></p>
                    <p>${data.author_name}</p>
                `;
            });
        });
    }
}

// Function to fetch YouTube oEmbed data for a specific video ID
async function getVideoData(videoId) {
    // Construct the oEmbed URL for the given video ID
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    // Fetch and return the JSON response from the oEmbed endpoint
    return (await fetch(url)).json();
}

// Start loading content when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadContent);
