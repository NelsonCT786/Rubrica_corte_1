  const categories = [
    { id:'bienestar', label:'Bienestar', desc:'Salud, deporte, acompañamiento psicológico y vida universitaria.',
      icon:'<path d="M12 20s-7-4.3-7-9.8C5 7.2 7.2 5 10 5c1.6 0 3 .8 4 2 1-1.2 2.4-2 4-2 2.8 0 5 2.2 5 5.2C23 15.7 16 20 16 20 16 20 12 20 12 20Z"/>' },
    { id:'servicios', label:'Servicios', desc:'Biblioteca, cafetería, transporte y soporte administrativo.',
      icon:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>' },
    { id:'clases', label:'Clases y docencia', desc:'Metodologías, contenidos y calidad de la enseñanza.',
      icon:'<path d="M4 6h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V6Z"/><path d="M18 9h2v11h-2"/>' },
    { id:'inclusion', label:'Inclusión', desc:'Accesibilidad, diversidad y equidad dentro de la Facultad.',
      icon:'<circle cx="9" cy="9" r="4"/><circle cx="16" cy="14" r="4"/>' },
    { id:'espacios', label:'Espacios', desc:'Laboratorios, aulas, zonas comunes e infraestructura.',
      icon:'<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-7h6v7"/>' },
    { id:'procesos', label:'Procesos académicos', desc:'Matrícula, homologaciones, trámites y calendarios.',
      icon:'<path d="M6 4h9l5 5v11H6Z"/><path d="M15 4v5h5"/><path d="M9 13h7M9 17h7"/>' }
  ];

  const catGrid = document.getElementById('catGrid');
  const catSelect = document.getElementById('inpCategory');
  let activeCategory = '';

  categories.forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat.id; opt.textContent = cat.label;
    catSelect.appendChild(opt);

    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'cat'; btn.dataset.id = cat.id;
    btn.innerHTML = `<span class="cat-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></span>
                      <h3>${cat.label}</h3><p>${cat.desc}</p>`;
    btn.addEventListener('click', ()=>selectCategory(cat.id));
    catGrid.appendChild(btn);
  });

  function selectCategory(id){
    activeCategory = id;
    catSelect.value = id;
    document.querySelectorAll('.cat').forEach(el=>{
      el.classList.toggle('active', el.dataset.id === id);
    });
    document.getElementById('fieldCategoryWrap');
  }
  catSelect.addEventListener('change', e=>selectCategory(e.target.value));

  // reference numbering
  let refCounter = 1;
  function formatRef(n){ return 'REG-' + String(n).padStart(4,'0'); }
  document.getElementById('nextRef').textContent = formatRef(refCounter);

  // char counter
  const msgInput = document.getElementById('inpMessage');
  const charCount = document.getElementById('charCount');
  msgInput.addEventListener('input', ()=>{
    const len = msgInput.value.length;
    charCount.textContent = `${len} / 600`;
    charCount.classList.toggle('warn', len > 540);
  });

  const anonBox = document.getElementById('inpAnon');
  const nameInput = document.getElementById('inpName');
  const programInput = document.getElementById('inpProgram');
  anonBox.addEventListener('change', ()=>{
    const disabled = anonBox.checked;
    nameInput.disabled = disabled; programInput.disabled = disabled;
    if(disabled){ nameInput.value=''; programInput.value=''; }
  });

  const form = document.getElementById('suggestForm');
  const confirmBox = document.getElementById('confirmBox');
  const logList = document.getElementById('logList');
  const logCount = document.getElementById('logCount');
  const entries = [];

  const labelFor = id => categories.find(c=>c.id===id)?.label || id;

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let valid = true;
    const catField = catSelect.closest('.field');
    const msgField = document.getElementById('fieldMessage');

    if(!catSelect.value){ catField.classList.add('invalid'); valid = false; }
    else catField.classList.remove('invalid');

    if(!msgInput.value.trim()){ msgField.classList.add('invalid'); valid = false; }
    else msgField.classList.remove('invalid');

    if(!valid) return;

    const entry = {
      ref: formatRef(refCounter),
      category: catSelect.value,
      title: document.getElementById('inpTitle').value.trim() || 'Sin título',
      message: msgInput.value.trim(),
      anon: anonBox.checked,
      name: anonBox.checked ? '' : nameInput.value.trim()
    };
    entries.unshift(entry);
    refCounter++;

    renderLog();

    document.getElementById('confirmRef').textContent = `Número de seguimiento: ${entry.ref}`;
    confirmBox.classList.add('show');
    document.getElementById('nextRef').textContent = formatRef(refCounter);

    form.reset();
    charCount.textContent = '0 / 600';
    nameInput.disabled = false; programInput.disabled = false;
    document.querySelectorAll('.cat').forEach(el=>el.classList.remove('active'));

    setTimeout(()=>confirmBox.classList.remove('show'), 6000);
  });

  function renderLog(){
    if(entries.length === 0){
      logList.innerHTML = '<p class="empty-log">Aún no hay sugerencias registradas. Las que envíes aparecerán aquí mientras estés en esta página.</p>';
      logCount.textContent = '0 registros';
      return;
    }
    logCount.textContent = entries.length === 1 ? '1 registro' : `${entries.length} registros`;
    logList.innerHTML = entries.map(en => `
      <div class="entry">
        <span class="ref">${en.ref}</span>
        <div class="body">
          <h4>${escapeHtml(en.title)}</h4>
          <p>${escapeHtml(en.message)}</p>
          ${en.name ? `<p style="margin-top:4px;color:#8FA0AF;">— ${escapeHtml(en.name)}</p>` : ''}
        </div>
        <span class="tag">${labelFor(en.category)}</span>
      </div>
    `).join('');
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
