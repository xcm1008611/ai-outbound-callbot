const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileMenu.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('.segmented button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.segmented button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.panel !== button.dataset.mode));
  });
});

const track = document.querySelector('.feature-track');
document.querySelectorAll('[data-carousel]').forEach(button => {
  button.addEventListener('click', () => track.scrollBy({ left: button.dataset.carousel === 'next' ? 300 : -300, behavior: 'smooth' }));
});

const galleryImage = document.querySelector('.gallery-stage img');
document.querySelectorAll('.gallery-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.gallery-tabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    galleryImage.src = button.dataset.image;
  });
});

document.querySelector('footer form').addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'Subscribed';
});
