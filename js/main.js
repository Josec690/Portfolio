'use strict';

// MODO DARK/LIGHT

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    this.apply(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    this.apply(next);
    localStorage.setItem('portfolio-theme', next);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
};

// MENU HAMBURGER 

const NavManager = {
  init() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
};

// HEADER SCROLL EFFECT

const HeaderManager = {
  init() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }
};

// SCROLL REVEAL (IntersectionObserver)

const RevealManager = {
  init() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate language bars
            const bar = entry.target.querySelector('.lang-bar');
            if (bar) {
              setTimeout(() => {
                bar.style.width = bar.dataset.width;
              }, 200);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }
};

// SCROLL TO TOP

const ScrollTopManager = {
  init() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// SMOOTH SCROLL NAVIGATION

const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
};

// CAROUSEL

const CarouselManager = {
  instances: new Map(),

  init() {
    document.querySelectorAll('.carousel').forEach(el => {
      this.setup(el);
    });
  },

  setup(el) {
    const track = el.querySelector('.carousel-track');
    const slides = el.querySelectorAll('.carousel-slide');
    const prevBtn = el.querySelector('.carousel-btn.prev');
    const nextBtn = el.querySelector('.carousel-btn.next');
    const dotsContainer = el.querySelector('.carousel-dots');

    if (!track || slides.length === 0) return;

    let current = 0;
    let autoTimer;

    const dots = [];
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer?.appendChild(dot);
      dots.push(dot);
    });

    const updateDots = (idx) => {
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    const goTo = (idx) => {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots(current);
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    };

    const resetAuto = () => {
      clearInterval(autoTimer);
      startAuto();
    };

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });

    startAuto();
  }
};

// COPY TO CLIPBOARD

const ClipboardManager = {
  init() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = '✓ Copiado!';
          btn.style.color = 'var(--accent)';
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.color = '';
          }, 2000);
        } catch {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      });
    });
  }
};

// CONTACT FORM (fetch + fallback)

const FormManager = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const success = document.querySelector('.form-success');
      const originalBtnText = btn?.textContent || 'Enviar Mensagem';

      if (btn) {
        btn.textContent = 'Enviando...';
        btn.disabled = true;
      }

      if (success) {
        success.style.display = 'none';
        success.innerHTML = '';
      }

      const data = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        message: form.querySelector('[name="message"]').value
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/joseclaudiley@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            ...data,
            _subject: 'Nova mensagem do portfólio',
            _captcha: 'false'
          })
        });

        if (!response.ok) {
          throw new Error('Falha no envio');
        }

        form.style.display = 'none';
        if (success) {
          success.style.display = 'block';
          success.innerHTML = '✅ Mensagem enviada! Entrarei em contato em breve.';
        }
      } catch {
        if (success) {
          success.style.display = 'block';
          success.innerHTML = '❌ Não foi possível enviar agora. Tente novamente em instantes.';
        }
      } finally {
        if (btn) {
          btn.textContent = originalBtnText;
          btn.disabled = false;
        }
      }
    });
  }
};

// TYPING EFFECT

const TypingEffect = {
  init() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const texts = el.dataset.texts?.split('|') || [];
    if (!texts.length) return;

    let textIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const type = () => {
      const current = texts[textIdx];

      if (deleting) {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = deleting ? 50 : 100;

      if (!deleting && charIdx === current.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
        speed = 500;
      }

      setTimeout(type, speed);
    };

    type();
  }
};

// LANGUAGE BARS ANIMATION

const LangBarsManager = {
  init() {
    // Bars animated via IntersectionObserver in RevealManager
    document.querySelectorAll('.lang-bar').forEach(bar => {
      // Store target width in dataset, start at 0
      if (!bar.dataset.width) {
        bar.dataset.width = bar.style.width || '0%';
      }
      bar.style.width = '0';
    });
  }
};

// BACK BUTTON 

const BackManager = {
  init() {
    document.querySelectorAll('.back-btn').forEach(btn => {
      if (btn.tagName !== 'A') {
        btn.addEventListener('click', () => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = 'index.html';
          }
        });
      }
    });
  }
};

// ACTIVE NAV HIGHLIGHT

const ActiveNav = {
  init() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }
};

// INIT ALL

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  HeaderManager.init();
  RevealManager.init();
  ScrollTopManager.init();
  SmoothScroll.init();
  CarouselManager.init();
  ClipboardManager.init();
  FormManager.init();
  TypingEffect.init();
  LangBarsManager.init();
  BackManager.init();
  ActiveNav.init();
});
