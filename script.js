const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

const burgerMenu = document.getElementById('burgerMenu');
const menuPopup = document.getElementById('menuPopup');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const colorSchemePicker = document.getElementById('colorSchemePicker');

// Toggle menu open/close with animation
burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    menuPopup.classList.toggle('show');
});

// Optional: Keyboard accessibility (Enter/Space)
burgerMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        burgerMenu.click();
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!burgerMenu.contains(e.target) && !menuPopup.contains(e.target)) {
        burgerMenu.classList.remove('active');
        menuPopup.classList.remove('show');
    }
});

// Theme toggle
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    burgerMenu.classList.remove('active');
    menuPopup.classList.remove('show');
});

colorSchemePicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent', e.target.value);
    // Optionally, set a darker shade for hover
    document.documentElement.style.setProperty('--accent-dark', shadeColor(e.target.value, -15));
});

// Helper to darken color
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    let RR = ((R.toString(16).length==1)?"0":"") + R.toString(16);
    let GG = ((G.toString(16).length==1)?"0":"") + G.toString(16);
    let BB = ((B.toString(16).length==1)?"0":"") + B.toString(16);

    return "#"+RR+GG+BB;
}
