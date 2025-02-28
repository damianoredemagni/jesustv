<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Video Player</title>
        <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
        <div class="wrapper">
            <section class="video-container">
                <div class="video-embed" id="video-embed">
                    <iframe
                        id="video-player"
                        src=""
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
            </section>
        </div>
        <script>
            // Get the video ID from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const videoIdParam = urlParams.get('id');
            const iframe = document.getElementById('video-player');
            const videoEmbed = document.getElementById('video-embed');

            if (videoIdParam) {
                // Check if it's a Short (contains "shorts/")
                const isShort = videoIdParam.includes('shorts/');
                const videoId = isShort ? videoIdParam.split('shorts/')[1] : videoIdParam;

                // Set iframe source with autoplay
                iframe.src = `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&autoplay=1`;

                // Dynamically set class based on aspect ratio
                videoEmbed.classList.remove('landscape', 'portrait');
                if (isShort) {
                    videoEmbed.classList.add('portrait');
                } else {
                    videoEmbed.classList.add('landscape');
                }
            } else {
                console.error('No video ID provided in URL');
            }
        </script>
    </body>
</html>
