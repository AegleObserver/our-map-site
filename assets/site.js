(function () {
  const config = Object.assign({
    appUrl: '',
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
      node.textContent = config.appUrl
        ? '在线工作台用于真实分析，需要后端服务在线；离线 Demo 使用固定模拟数据'
        : '离线 Demo 已就绪（固定模拟数据），可直接体验；真实分析需在本机运行';
    }
    if (key === 'demo-detail' && config.demoUrl) {
      node.textContent = config.appUrl
        ? '在线工作台连的是已部署后端，需要后端在线；离线 Demo 是固定模拟数据，打开就能用。两者的结论不要混读。'
        : 'Demo 是固定模拟数据，打开就能用；需要真实分析时，请按主仓库 README 在本机配置运行。';
    }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menuButton && nav) {
    function closeMenu(returnFocus) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
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

  // 浮动导航在窄屏由 CSS 隐藏，压不到正文；隐藏时不必初始化。
  const sideNav = document.querySelector('.side-nav');
  if (sideNav && sideNav.getClientRects().length) {
    const marker = sideNav.querySelector('.side-nav-marker');
    const progress = sideNav.querySelector('.side-nav-progress');
    const navLabels = sideNav.querySelectorAll('.side-nav-labels li');
    let navHeight = sideNav.offsetHeight;
    let scaleY = navHeight / 600;
    const pathLength = progress.getTotalLength();
    progress.style.strokeDasharray = pathLength;
    progress.style.strokeDashoffset = pathLength;

    let isDragging = false;
    let currentRatio = 0;

    const sectionIds = ['main-content', 'capabilities', 'screenshots', 'method', 'trust', 'roadmap', 'resources', 'guides'];
    const sectionMap = sectionIds
      .map((id, index) => ({ el: document.getElementById(id), label: navLabels[index] }))
      .filter((section) => section.el && section.label);

    function updateMarker(ratio) {
      const clamped = Math.max(0, Math.min(1, ratio));
      currentRatio = clamped;
      const point = progress.getPointAtLength(clamped * pathLength);
      marker.style.left = (point.x - 17) + 'px';
      marker.style.top = ((point.y * scaleY) - 17) + 'px';
      marker.setAttribute('aria-valuenow', Math.round(clamped * 100));
      progress.style.strokeDashoffset = pathLength * (1 - clamped);

      let activeIdx = 0;
      sectionMap.forEach((section, index) => {
        if (section.el.getBoundingClientRect().top <= window.innerHeight / 2) activeIdx = index;
      });
      sectionMap.forEach((section, index) => {
        const on = index === activeIdx;
        section.label.classList.toggle('active', on);
        const link = section.label.querySelector('a');
        if (link) link.setAttribute('aria-current', on ? 'true' : 'false');
      });
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
      if (e.key === 'Home') { e.preventDefault(); scrollToRatio(0); }
      if (e.key === 'End') { e.preventDefault(); scrollToRatio(1); }
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

    window.addEventListener('resize', () => {
      navHeight = sideNav.offsetHeight;
      scaleY = navHeight / 600;
      updateMarker(currentRatio);
    });

    updateMarker(0);
  }
})();
