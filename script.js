(() => {
  'use strict';
  const config = window.INVITATION_CONFIG || {};
  const form = document.querySelector('#rsvp-form');
  const wishes = document.querySelector('#wishes');
  wishes.addEventListener('input', () => { document.querySelector('#count').textContent = wishes.value.length; });
  form.addEventListener('change', () => {
    const team = new FormData(form).get('team');
    if (team) document.querySelector('#selection').textContent = `¡Eres Team ${team}! ${team === 'niña' ? 'Tu regalito: toallitas húmedas.' : 'Tu regalito: pañales de etapa 3 en adelante.'}`;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const message = ['¡Hola! Confirmo mi asistencia a la revelación de sexo de Briana y Emmanuel, el domingo 8 de noviembre de 2026.', name ? `Mi nombre: ${name}.` : '', `Soy Team ${data.get('team')}.`, data.get('team') === 'niña' ? 'Mi regalito: toallitas húmedas.' : 'Mi regalito: pañales de etapa 3 en adelante.', wishes.value.trim() ? `Mis buenos deseos para el bebé y sus papás: ${wishes.value.trim()}` : ''].filter(Boolean).join('\n\n');
    const url = `https://wa.me/${config.whatsapp || '526131183963'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  function validUrl(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
  if (config.locationName || config.locationAddress) document.querySelector('#location-text').textContent = [config.locationName, config.locationAddress].filter(Boolean).join(' · ');
  for (const [value, linkId, pendingId] of [[config.locationUrl,'location-link','location-pending'],[config.photosUrl,'photos-link','photos-pending']]) {
    if (validUrl(value)) { if (linkId === 'photos-link') document.querySelector('#upload-instructions').hidden = false; const link = document.getElementById(linkId); link.href = value; link.hidden = false; document.getElementById(pendingId).hidden = true; }
  }
})();

(() => {
  const opening = document.getElementById('opening');
  const content = document.getElementById('invitation-content');
  const openButton = document.getElementById('open-invitation');
  openButton.addEventListener('click', () => {
    content.hidden = false;
    content.inert = false;
    document.body.classList.remove('sealed');
    document.body.classList.add('entered');
    opening.classList.add('departing');
    window.setTimeout(() => {
      opening.hidden = true;
      const heading = document.querySelector('#inicio h1');
      heading.tabIndex = -1;
      heading.focus({preventScroll: true});
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850);
  });
  let particleTimer;
  document.getElementById('rsvp-form').addEventListener('change', event => {
    if (event.target.name !== 'team') return;
    const team = event.target.value;
    const girl = team === 'niña';
    document.querySelector('.rsvp').dataset.team = team;
    document.getElementById('team-reveal').hidden = false;
    document.getElementById('reveal-title').textContent = `¡Tu corazón es Team ${girl ? 'Niña' : 'Niño'}!`;
    document.getElementById('reveal-icon').textContent = girl ? '♡' : '☆';
    const stage = document.getElementById('celebration');
    stage.replaceChildren();
    clearTimeout(particleTimer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const colors = girl ? ['#d480a4','#eebed1','#c79a62','#fff'] : ['#679fd1','#b5d9f3','#c79a62','#fff'];
      for (let n = 0; n < 38; n++) {
        const p = document.createElement('i'); p.className = 'confetti';
        p.style.setProperty('--particle', colors[n % colors.length]);
        p.style.setProperty('--x', `${(Math.random()-.5)*window.innerWidth}px`);
        p.style.setProperty('--y', `${100+Math.random()*window.innerHeight*.6}px`);
        p.style.setProperty('--rot', `${Math.random()*700-350}deg`);
        stage.append(p);
      }
      particleTimer = setTimeout(() => stage.replaceChildren(), 1700);
    }
  });
})();
