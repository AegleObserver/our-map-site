(function () {
  const config = Object.assign({
    demoUrl: '',
    appUrl: '',
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
      node.textContent = '在线 Demo 地址已配置，可直接开始体验';
    }
    if (key === 'demo-detail' && config.demoUrl) {
      node.textContent = 'Demo 使用固定模拟数据，适合快速体验从选点到报告的完整流程。正式分析服务需要独立后端。';
    }
    if (key === 'app' && config.appUrl) {
      node.textContent = '正式工作台入口已配置';
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
    progress.style.strokeDasharray = pathLength;
    progress.style.strokeDashoffset = pathLength;

    let isDragging = false;

    const sectionMap = [
      { el: document.getElementById('main-content'), label: navLabels[0] },
      { el: document.getElementById('capabilities'), label: navLabels[1] },
      { el: document.getElementById('screenshots'), label: navLabels[2] },
      { el: document.getElementById('method'), label: navLabels[3] },
      { el: document.getElementById('trust'), label: navLabels[4] },
      { el: document.getElementById('roadmap'), label: navLabels[5] }
    ];

    function updateMarker(ratio) {
      const clamped = Math.max(0, Math.min(1, ratio));
      const point = progress.getPointAtLength(clamped * pathLength);
      const svgEl = progress.ownerSVGElement;
      const svgRect = svgEl.getBoundingClientRect();
      const scaleX = svgRect.width / 40;
      const scaleY = svgRect.height / 600;
      const x = (point.x * scaleX) - 17;
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

    function scrollToRatio(ratio) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.max(0, Math.min(1, ratio)) * maxScroll;
      window.scrollTo({ top: target });
    }

    marker.addEventListener('pointerdown', (e) => {
      isDragging = true;
      marker.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    marker.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const rect = sideNav.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / navHeight;
      updateMarker(ratio);
      scrollToRatio(ratio);
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

    window.addEventListener('scroll', () => {
      if (isDragging) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      updateMarker(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    }, { passive: true });

    updateMarker(0);
  }
})();
