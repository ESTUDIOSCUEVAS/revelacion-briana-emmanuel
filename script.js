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
  for (const [value, linkId, pendingId] of [[config.locationUrl,'location-link','location-pending']]) {
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
    document.getElementById('reveal-title').textContent = `¡Eres Team ${girl ? 'Niña' : 'Niño'}!`;
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

// La reproducción comienza con el gesto de abrir la invitación.
(() => {
  const music = document.getElementById('invitation-music');
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  music.volume = 0.35;
  function update() {
    const playing = !music.paused && !music.ended;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    label.textContent = playing ? 'Pausar' : 'Música';
    document.getElementById('music-symbol').textContent = playing ? 'Ⅱ' : '♫';
  }
  function play() {
    const pending = music.play();
    if (pending && typeof pending.catch === 'function') pending.catch(update);
  }
  document.getElementById('open-invitation').addEventListener('click', () => {
    toggle.hidden = false;
    play();
  });
  toggle.addEventListener('click', () => {
    if (music.paused) play(); else music.pause();
  });
  for (const event of ['play', 'pause', 'ended']) music.addEventListener(event, update);
  music.addEventListener('error', () => {
    label.textContent = 'Sin audio';
    toggle.setAttribute('aria-label', 'No se pudo cargar la música');
    toggle.disabled = true;
  });
})();

// Álbum compartido dentro de la invitación.
(() => {
  const api = window.INVITATION_CONFIG.albumApi;
  const $ = id => document.getElementById(id);
  const files = $('album-files');
  const choose = $('choose-files');
  const grid = $('album-grid');
  const status = $('album-status');
  const progress = $('upload-progress');
  let cursor = null, loading = false, buffered = [];
  const types = {'jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png','webp':'image/webp','gif':'image/gif','heic':'image/heic','heif':'image/heif','mp4':'video/mp4','mov':'video/quicktime','webm':'video/webm'};
  function mediaUrl(value) {
    const url = new URL(value);
    if (url.origin !== new URL(api).origin || !url.pathname.startsWith('/media/recuerdos/')) throw new Error('Enlace de archivo no válido.');
    return url.href;
  }
  function render(item) {
    const url = mediaUrl(item.url);
    const card = document.createElement('div'); card.className = 'album-item';
    const original = document.createElement('a'); original.href = url; original.target = '_blank'; original.rel = 'noopener'; original.textContent = 'Abrir original ↗';
    if (item.type.startsWith('video/')) {
      const video = document.createElement('video'); video.src = url; video.controls = true; video.playsInline = true; video.preload = 'none'; video.setAttribute('aria-label','Video de la celebración');
      video.addEventListener('play', () => { document.getElementById('invitation-music').pause(); grid.querySelectorAll('video').forEach(other => {if(other !== video) other.pause();}); });
      card.append(video);
    } else {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'album-thumbnail'; button.setAttribute('aria-label','Ampliar fotografía');
      const img = document.createElement('img'); img.src = url; img.alt = 'Recuerdo de la celebración'; img.loading = 'lazy';
      img.addEventListener('error', () => { button.textContent = 'Vista previa no disponible'; });
      button.append(img); button.addEventListener('click', () => { $('large-photo').src = url; $('original-photo').href = url; $('photo-dialog').showModal(); });
      card.append(button);
    }
    card.append(original); grid.append(card);
  }
  async function load(reset = false) {
    if (loading) return;
    loading = true; $('refresh-album').disabled = true; $('more-photos').disabled = true;
    status.textContent = 'Cargando recuerdos…';
    if (reset) { cursor = null; buffered = []; grid.replaceChildren(); }
    try {
      if (!buffered.length) {
      const response = await fetch(api + '/api/photos' + (cursor ? '?cursor=' + encodeURIComponent(cursor) : ''));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar el álbum.');
      buffered = data.items; cursor = data.cursor;
      }
      buffered.splice(0, 6).forEach(render);
      $('more-photos').hidden = !cursor && !buffered.length;
      status.textContent = grid.children.length ? '' : 'Aún no hay recuerdos. Puedes compartir el primero.';
    } catch (error) { status.textContent = error.message + ' Pulsa Actualizar álbum para intentar de nuevo.'; }
    finally { loading = false; $('refresh-album').disabled = false; $('more-photos').disabled = false; }
  }
  $('open-album').addEventListener('click', () => {
    $('open-invitation').click();
    setTimeout(() => {
      const section = $('recuerdos'); section.tabIndex = -1;
      section.focus({preventScroll:true});
      section.scrollIntoView({behavior:'auto',block:'start'});
    }, 900);
  });
  const observer = new IntersectionObserver(entries => {
    if(entries.some(entry => entry.isIntersecting)) { load(true); observer.disconnect(); }
  }, {rootMargin:'200px'});
  observer.observe($('recuerdos'));
  $('refresh-album').addEventListener('click', () => load(true));
  $('more-photos').addEventListener('click', () => load());
  $('close-photo').addEventListener('click', () => $('photo-dialog').close());
  $('photo-dialog').addEventListener('click', e => { if(e.target === $('photo-dialog')) $('photo-dialog').close(); });
  choose.addEventListener('click', () => files.click());
  function upload(file, type) {
    return new Promise((resolve,reject) => {
      const xhr = new XMLHttpRequest(); xhr.open('POST', api + '/api/upload'); xhr.timeout = 600000;
      xhr.setRequestHeader('Content-Type', type);
      xhr.upload.onprogress = event => { if(event.lengthComputable) progress.value = event.loaded / event.total * 100; };
      xhr.onerror = () => reject(new Error('Falló la conexión.'));
      xhr.ontimeout = () => reject(new Error('La carga tardó demasiado.'));
      xhr.onload = () => {
        let data; try { data = JSON.parse(xhr.responseText); } catch { reject(new Error('No se pudo completar la carga.')); return; }
        if(xhr.status >= 200 && xhr.status < 300) resolve(data); else reject(new Error(data.error || 'No se pudo subir el archivo.'));
      };
      xhr.send(file);
    });
  }
  files.addEventListener('change', async () => {
    const selected = Array.from(files.files); if(!selected.length) return;
    choose.disabled = true; progress.hidden = false; $('upload-results').replaceChildren(); let sent = 0;
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i]; progress.value = 0;
      $('upload-status').textContent = `Subiendo ${i + 1} de ${selected.length}… Mantén abierta la invitación.`;
      const row = document.createElement('p'); row.className = 'note';
      try {
        const type = file.type || types[file.name.split('.').pop().toLowerCase()];
        if(!Object.values(types).includes(type)) throw new Error('Formato no admitido.');
        if(!file.size || file.size > 50 * 1024 * 1024) throw new Error('Debe pesar entre 1 byte y 50 MB.');
        await upload(file, type); sent++; row.textContent = `✓ ${file.name}`;
      } catch (error) { row.textContent = `${file.name}: ${error.message} Puedes seleccionarlo otra vez para reintentar.`; }
      $('upload-results').append(row);
    }
    $('upload-status').textContent = `${sent} de ${selected.length} archivos guardados en el álbum.`;
    progress.hidden = true; choose.disabled = false; files.value = '';
    if (!$('album-content').hidden) load(true);
  });
})();
