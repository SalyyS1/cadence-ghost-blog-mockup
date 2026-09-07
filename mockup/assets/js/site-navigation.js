/**
 * Category mega-menu toggle for the search header.
 * The panel is collapsed by default and opens below the sticky bar; it closes
 * on link activation, on Escape and on an outside click.
 */
(() => {
  const menuButton = document.querySelector('.menu-btn');
  const menu = document.querySelector('#category-menu');
  if (!menuButton || !menu) return;

  const setOpen = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close categories' : 'Open categories');
    menu.hidden = !isOpen;
  };

  const isOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.addEventListener('click', () => setOpen(!isOpen()));

  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!menu.contains(target) && !menuButton.contains(target)) setOpen(false);
  });
})();
