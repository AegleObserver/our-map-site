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
})();
