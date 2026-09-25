/**
 * ===================================================================
 * SUMAN & ANKITA — 2ND LOVE ANNIVERSARY
 * Interactive Experience Scripts
 * Vanilla JavaScript (Zero External Dependencies)
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // 1. ANNIVERSARY START DATE CONFIGURATION (EASY TO EDIT)
  // =================================================================
  /**
   * Set the anniversary start date below.
   * Format: YYYY-MM-DDTHH:MM:SS
   */
  const anniversaryDate = new Date("2024-09-25T00:00:00");

  // =================================================================
  // 2. SMOOTH SCROLLING NAVIGATION
  // =================================================================
  const openStoryBtn = document.getElementById('open-story-btn');
  if (openStoryBtn) {
    openStoryBtn.addEventListener('click', () => {
      const storySection = document.getElementById('story');
      if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =================================================================
  // 3. CURSOR FOLLOWER GLOW (DESKTOP)
  // =================================================================
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
  }

  // =================================================================
  // 4. AMBIENT BACKGROUND CANVAS (FLOATING HEARTS & SPARKLES)
  // =================================================================
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    }, { passive: true });

    // Hearts & Stars particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 24 : 45;
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * (isMobile ? 12 : 18) + 8;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.45 + 0.15;
        this.fadeSpeed = Math.random() * 0.003 + 0.002;
        this.growing = Math.random() > 0.5;
        this.type = Math.random() > 0.4 ? 'heart' : 'sparkle';
        this.hue = Math.random() > 0.3 ? 340 : 45; // Pink-Rose or Gold
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rotation += this.rotationSpeed;

        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.6) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0.1) this.growing = true;
        }

        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

        if (this.type === 'heart') {
          ctx.fillStyle = `hsl(${this.hue}, 85%, 65%)`;
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          // Left curve
          ctx.bezierCurveTo(-this.size / 2, -topCurveHeight, -this.size, topCurveHeight, 0, this.size);
          // Right curve
          ctx.bezierCurveTo(this.size, topCurveHeight, this.size / 2, -topCurveHeight, 0, topCurveHeight);
          ctx.closePath();
          ctx.fill();
        } else {
          // Sparkle star
          ctx.fillStyle = `hsl(${this.hue}, 90%, 80%)`;
          ctx.beginPath();
          const r = this.size * 0.4;
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
            ctx.lineTo(
              Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3),
              Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3)
            );
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateAmbient = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateAmbient);
    };
    requestAnimationFrame(animateAmbient);
  }

  // =================================================================
  // 5. ROMANTIC MUSIC PLAYER & AMBIENT SYNTHESIZER FALLBACK
  // =================================================================
  const bgAudio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');
  const musicLabel = document.getElementById('music-label');
  const musicIcon = document.getElementById('music-icon');
  let isPlaying = false;
  let synthAudioCtx = null;
  let synthInterval = null;

  // Synthesizes a soothing, gentle romantic music-box arpeggio if mp3 is not present
  const startRomanticSynth = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!synthAudioCtx) {
        synthAudioCtx = new AudioContext();
      }
      if (synthAudioCtx.state === 'suspended') {
        synthAudioCtx.resume();
      }

      // Beautiful romantic chord notes: F#4, A#4, C#5, F5, G#4, C#5, D#5...
      const notes = [
        370.0, 466.16, 554.37, 698.46,
        415.3, 554.37, 622.25, 698.46,
        329.63, 440.0, 554.37, 659.25,
        293.66, 370.0, 440.0, 554.37
      ];
      let noteIndex = 0;

      const playTone = () => {
        if (!isPlaying || !synthAudioCtx) return;
        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], synthAudioCtx.currentTime);

        // Music-box bell envelope
        gain.gain.setValueAtTime(0.0001, synthAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, synthAudioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);

        osc.start();
        osc.stop(synthAudioCtx.currentTime + 1.3);

        noteIndex++;
      };

      playTone();
      synthInterval = setInterval(playTone, 480);
    } catch (e) {
      console.warn('Synth playback initialized smoothly.', e);
    }
  };

  const stopRomanticSynth = () => {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  };

  const setMusicPlayingState = (playing) => {
    isPlaying = playing;
    if (isPlaying) {
      musicBtn.classList.add('playing');
      musicIcon.textContent = '⏸';
      musicLabel.textContent = 'Pause Our Song';
    } else {
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicLabel.textContent = 'Play Our Song';
      stopRomanticSynth();
    }
  };

  if (musicBtn && bgAudio) {
    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setMusicPlayingState(true);
            })
            .catch(() => {
              // audio/our-song.mp3 might not be placed yet by user.
              // Gracefully activate synthesized ambient romantic chime melody!
              setMusicPlayingState(true);
              startRomanticSynth();
            });
        }
      } else {
        bgAudio.pause();
        setMusicPlayingState(false);
      }
    });

    bgAudio.addEventListener('ended', () => {
      setMusicPlayingState(false);
    });
  }

  // =================================================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // =================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // =================================================================
  // 7. MEMORY GALLERY & LIGHTBOX MODAL
  // =================================================================
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const imageModal = document.getElementById('image-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalImage = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');

  let currentGalleryIndex = 0;
  const galleryItems = [];

  polaroidCards.forEach((card, idx) => {
    const img = card.querySelector('img');
    const caption = card.getAttribute('data-caption') || img.alt;
    galleryItems.push({ src: img.src, alt: img.alt, caption: caption });

    card.addEventListener('click', () => {
      openModal(idx);
    });
  });

  const openModal = (index) => {
    if (!imageModal || !galleryItems[index]) return;
    currentGalleryIndex = index;
    const item = galleryItems[index];

    modalImage.src = item.src;
    modalImage.alt = item.alt;
    modalCaption.textContent = item.caption;

    imageModal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      imageModal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!imageModal) return;
    imageModal.classList.remove('active');
    setTimeout(() => {
      imageModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 350);
  };

  const navigateModal = (direction) => {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];
    modalImage.style.opacity = '0';
    setTimeout(() => {
      modalImage.src = item.src;
      modalImage.alt = item.alt;
      modalCaption.textContent = item.caption;
      modalImage.style.opacity = '1';
    }, 150);
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => navigateModal(-1));
  if (modalNextBtn) modalNextBtn.addEventListener('click', () => navigateModal(1));

  window.addEventListener('keydown', (e) => {
    if (imageModal && imageModal.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    }
  });

  // =================================================================
  // 8. LOVE LETTER (TYPEWRITER ANIMATION)
  // =================================================================
  const letterSection = document.getElementById('letter');
  const typewriterTarget = document.getElementById('typewriter-text');
  const typewriterCursor = document.getElementById('typewriter-cursor');
  const replayLetterBtn = document.getElementById('replay-letter-btn');
  const skipLetterBtn = document.getElementById('skip-letter-btn');

  const letterVerbatim = `Dear Ankita,

Two years ago, I didn't know how many beautiful memories we would create together.

Today, when I look back, I realize that it was never just about the big moments.

It was the little conversations.
The random laughs.
The silly fights.
The late-night talks.
The moments when we simply stayed together.

You became a beautiful part of my life, and I am grateful for every memory we have created.

I don't know what every tomorrow will look like, but I know one thing...

I want more memories with you.

More smiles.
More adventures.
More stupid jokes.
More moments that belong only to us.

Happy 2nd Love Anniversary, Ankita. ❤️

Thank you for being you.

Always,
Suman ❤️`;

  let typeInterval = null;
  let letterHasTyped = false;

  const startTypewriter = () => {
    if (!typewriterTarget) return;
    if (typeInterval) clearInterval(typeInterval);

    typewriterTarget.textContent = '';
    if (typewriterCursor) typewriterCursor.style.display = 'inline-block';

    let charIndex = 0;
    const speed = 25; // Milliseconds per char

    typeInterval = setInterval(() => {
      if (charIndex < letterVerbatim.length) {
        typewriterTarget.textContent += letterVerbatim.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        typeInterval = null;
        if (typewriterCursor) typewriterCursor.style.display = 'none';
      }
    }, speed);
  };

  const showFullLetter = () => {
    if (typeInterval) clearInterval(typeInterval);
    typewriterTarget.textContent = letterVerbatim;
    if (typewriterCursor) typewriterCursor.style.display = 'none';
  };

  if (replayLetterBtn) replayLetterBtn.addEventListener('click', startTypewriter);
  if (skipLetterBtn) skipLetterBtn.addEventListener('click', showFullLetter);

  if (letterSection) {
    const letterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !letterHasTyped) {
            letterHasTyped = true;
            startTypewriter();
          }
        });
      },
      { threshold: 0.25 }
    );
    letterObserver.observe(letterSection);
  }

  // =================================================================
  // 9. "WHY I LOVE YOU" INTERACTIVE REASONS
  // =================================================================
  const reasonsList = [
    {
      title: "Your Smile 😊",
      desc: "The kind of smile that instantly lights up my entire world, melts away every worry, and makes me fall in love all over again."
    },
    {
      title: "Your Kind Heart ❤️",
      desc: "The gentle empathy and warmth you show to everyone around you is pure magic. You make the world softer."
    },
    {
      title: "The Way You Make Me Laugh 😂",
      desc: "Even when we are being totally silly, you give me the happiest, most genuine belly laughs I could ever ask for."
    },
    {
      title: "Our Crazy Conversations 🥰",
      desc: "From deep late-night dreams to utterly nonsensical gossips, I never want our conversations to ever end."
    },
    {
      title: "Your Beautiful Soul ✨",
      desc: "Genuinely one of the purest, most caring, and most breathtaking human beings to ever exist."
    },
    {
      title: "Simply Because You're You ❤️",
      desc: "Without any pretense or filter—you are my favorite person in the entire universe, just the way you are."
    },
    {
      title: "How You Make Anywhere Feel Like Home 🏡",
      desc: "No matter where we go or what happens, as long as I am with you, I feel completely safe, understood, and at peace."
    },
    {
      title: "The Sparkle in Your Eyes 🌟",
      desc: "The way your eyes light up when you're excited about little things melts my heart every single time."
    }
  ];

  let currentReasonIndex = 0;
  const activeReasonCard = document.getElementById('active-reason-card');
  const reasonNumber = document.getElementById('reason-number');
  const reasonTitle = document.getElementById('reason-title');
  const reasonDescription = document.getElementById('reason-description');
  const nextReasonBtn = document.getElementById('next-reason-btn');
  const reasonsPillsRow = document.getElementById('reasons-pills-row');

  // Render clickable mini pill tabs
  if (reasonsPillsRow) {
    reasonsList.forEach((reason, idx) => {
      const pill = document.createElement('button');
      pill.className = `reason-pill ${idx === 0 ? 'active' : ''}`;
      pill.textContent = `#${idx + 1}`;
      pill.setAttribute('aria-label', `View ${reason.title}`);
      pill.addEventListener('click', () => {
        displayReason(idx);
      });
      reasonsPillsRow.appendChild(pill);
    });
  }

  const displayReason = (index) => {
    currentReasonIndex = index;
    if (!activeReasonCard) return;

    activeReasonCard.classList.add('animating');

    setTimeout(() => {
      const reason = reasonsList[currentReasonIndex];
      reasonNumber.textContent = `Reason #${currentReasonIndex + 1} of ${reasonsList.length}`;
      reasonTitle.textContent = reason.title;
      reasonDescription.textContent = reason.desc;

      // Update active pill
      if (reasonsPillsRow) {
        const pills = reasonsPillsRow.querySelectorAll('.reason-pill');
        pills.forEach((p, idx) => {
          p.classList.toggle('active', idx === currentReasonIndex);
        });
      }

      activeReasonCard.classList.remove('animating');
    }, 200);
  };

  if (nextReasonBtn) {
    nextReasonBtn.addEventListener('click', () => {
      const nextIdx = (currentReasonIndex + 1) % reasonsList.length;
      displayReason(nextIdx);
    });
  }

  // =================================================================
  // 10. LIVE RELATIONSHIP COUNTER
  // =================================================================
  const countYears = document.getElementById('count-years');
  const countMonths = document.getElementById('count-months');
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMinutes = document.getElementById('count-minutes');
  const countSeconds = document.getElementById('count-seconds');

  const updateCounter = () => {
    const now = new Date();
    let diff = now - anniversaryDate;

    if (diff < 0) {
      diff = 0;
    }

    // Accurate year & month breakdown
    let startYear = anniversaryDate.getFullYear();
    let startMonth = anniversaryDate.getMonth();
    let startDate = anniversaryDate.getDate();

    let curYear = now.getFullYear();
    let curMonth = now.getMonth();
    let curDate = now.getDate();

    let years = curYear - startYear;
    let months = curMonth - startMonth;
    let days = curDate - startDate;

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(curYear, curMonth, 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Exact remaining time of day
    let totalSeconds = Math.floor(diff / 1000);
    let hours = now.getHours() - anniversaryDate.getHours();
    let minutes = now.getMinutes() - anniversaryDate.getMinutes();
    let seconds = now.getSeconds() - anniversaryDate.getSeconds();

    if (seconds < 0) {
      minutes--;
      seconds += 60;
    }
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    if (hours < 0) {
      hours += 24;
    }

    if (countYears) countYears.textContent = years;
    if (countMonths) countMonths.textContent = months;
    if (countDays) countDays.textContent = days;
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, '0');
    if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, '0');
  };

  updateCounter();
  setInterval(updateCounter, 1000);

  // =================================================================
  // 11. CONFETTI & HEART FOUNTAIN CANVASES
  // =================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiWidth = confettiCanvas ? (confettiCanvas.width = window.innerWidth) : 0;
  let confettiHeight = confettiCanvas ? (confettiCanvas.height = window.innerHeight) : 0;
  let confettiParticles = [];
  let confettiRunning = false;

  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiWidth = confettiCanvas.width = window.innerWidth;
      confettiHeight = confettiCanvas.height = window.innerHeight;
    }
  }, { passive: true });

  class ConfettiPiece {
    constructor() {
      this.x = confettiWidth / 2 + (Math.random() - 0.5) * (confettiWidth * 0.5);
      this.y = confettiHeight * 0.45;
      this.size = Math.random() * 12 + 6;
      this.speedX = (Math.random() - 0.5) * 16;
      this.speedY = -(Math.random() * 15 + 8);
      this.gravity = 0.35;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      this.colors = ['#ff2a6d', '#ff7597', '#fbbf24', '#a855f7', '#ec4899', '#ffffff'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.isHeart = Math.random() > 0.4;
      this.opacity = 1;
      this.decay = Math.random() * 0.008 + 0.004;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.speedX *= 0.98;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      if (!confettiCtx || this.opacity <= 0) return;
      confettiCtx.save();
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate(this.rotation);
      confettiCtx.globalAlpha = Math.max(0, this.opacity);
      confettiCtx.fillStyle = this.color;

      if (this.isHeart) {
        // Confetti Heart
        const s = this.size;
        confettiCtx.beginPath();
        confettiCtx.moveTo(0, s * 0.3);
        confettiCtx.bezierCurveTo(-s / 2, -s * 0.3, -s, s * 0.3, 0, s);
        confettiCtx.bezierCurveTo(s, s * 0.3, s / 2, -s * 0.3, 0, s * 0.3);
        confettiCtx.closePath();
        confettiCtx.fill();
      } else {
        // Confetti Ribbon
        confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }
      confettiCtx.restore();
    }
  }

  const triggerConfettiFountain = (count = 120) => {
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiPiece());
    }

    if (!confettiRunning) {
      confettiRunning = true;
      const animateConfetti = () => {
        if (!confettiCtx) return;
        confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);

        for (let i = confettiParticles.length - 1; i >= 0; i--) {
          const p = confettiParticles[i];
          p.update();
          p.draw();
          if (p.opacity <= 0 || p.y > confettiHeight + 50) {
            confettiParticles.splice(i, 1);
          }
        }

        if (confettiParticles.length > 0) {
          requestAnimationFrame(animateConfetti);
        } else {
          confettiRunning = false;
          confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);
        }
      };
      requestAnimationFrame(animateConfetti);
    }
  };

  // =================================================================
  // 12. SECTION 7: A LITTLE QUESTION (YES & OF COURSE)
  // =================================================================
  const btnYes = document.getElementById('btn-yes');
  const btnOfCourse = document.getElementById('btn-of-course');
  const questionButtonsArea = document.getElementById('question-buttons-area');
  const questionResponse = document.getElementById('question-response');

  const handleRomanticProposalAccept = () => {
    triggerConfettiFountain(150);

    if (questionButtonsArea) {
      questionButtonsArea.style.opacity = '0.5';
      questionButtonsArea.style.pointerEvents = 'none';
    }

    if (questionResponse) {
      questionResponse.removeAttribute('hidden');
      questionResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (btnYes) btnYes.addEventListener('click', handleRomanticProposalAccept);
  if (btnOfCourse) btnOfCourse.addEventListener('click', handleRomanticProposalAccept);

  // =================================================================
  // 13. SECTION 8: SPECIAL SURPRISE CINEMATIC EXPERIENCE
  // =================================================================
  const surpriseTriggerBtn = document.getElementById('surprise-trigger-btn');
  const surpriseOverlay = document.getElementById('surprise-overlay');
  const surpriseCloseBtn = document.getElementById('surprise-close-btn');
  const surpriseCanvas = document.getElementById('surprise-canvas');
  let surpriseCtx = surpriseCanvas ? surpriseCanvas.getContext('2d') : null;
  let surpriseAnimId = null;
  let surpriseHearts = [];

  const initSurpriseCanvas = () => {
    if (!surpriseCanvas || !surpriseCtx) return;
    surpriseCanvas.width = window.innerWidth;
    surpriseCanvas.height = window.innerHeight;
    surpriseHearts = [];

    for (let i = 0; i < 50; i++) {
      surpriseHearts.push({
        x: Math.random() * surpriseCanvas.width,
        y: Math.random() * surpriseCanvas.height,
        size: Math.random() * 22 + 10,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.4 ? 340 : 45
      });
    }

    const animateSurpriseHearts = () => {
      surpriseCtx.clearRect(0, 0, surpriseCanvas.width, surpriseCanvas.height);

      for (let i = 0; i < surpriseHearts.length; i++) {
        const h = surpriseHearts[i];
        h.y -= h.speedY;
        h.x += h.speedX;
        if (h.y < -30) {
          h.y = surpriseCanvas.height + 20;
          h.x = Math.random() * surpriseCanvas.width;
        }

        surpriseCtx.save();
        surpriseCtx.translate(h.x, h.y);
        surpriseCtx.globalAlpha = h.opacity;
        surpriseCtx.fillStyle = `hsl(${h.hue}, 90%, 65%)`;
        surpriseCtx.beginPath();
        const s = h.size;
        surpriseCtx.moveTo(0, s * 0.3);
        surpriseCtx.bezierCurveTo(-s / 2, -s * 0.3, -s, s * 0.3, 0, s);
        surpriseCtx.bezierCurveTo(s, s * 0.3, s / 2, -s * 0.3, 0, s * 0.3);
        surpriseCtx.closePath();
        surpriseCtx.fill();
        surpriseCtx.restore();
      }

      surpriseAnimId = requestAnimationFrame(animateSurpriseHearts);
    };

    if (surpriseAnimId) cancelAnimationFrame(surpriseAnimId);
    surpriseAnimId = requestAnimationFrame(animateSurpriseHearts);
  };

  const openSurpriseExperience = () => {
    if (!surpriseOverlay) return;
    surpriseOverlay.removeAttribute('hidden');
    requestAnimationFrame(() => {
      surpriseOverlay.classList.add('active');
    });
    document.body.style.overflow = 'hidden';

    initSurpriseCanvas();
    triggerConfettiFountain(120);

    // Staggered reveals for the 4 cinematic lines
    const steps = [
      document.getElementById('cinema-step-1'),
      document.getElementById('cinema-step-2'),
      document.getElementById('cinema-step-3'),
      document.getElementById('cinema-step-4')
    ];

    steps.forEach((step) => {
      if (step) step.classList.remove('visible');
    });

    setTimeout(() => { if (steps[0]) steps[0].classList.add('visible'); }, 600);
    setTimeout(() => { if (steps[1]) steps[1].classList.add('visible'); }, 2000);
    setTimeout(() => { if (steps[2]) steps[2].classList.add('visible'); }, 3500);
    setTimeout(() => { if (steps[3]) steps[3].classList.add('visible'); }, 5000);
  };

  const closeSurpriseExperience = () => {
    if (!surpriseOverlay) return;
    surpriseOverlay.classList.remove('active');
    if (surpriseAnimId) {
      cancelAnimationFrame(surpriseAnimId);
      surpriseAnimId = null;
    }
    setTimeout(() => {
      surpriseOverlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 800);
  };

  if (surpriseTriggerBtn) surpriseTriggerBtn.addEventListener('click', openSurpriseExperience);
  if (surpriseCloseBtn) surpriseCloseBtn.addEventListener('click', closeSurpriseExperience);

});
