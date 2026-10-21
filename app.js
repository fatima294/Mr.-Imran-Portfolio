/* ============================================================================
   Mr. Imran Bashir (PMS) - Portfolio Controller (app.js)
   Integrates ScrollCraft runtime and bespoke interactive modules
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mount ScrollCraft runtime if available
  if (typeof ScrollCraft !== 'undefined') {
    try {
      ScrollCraft.mount(document.body);
      console.log('ScrollCraft mounted successfully.');
    } catch (e) {
      console.warn('ScrollCraft mount error:', e);
    }
  }

  // 2. Navigation Scroll Observer
  const nav = document.querySelector('.civic-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Mobile Navigation Toggle & Drawer Lock
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  if (mobileToggle && mobileOverlay) {
    const toggleMenu = (open) => {
      const shouldOpen = typeof open === 'boolean' ? open : !mobileOverlay.classList.contains('is-open');
      if (shouldOpen) {
        mobileOverlay.classList.add('is-open');
        mobileOverlay.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        mobileOverlay.classList.remove('is-open');
        mobileOverlay.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // 4. Dual-Perspective Milestone Explorer (Signature Move)
  const tabButtons = document.querySelectorAll('.explorer-tab-btn');
  const governanceTrack = document.getElementById('governance-track');
  const scholarshipTrack = document.getElementById('scholarship-track');
  const explorerGrid = document.querySelector('.explorer-dual-grid');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.getAttribute('data-view');
      if (view === 'all') {
        if (explorerGrid) explorerGrid.classList.remove('single-view');
        governanceTrack.style.display = 'block';
        scholarshipTrack.style.display = 'block';
        governanceTrack.style.gridColumn = '';
        scholarshipTrack.style.gridColumn = '';
        requestAnimationFrame(() => {
          governanceTrack.style.opacity = '1';
          scholarshipTrack.style.opacity = '1';
        });
      } else if (view === 'governance') {
        if (explorerGrid) explorerGrid.classList.add('single-view');
        scholarshipTrack.style.display = 'none';
        governanceTrack.style.display = 'block';
        governanceTrack.style.gridColumn = '1 / -1';
        requestAnimationFrame(() => {
          governanceTrack.style.opacity = '1';
        });
      } else if (view === 'scholarship') {
        if (explorerGrid) explorerGrid.classList.add('single-view');
        governanceTrack.style.display = 'none';
        scholarshipTrack.style.display = 'block';
        scholarshipTrack.style.gridColumn = '1 / -1';
        requestAnimationFrame(() => {
          scholarshipTrack.style.opacity = '1';
        });
      }
    });
  });

  // 5. Click-to-Copy for Secretariat Contact & Toast Alert
  const copyTriggers = document.querySelectorAll('[data-copy]');
  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = trigger.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Contact: ${textToCopy}`);
      });
    });
  });

  function showToast(message) {
    let toast = document.querySelector('.civic-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'civic-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #0e1522;
        color: #f7e2a9;
        border: 1px solid rgba(207, 171, 91, 0.5);
        padding: 12px 22px;
        border-radius: 30px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.88rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 3200);
  }

  // 6. Active nav section link spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
