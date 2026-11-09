// 사이드메뉴
const menu = document.querySelector('.floating-nav');
const menuButton = document.querySelector('.nav-toggle');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));

const navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('pointermove', (event) => {
  const rect = navToggle.getBoundingClientRect();

  navToggle.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
  navToggle.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
});

navToggle.addEventListener('pointerleave', () => {
  navToggle.style.removeProperty('--mouse-x');
  navToggle.style.removeProperty('--mouse-y');
});

const navCandyFiles = [
  'w_candies4.svg',
  'w_candies5.svg',
  'w_candy.svg',
  'w_cylindrical_candies.svg',
  'w_cylindrical_candy.svg',
  'w_candies1.svg',
  'w_candies2.svg',
  'w_candies3.svg'
];

document.querySelectorAll('.nav-links a').forEach(link => {
  const label = document.createElement('span');
  label.className = 'nav-link-label';
  label.textContent = link.textContent.trim();
  link.replaceChildren(label);

  function showCandies() {
    if (link.querySelector('.nav-candy')) return;

    link.style.setProperty(
      '--label-half',
      `${label.getBoundingClientRect().width / 2}px`
    );

    ['left', 'right'].forEach(side => {
      const candy = document.createElement('img');
      const file = navCandyFiles[
        Math.floor(Math.random() * navCandyFiles.length)
      ];

      candy.src = `images/${file}`;
      candy.alt = '';
      candy.setAttribute('aria-hidden', 'true');
      candy.className = `nav-candy ${side}`;
      candy.style.setProperty(
        '--sway-duration',
        `${1.1 + Math.random() * 0.8}s`
      );

      link.appendChild(candy);
    });
  }

  function hideCandies() {
    link.querySelectorAll('.nav-candy').forEach(candy => {
      candy.style.opacity = '0';
      setTimeout(() => candy.remove(), 180);
    });
  }

  link.addEventListener('pointerenter', showCandies);
  link.addEventListener('pointerleave', hideCandies);
  link.addEventListener('focus', showCandies);
  link.addEventListener('blur', hideCandies);
});

// 배너
const bannerSlides = [...document.querySelectorAll('.banner-slide')];
const pagination = document.querySelector('.pagination');
let bannerIndex = 0;
let bannerTimer = null;

const dots = bannerSlides.map((_, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `배너 ${index + 1}`);
  button.addEventListener('click', () => {
    showBanner(index);
  });
  pagination.append(button);
  return button;
});

function showBanner(index) {
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerSlides.forEach(slide => {
    const v = slide.querySelector('video');
    if (v) v.onended = null;
  });

  bannerIndex = index;

  bannerSlides.forEach((slide, i) => {
    const isActive = i === index;
    slide.classList.toggle('active', isActive);

    const video = slide.querySelector('video');
    if (video) {
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(e => console.log("자동재생 방지 정책 등으로 재생 실패:", e));
      } else {
        video.pause();
      }
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.setAttribute('aria-current', i === index ? 'true' : 'false');
  });

  startBannerTimer();
}

function startBannerTimer() {
  const currentSlide = bannerSlides[bannerIndex];
  const video = currentSlide.querySelector('video');

  if (video) {
    video.onended = () => {
      if (bannerTimer) clearTimeout(bannerTimer);
      nextBanner();
    };

    const checkVideoDuration = () => {
      const duration = video.duration ? video.duration * 1000 : 6000;
      bannerTimer = setTimeout(() => {
        nextBanner();
      }, duration + 500);
    };

    if (video.readyState >= 1) {
      checkVideoDuration();
    } else {
      video.onloadedmetadata = checkVideoDuration;
    }

  } else {
    bannerTimer = setTimeout(() => {
      nextBanner();
    }, 4500);
  }
}

function nextBanner() {
  const nextIndex = (bannerIndex + 1) % bannerSlides.length;
  showBanner(nextIndex);
}

// 최초 실행
showBanner(0);

