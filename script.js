// Portfolio class handles page setup and UI effects
class Portfolio {
    constructor() {
        this.init();
    }
    init() {
        this.setupLoading();          // Handles the initial loading spinner
        this.setupSocialLinks();      // Makes social buttons open links
        this.setupScrollAnimations(); // Animates sections on scroll
        this.setupProjectCards();     // Adds hover effect to project cards
    }
    setupLoading() {
        // Hide loading spinner after page load
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => loading.remove(), 500);
            }, 1000);
        });
    }
    setupSocialLinks() {
        // Make social buttons open their links in a new tab
        const socialBtns = document.querySelectorAll('.social-btn[data-link]');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(btn.dataset.link, '_blank', 'noopener,noreferrer');
            });
        });
    }
    setupScrollAnimations() {
        // Fade-in animation for sections as they enter the viewport
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
    setupProjectCards() {
        // Adds a hover effect to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize Portfolio class on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fetch and update Discord card with live data
async function updateDiscordCard() {
    const card = document.querySelector('.status-card');
    card.classList.add('loading'); // Show loading effect

    // Your Discord user ID
    const userId = "732209394871173192";
    // Fetch live Discord data from Lanyard API
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const data = await res.json();
    if (!data.success) {
        card.classList.remove('loading');
        return;
    }

    // Extract user info and status
    const user = data.data.discord_user;
    const status = data.data.discord_status;
    // Use Discord avatar if available, fallback to local image
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : "./pictures/pfp.jpg";
    // Display name (global_name) is the new Discord display name
    const displayName = user.global_name;
    // Custom status (if set)
    const customStatus = data.data.activities.find(a => a.type === 4)?.state || "";

    // Check for game activity (type 0 is 'Playing')
    const gameActivity = data.data.activities.find(a => a.type === 0);
    const gameName = gameActivity ? gameActivity.name : "";


    // Update card with live data
    document.querySelector(".discord-name").textContent = displayName || "";
    document.querySelector('.status-avatar').src = avatarUrl;
    document.querySelector('.status-info p').textContent =
        customStatus || gameName || (status.charAt(0).toUpperCase() + status.slice(1));

    const gameEl = document.querySelector('.discord-game');
    if (gameName) {
        gameEl.textContent = `Playing: ${gameName}`;
        gameEl.style.display = 'block';
    } else {
        gameEl.style.display = 'none';
    }


    // Set Discord icon color based on status
    const icon = document.querySelector('.discord-icon');
    let color = "#808080"; // Gray for offline
    if (status === "online") color = "#23a55a";
    else if (status === "idle") color = "#faa61a";
    else if (status === "dnd") color = "#ed4245";
    icon.style.color = color;

    // Place the status dot on the avatar (bottom right, slightly hanging)
    let dot = document.querySelector('.discord-status-dot');
    if (!dot) {
        dot = document.createElement('span');
        dot.className = 'discord-status-dot';
        // Append dot inside the avatar wrapper
        document.querySelector('.status-avatar-wrapper').appendChild(dot);
    }
    dot.style.background = color;

    
    // Spotify Presence (if listening)
    const spotify = data.data.listening_to_spotify ? data.data.spotify : null;
    const spotifyContainer = document.querySelector('.spotify-info');
    if (spotify) {
        document.querySelector('.spotify-album-art').src = spotify.album_art_url;
        document.querySelector('.spotify-song').textContent = spotify.song;
        document.querySelector('.spotify-artist').textContent = spotify.artist;
        spotifyContainer.style.display = "flex";
    } else {
        spotifyContainer.style.display = "none";
    }
card.classList.remove('loading'); // Hide loading effect
}

// Run Discord card update after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateDiscordCard();
    setInterval(updateDiscordCard, 10000);
});