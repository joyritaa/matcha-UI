const next = document.getElementById('next');
const prev = document.getElementById('prev');
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel .item');
const countItem = items.length;

// State variables
let active = 0;
let other_1 = null;
let other_2 = null;
let autoPlay = null;
let isPaused = false;

// Add to cart functionality
const handleAddToCart = (product) => {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.textContent = `${product} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
};

// Add click handlers to all "Add to Cart" buttons
document.querySelectorAll('.addToCard').forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.closest('.item')
            .querySelector('h2').textContent;
        handleAddToCart(productName);
    });
});

// Next slide functionality
next.onclick = () => {
    changeSlide('next');
};

// Previous slide functionality
prev.onclick = () => {
    changeSlide('prev');
};

// Change slide function
const changeSlide = (direction) => {
    carousel.classList.remove(direction === 'next' ? 'prev' : 'next');
    carousel.classList.add(direction);

    if (direction === 'next') {
        active = active + 1 >= countItem ? 0 : active + 1;
        other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
        other_2 = active + 1 >= countItem ? 0 : active + 1;
    } else {
        active = active - 1 < 0 ? countItem - 1 : active - 1;
        other_1 = active + 1 >= countItem ? 0 : active + 1;
        other_2 = other_1 + 1 >= countItem ? 0 : other_1 + 1;
    }

    updateSlider();
};

// Update slider function
const updateSlider = () => {
    // Remove old classes
    document.querySelector('.carousel .item.active')?.classList.remove('active');
    document.querySelector('.carousel .item.other_1')?.classList.remove('other_1');
    document.querySelector('.carousel .item.other_2')?.classList.remove('other_2');

    // Reset animations
    items.forEach(item => {
        const img = item.querySelector('.image img');
        const caption = item.querySelector('.image figcaption');
        
        [img, caption].forEach(element => {
            element.style.animation = 'none';
            void element.offsetWidth; // Trigger reflow
            element.style.animation = '';
        });
    });

    // Add new classes
    items[active].classList.add('active');
    items[other_1].classList.add('other_1');
    items[other_2].classList.add('other_2');

    // Reset autoplay
    resetAutoPlay();
};

// Autoplay controls
const resetAutoPlay = () => {
    if (!isPaused) {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => changeSlide('next'), 5000);
    }
};

// Pause on hover
carousel.addEventListener('mouseenter', () => {
    isPaused = true;
    clearInterval(autoPlay);
});

// Resume on mouse leave
carousel.addEventListener('mouseleave', () => {
    isPaused = false;
    resetAutoPlay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide('prev');
    } else if (e.key === 'ArrowRight') {
        changeSlide('next');
    }
});

// Touch support
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide('next');
        } else {
            changeSlide('prev');
        }
    }
};

// Initialize autoplay
resetAutoPlay();