// 편지 스크롤
// Keep the letter section stationary while the 1620px sheet scrolls through it.
const letterSection = document.querySelector('.letter-section');
const paper = document.querySelector('.letter-paper');
let paperY = 0;
let maxPaperRise = 0;
function measureLetterScroll() {
  maxPaperRise = Math.max(0, paper.offsetHeight - letterSection.clientHeight);
  paperY = Math.max(-maxPaperRise, Math.min(0, paperY));
  paper.style.setProperty('--paper-y', `${paperY}px`);
}
function isLetterSnapped() {
  const top = letterSection.getBoundingClientRect().top;
  return top >= -40 && top <= 40;
}
paper.querySelector('img').addEventListener('load', measureLetterScroll);
window.addEventListener('resize', measureLetterScroll);
measureLetterScroll();
window.addEventListener('wheel', event => {
  if (!isLetterSnapped() || event.deltaY === 0) return;
  const amount = event.deltaY * 0.55;
  if (amount > 0) {
    if (paperY <= -maxPaperRise) return;
    event.preventDefault();
    paperY = Math.max(-maxPaperRise, paperY - amount);
  } else {
    if (paperY >= 0) return;
    event.preventDefault();
    paperY = Math.min(0, paperY - amount);
  }
  paper.style.setProperty('--paper-y', `${paperY}px`);
}, { passive: false });
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
});

// 제품
const track = document.querySelector('.product-track');
const originalCards = [...track.querySelectorAll('.product')];

originalCards.forEach(card => {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
});

// 매장
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.typed) return;
    entry.target.dataset.typed = 'true';
    entry.target.classList.add('typed');
    const heading = entry.target.querySelector('h2');
    let count = 0;
    const typeElement = element => {
      const wrapTextNodes = parent => {
        [...parent.childNodes].forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.replace(/^\s+|\s+$/g, '');
            if (!text) {
              node.remove();
              return;
            }
            const fragment = document.createDocumentFragment();
            for (const character of text) {
              const span = document.createElement('span');
              span.className = 'type-char';
              span.textContent = character;
              span.style.animationDelay = `${count++ * 28}ms`;
              fragment.append(span);
            }
            node.replaceWith(fragment);
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
            wrapTextNodes(node);
          }
        });
      };
      wrapTextNodes(element);
    };
    typeElement(heading);
    const copy = entry.target.querySelector('p');
    if (copy) typeElement(copy);
  });
}, { threshold: .35 });
document.querySelectorAll('.store-copy').forEach(card => titleObserver.observe(card));

// 이벤트
{
  const cards = [...document.querySelectorAll('.event-card')];
  const list = document.querySelector('.event-list');
  let activeCard = null;

  function activate(card) {
    activeCard = card;
    list.classList.toggle('has-active', card !== null);

    cards.forEach((item) => {
      const active = item === card;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-expanded', String(active));
    });
  }

  let lastX = null;
  let lastY = null;

  list.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;

    const moved = event.clientX !== lastX || event.clientY !== lastY;
    lastX = event.clientX;
    lastY = event.clientY;

    if (!moved) return;

    const card = event.target.closest('.event-card');
    if (card && card !== activeCard) activate(card);
  });

  list.addEventListener('pointerleave', () => activate(null));

  list.addEventListener('focusin', (event) => {
    const card = event.target.closest('.event-card');
    if (card) activate(card);
  });

  list.addEventListener('focusout', (event) => {
    if (!list.contains(event.relatedTarget)) activate(null);
  });
}

