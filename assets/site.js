(function () {
  const config = Object.assign({
    demoUrl: '',
    repositoryUrl: '',
    releasesUrl: ''
  }, window.SITE_CONFIG || {});

  document.querySelectorAll('[data-config-link]').forEach((link) => {
    const key = link.getAttribute('data-config-link');
    const value = config[key];
    if (value) {
      link.setAttribute('href', value);
      if (/^https?:\/\//i.test(value)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noreferrer');
      }
      return;
    }
    link.classList.add('is-disabled');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => event.preventDefault());
  });

  document.querySelectorAll('[data-config-status]').forEach((node) => {
    const key = node.getAttribute('data-config-status');
    if (key === 'demo' && config.demoUrl) {
      node.textContent = '离线 Demo 已就绪（固定模拟数据），可直接体验；真实分析需在本机运行';
    }
    if (key === 'demo-detail' && config.demoUrl) {
      node.textContent = '离线 Demo 使用固定模拟数据，适合快速浏览从选点到报告的完整流程。在线不提供真实分析工作台，需要时请在本机配置并运行。';
    }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const sideNav = document.querySelector('.side-nav');
  if (sideNav) {
    const marker = sideNav.querySelector('.side-nav-marker');
    const progress = sideNav.querySelector('.side-nav-progress');
    const navLabels = sideNav.querySelectorAll('.side-nav-labels li');
    const navHeight = sideNav.offsetHeight;
    const pathLength = progress.getTotalLength();
    const scaleY = navHeight / 600;
    progress.style.strokeDasharray = pathLength;
    progress.style.strokeDashoffset = pathLength;

    let isDragging = false;

    const sectionMap = [
      { el: document.getElementById('main-content'), label: navLabels[0] },
      { el: document.getElementById('capabilities'), label: navLabels[1] },
      { el: document.getElementById('screenshots'), label: navLabels[2] },
      { el: document.getElementById('method'), label: navLabels[3] },
      { el: document.getElementById('trust'), label: navLabels[4] },
      { el: document.getElementById('roadmap'), label: navLabels[5] },
      { el: document.getElementById('resources'), label: navLabels[6] },
      { el: document.getElementById('guides'), label: navLabels[7] }
    ];

    function updateMarker(ratio) {
      const clamped = Math.max(0, Math.min(1, ratio));
      const point = progress.getPointAtLength(clamped * pathLength);
      const x = point.x - 17;
      const y = (point.y * scaleY) - 17;
      marker.style.left = x + 'px';
      marker.style.top = y + 'px';
      marker.setAttribute('aria-valuenow', Math.round(clamped * 100));
      progress.style.strokeDashoffset = pathLength * (1 - clamped);

      let activeIdx = 0;
      sectionMap.forEach((s, i) => {
        const rect = s.el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) activeIdx = i;
      });
      sectionMap.forEach((s, i) => s.label.classList.toggle('active', i === activeIdx));
    }

    function scrollToRatio(ratio, instant) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.max(0, Math.min(1, ratio)) * maxScroll;
      window.scrollTo({ top: target, behavior: instant ? 'instant' : 'smooth' });
    }

    function lengthRatioFromTargetY(targetY) {
      let lo = 0;
      let hi = pathLength;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (progress.getPointAtLength(mid).y < targetY) lo = mid;
        else hi = mid;
      }
      return ((lo + hi) / 2) / pathLength;
    }

    marker.addEventListener('pointerdown', (e) => {
      isDragging = true;
      marker.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    marker.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const rect = sideNav.getBoundingClientRect();
      const yRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / navHeight));
      updateMarker(lengthRatioFromTargetY(yRatio * 600));
      scrollToRatio(yRatio, true);
    });

    marker.addEventListener('pointerup', () => {
      isDragging = false;
    });

    marker.addEventListener('keydown', (e) => {
      const current = parseFloat(marker.getAttribute('aria-valuenow')) / 100;
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollToRatio(current + 0.1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); scrollToRatio(current - 0.1); }
    });

    navLabels.forEach((label) => {
      label.addEventListener('click', () => {
        const target = document.getElementById(label.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    let scrollRaf = null;
    window.addEventListener('scroll', () => {
      if (isDragging) return;
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        updateMarker(lengthRatioFromTargetY(ratio * 600));
      });
    }, { passive: true });

    updateMarker(0);
  }
})();
