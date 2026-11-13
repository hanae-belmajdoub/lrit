/* Language navigation keeps the current page, query filters, member ID and anchor. */
(() => {
  const english = document.documentElement.lang === 'en';
  const filename = location.pathname.split('/').filter(Boolean).at(-1);
  const page = filename?.endsWith('.html') ? filename : 'index.html';
  function destination() {
    const target = new URL((english ? '../' : 'en/') + page, location.href);
    target.search = location.search;
    target.hash = location.hash;
    return target.href;
  }
  document.querySelectorAll('.language-link').forEach(link => {
    link.href = destination();
    link.textContent = english ? 'FR' : 'EN';
    link.lang = english ? 'fr' : 'en';
    link.hreflang = link.lang;
    link.setAttribute('aria-label', english ? 'Version française' : 'English version');
    link.addEventListener('click', event => {
      link.href = destination();
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        event.preventDefault(); location.assign(link.href);
      }
    });
  });
})();
