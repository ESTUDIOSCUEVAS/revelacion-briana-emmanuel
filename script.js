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
    const message = ['¡Hola! Confirmo mi asistencia a la revelación de sexo de Briana y Emmanuel, el sábado 7 de noviembre de 2026.', name ? `Mi nombre: ${name}.` : '', `Soy Team ${data.get('team')}.`, data.get('team') === 'niña' ? 'Mi regalito: toallitas húmedas.' : 'Mi regalito: pañales de etapa 3 en adelante.', wishes.value.trim() ? `Mis buenos deseos para el bebé y sus papás: ${wishes.value.trim()}` : ''].filter(Boolean).join('\n\n');
    const url = `https://wa.me/${config.whatsapp || '526131183963'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  function validUrl(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
  if (config.locationName || config.locationAddress) document.querySelector('#location-text').textContent = [config.locationName, config.locationAddress].filter(Boolean).join(' · ');
  for (const [value, linkId, pendingId] of [[config.locationUrl,'location-link','location-pending'],[config.photosUrl,'photos-link','photos-pending']]) {
    if (validUrl(value)) { const link = document.getElementById(linkId); link.href = value; link.hidden = false; document.getElementById(pendingId).hidden = true; }
  }
})();
