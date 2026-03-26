(function () {
    'use strict';


    /* ===========================================
       MODULE 1 — SCROLL REVEAL
       Intersection Observer triggers fade-up
       animation on .reveal and .reveal-stagger
       elements as they enter the viewport.
    =========================================== */

    var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {

        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });

    } else {
        /* Fallback for browsers without IntersectionObserver:
           show all elements immediately */
        revealElements.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }


    /* ===========================================
       MODULE 2 — GALLERY LIGHTBOX
       Opens a modal overlay with the clicked
       image, supports prev/next navigation,
       keyboard Escape to close, backdrop click
       to close, and basic focus trapping.
    =========================================== */

    var lightbox        = document.getElementById('lightbox');
    var lightboxImg     = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose   = document.getElementById('lightbox-close');
    var lightboxPrev    = document.getElementById('lightbox-prev');
    var lightboxNext    = document.getElementById('lightbox-next');
    var galleryTiles    = Array.from(
                              document.querySelectorAll('.gallery__tile')
                          );
    var currentIndex    = 0;

    function openLightbox(index) {
        var tile    = galleryTiles[index];
        var img     = tile.querySelector('img');
        var caption = tile.getAttribute('data-caption') || '';

        currentIndex = index;

        lightboxImg.src          = img ? img.src : '';
        lightboxImg.alt          = img ? img.alt : caption;
        lightboxCaption.textContent = caption;

        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';

        /* Focus the close button for keyboard accessibility */
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';

        /* Return focus to the tile that opened the lightbox */
        if (galleryTiles[currentIndex]) {
            galleryTiles[currentIndex].focus();
        }
    }

    function showPrev() {
        var prevIndex = (currentIndex - 1 + galleryTiles.length)
                        % galleryTiles.length;
        openLightbox(prevIndex);
    }

    function showNext() {
        var nextIndex = (currentIndex + 1) % galleryTiles.length;
        openLightbox(nextIndex);
    }

    /* Open lightbox when a gallery tile is clicked */
    galleryTiles.forEach(function (tile) {
        tile.addEventListener('click', function () {
            var index = parseInt(tile.getAttribute('data-index'), 10);
            openLightbox(index);
        });
    });

    /* Close button */
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    /* Prev / Next buttons */
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            showPrev();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function (e) {
            e.stopPropagation();
            showNext();
        });
    }

    /* Click on dark backdrop (outside image) closes lightbox */
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
        if (lightbox && lightbox.hasAttribute('hidden')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });


    /* ===========================================
       MODULE 3 — BACKGROUND MUSIC TOGGLE
       Audio loads muted/paused by default.
       Floating button toggles play/pause.
       Icon swaps between muted and playing state.
    =========================================== */

    var musicToggle  = document.getElementById('music-toggle');
    var bgMusic      = document.getElementById('bg-music');
    var iconOff      = musicToggle
                        ? musicToggle.querySelector('.music-toggle__icon--off')
                        : null;
    var iconOn       = musicToggle
                        ? musicToggle.querySelector('.music-toggle__icon--on')
                        : null;
    var isPlaying    = false;

    function setPlayingState(playing) {
        isPlaying = playing;

        if (playing) {
            bgMusic.play().catch(function () {
                /* Autoplay policy blocked — silently fail,
                   user must interact again */
                isPlaying = false;
                setPlayingState(false);
            });
            musicToggle.classList.add('is-playing');
            musicToggle.setAttribute('aria-pressed', 'true');
            musicToggle.setAttribute('aria-label', 'Pause background music');
            if (iconOff) iconOff.style.display = 'none';
            if (iconOn)  iconOn.style.display  = '';
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('is-playing');
            musicToggle.setAttribute('aria-pressed', 'false');
            musicToggle.setAttribute('aria-label', 'Play background music');
            if (iconOff) iconOff.style.display = '';
            if (iconOn)  iconOn.style.display  = 'none';
        }
    }

    if (musicToggle && bgMusic) {
        /* Ensure audio starts muted/paused */
        bgMusic.pause();
        bgMusic.volume = 0.55;

        musicToggle.addEventListener('click', function () {
            setPlayingState(!isPlaying);
        });
    }


    /* ===========================================
       MODULE 4 — HERO SMOOTH SCROLL CTA
       The "Scroll to details" button uses an
       anchor href already, but this ensures
       the offset accounts for any sticky bars.
    =========================================== */

    var heroCta = document.querySelector('.hero__cta');

    if (heroCta) {
        heroCta.addEventListener('click', function (e) {
            var targetId = heroCta.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block:    'start'
                    });
                }
            }
        });
    }


    /* ===========================================
       MODULE 5 — HERO CONTENT REVEAL ON LOAD
       The hero section content fades in on
       page load with a slight stagger, without
       waiting for scroll (it is already visible).
    =========================================== */

    var heroContent = document.querySelector('.hero__content');

    if (heroContent) {
        /* Short delay so fonts have time to load */
        setTimeout(function () {
            heroContent.style.transition =
                'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity   = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 180);

        /* Start hidden — JS will reveal */
        heroContent.style.opacity   = '0';
        heroContent.style.transform = 'translateY(24px)';
    }


    /* ===========================================
       MODULE 6 — FALLING LOTUS FLOWERS
       Dynamically creates lotus SVG elements
       inside .hero__particles and animates
       them falling from the top of the hero.
    =========================================== */

    var heroParticles = document.querySelector('.hero__particles');

    if (heroParticles) {

        var lotusCount = 18;

        /* Lotus SVG path — simplified 8-petal lotus shape */
        function createLotusSVG(size, color) {
            var svg = document.createElementNS(
                'http://www.w3.org/2000/svg', 'svg'
            );
            svg.setAttribute('width',   size);
            svg.setAttribute('height',  size);
            svg.setAttribute('viewBox', '0 0 40 40');
            svg.setAttribute('fill',    'none');

            /* Each petal is an ellipse rotated around center */
            var petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
            petalAngles.forEach(function (angle) {
                var ellipse = document.createElementNS(
                    'http://www.w3.org/2000/svg', 'ellipse'
                );
                ellipse.setAttribute('cx',        '20');
                ellipse.setAttribute('cy',        '12');
                ellipse.setAttribute('rx',        '4.5');
                ellipse.setAttribute('ry',        '10');
                ellipse.setAttribute('fill',       color);
                ellipse.setAttribute('fill-opacity', '0.72');
                ellipse.setAttribute(
                    'transform',
                    'rotate(' + angle + ' 20 20)'
                );
                svg.appendChild(ellipse);
            });

            /* Center circle */
            var center = document.createElementNS(
                'http://www.w3.org/2000/svg', 'circle'
            );
            center.setAttribute('cx',           '20');
            center.setAttribute('cy',           '20');
            center.setAttribute('r',            '4');
            center.setAttribute('fill',          color);
            center.setAttribute('fill-opacity', '0.9');
            svg.appendChild(center);

            return svg;
        }

        /* Alternate between soft gold and pale rose tones */
        var colors = [
            'rgba(200, 150, 30,  0.85)',
            'rgba(232, 184, 75,  0.80)',
            'rgba(210, 160, 90,  0.75)',
            'rgba(220, 130, 100, 0.70)'
        ];

        for (var i = 0; i < lotusCount; i++) {
            (function (index) {

                var wrapper = document.createElement('div');
                wrapper.classList.add('lotus-petal');

                var size  = Math.random() * 18 + 10;
                var color = colors[
                    Math.floor(Math.random() * colors.length)
                ];
                var leftPos  = Math.random() * 98;
                var duration = Math.random() * 10 + 10;
                var delay    = Math.random() * 16;

                wrapper.style.left             = leftPos + 'vw';
                wrapper.style.animationDuration = duration + 's';
                wrapper.style.animationDelay    = '-' + delay + 's';

                wrapper.appendChild(createLotusSVG(size, color));
                heroParticles.appendChild(wrapper);

            }(i));
        }
    }

}());