const API_KEY = 'AIzaSyBO2sNoWRMt2fzF3d0kDia0g80EiYxTRwo'; // Replace with your API Key
const CHANNEL_ID = 'UCeMcOrOZxMIuxVc9vNsCKYQ'; // Replace with a valid YouTube Channel ID
const MAX_RESULTS = 240;

async function fetchVideos() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            return;
        }

        const videoContainer = document.getElementById("video-container");
        videoContainer.innerHTML = "";

        data.items.forEach(video => {
            const videoId = video.id.videoId;
            const videoTitle = video.snippet.title;
            const thumbnailUrl = video.snippet.thumbnails.high.url;

            const videoCard = document.createElement("div");
            videoCard.className = "card_style_two";

            videoCard.innerHTML = `
                <div class="image_outer_wrap">
                    <div class="image_wrap">
                        <img class="thumbnail" src="${thumbnailUrl}" alt="Thumbnail">
                    </div>
                    <div class="play_icon" onclick="playVideo(this, '${videoId}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#3BE477" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                        </svg>
                    </div>
                </div>
                <div class="name_wrap_one">
                    <h6>${videoTitle}</h6>
                </div>
                `;

            videoContainer.appendChild(videoCard);
        });

    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
    }
}

// Track currently playing video and its elements
let currentPlayingIframe = null;
let currentThumbnailContainer = null;
let currentPlayIcon = null;
let previousThumbnailSrc = null;

function playVideo(playIconElement, videoId) {
    const imageWrap = playIconElement.previousElementSibling; // Get .image_wrap
    const thumbnailImg = imageWrap.querySelector("img"); // Get the thumbnail image

    // If there's a video already playing and it's not the current one
    if (currentPlayingIframe && currentThumbnailContainer !== imageWrap) {
        // Reset the previous video
        currentThumbnailContainer.innerHTML = `<img class="thumbnail" src="${previousThumbnailSrc}" alt="Thumbnail">`;
        currentPlayIcon.style.display = "block";
        currentPlayingIframe = null;
        currentThumbnailContainer = null;
        currentPlayIcon = null;
        previousThumbnailSrc = null;
    }

    // If the clicked video is already playing, do nothing (or handle pause/replay if needed)
    if (imageWrap.querySelector("iframe")) {
        return;
    }

    // Store the current thumbnail source and container
    previousThumbnailSrc = thumbnailImg.src;
    currentThumbnailContainer = imageWrap;
    currentPlayIcon = playIconElement;

    // Create iframe HTML to embed the YouTube video
    const iframeHTML = `<iframe width="100%" height="200px" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

    // Replace the thumbnail with the iframe for the new video
    imageWrap.innerHTML = iframeHTML;
    currentPlayingIframe = imageWrap.querySelector("iframe");

    // Hide the play icon after the video starts
    playIconElement.style.display = "none";
}

// Initial fetch to display the videos
fetchVideos();