// 호박
(() => {
  const stage = document.querySelector('#stage');
  const pumpkin = stage.querySelector('.pumpkin_image');

  const candyImages = [
    'images/candies1.svg', 'images/candies2.svg', 'images/candies3.svg',
    'images/candies4.svg', 'images/candies5.svg', 'images/candy.svg',
    'images/cylindrical_candies.svg', 'images/cylindrical_candy.svg'
  ];

  let pouring = true;
  let timer = window.setInterval(pourCandy, 220);

  function makeCandy() {
    const candy = document.createElement('img');
    candy.className = 'candy';
    candy.src = candyImages[Math.floor(Math.random() * candyImages.length)];
    candy.alt = '';
    candy.setAttribute('aria-hidden', 'true');
    candy.style.width = `${32 + Math.random() * 30}px`;
    stage.appendChild(candy);
    return candy;
  }

  function pourCandy(burst = false) {
    if (!pouring && !burst) return;

    const bounds = stage.getBoundingClientRect();
    const pumpkinBounds = pumpkin.getBoundingClientRect();

    const startX = pumpkinBounds.left - bounds.left + pumpkinBounds.width * 0.25;
    const startY = pumpkinBounds.top - bounds.top + pumpkinBounds.height * 0.75;

    // 도착 지점
    const endX = Math.max(28, startX - (80 + Math.random() * bounds.width * 0.48));
    const endY = bounds.height * (0.64 + Math.random() * 0.18);

    const dx = endX - startX;
    const dy = endY - startY;
    const arcHeight = 50 + Math.random() * 70;
    const drift = (Math.random() - 0.5) * bounds.width * 0.08;

    const candy = makeCandy();
    candy.style.left = `${startX}px`;
    candy.style.top = `${startY}px`;

    const frames = [];
    const count = 24;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const inv = 1 - t;

      // 원호
      const curveX =
        3 * inv * inv * t * (dx * 0.35) +
        3 * inv * t * t * (dx * 0.82 + drift) +
        t * t * t * dx;

      const curveY =
        3 * inv * inv * t * (-arcHeight) +
        3 * inv * t * t * (dy + arcHeight * 0.25) +
        t * t * t * dy;

      frames.push({
        offset: t * 0.9,
        transform: `translate(${curveX}px, ${curveY}px) rotate(${(1 - t) * 22}deg)`
      });
    }

    frames.push({
      offset: 1,
      transform: `translate(${dx}px, ${dy}px) rotate(0deg)`,
      opacity: 1
    });

    const animation = candy.animate(frames, {
      duration: burst ? 1500 + Math.random() * 700 : 2900 + Math.random() * 600,
      easing: 'ease-out',
      fill: 'forwards'
    });

    animation.onfinish = () => {
      candy.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 1200,
          delay: 100,
          easing: 'ease',
          fill: 'forwards'
        }
      ).onfinish = () => candy.remove();
    };
  }

  function startPouring() {
    pouring = true;

    if (timer === null) {
      pourCandy();
      timer = window.setInterval(pourCandy, 220);
    }
  }

  function stopPouring() {
    pouring = false;

    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function burstAndStop() {
    stopPouring();

    for (let i = 0; i < 24; i++) {
      window.setTimeout(() => pourCandy(true), i * 35);
    }
  }

  function handlePumpkinClick() {
    if (pouring) {
      burstAndStop();
    } else {
      startPouring();
    }
  }

  pumpkin.addEventListener('click', handlePumpkinClick);

  const trigger = document.querySelector('.tot_trigger');
  const totClick = document.querySelector('.tot_click');

  trigger.addEventListener('click', () => {
    if (totClick.classList.contains('tot_out')) return;

    totClick.classList.add('tot_out');

    setTimeout(() => {
      totClick.classList.remove('tot_out');
    }, 5000);
  });
})();

// 푸터
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer");
  const img1 = document.getElementById("footer-img-1");
  const img2 = document.getElementById("footer-img-2");

  img1.classList.add("active");

  const delayTime = 2000;
  let hasTriggered = false;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTriggered) {
        hasTriggered = true;

        setTimeout(() => {
          img1.classList.remove("active");
          img2.classList.add("active");
        }, delayTime);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(footer);
});

// 마우스
const canvas = document.getElementById('MouseCanvas');
const ctx = canvas.getContext('2d');
const landingSpot = document.getElementById('landingSpot');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

let isLanded = false;

class Tinkerbell {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.vx = 5; // 초기 속도를 주어 멈춰있지 않고 움직이게 함
    this.vy = -5;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    if (isLanded) {
      const dx = this.fixedX - this.x;
      const dy = this.fixedY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1) {
        this.x = this.fixedX;
        this.y = this.fixedY;
        this.vx = 0;
        this.vy = 0;
        return;
      }

      this.vx += dx * 0.003;
      this.vy += dy * 0.003;
      this.vx *= 0.92;
      this.vy *= 0.92;
    } else {
      // 마우스 추적 움직임
      this.angle += 0.02;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const ax = dx * 0.004 + Math.cos(this.angle) * 0.2;
      const ay = dy * 0.004 + Math.sin(this.angle) * 0.2;
      this.vx += ax;
      this.vy += ay;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    const renderY = isLanded ? this.y - window.scrollY : this.y;
    ctx.arc(this.x, renderY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#f4f4e6';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#defefd';
    ctx.fill();
    ctx.restore();
  }

  lockPosition(rect) {
    const spotCenterX = rect.left + rect.width / 2 + window.scrollX;
    const spotCenterY = rect.top + rect.height / 2 + window.scrollY;
    this.x += window.scrollX;
    this.y += window.scrollY;
    this.fixedX = spotCenterX;
    this.fixedY = spotCenterY;
  }
}

const tinker = new Tinkerbell();

window.addEventListener('scroll', () => {
  if (isLanded) return;

  const rect = landingSpot.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    isLanded = true;
    tinker.lockPosition(rect);
  }
});

function animate() {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  tinker.update();
  tinker.draw();
  requestAnimationFrame(animate);
}
animate();