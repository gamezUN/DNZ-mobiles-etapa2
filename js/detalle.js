/* Una sola ficha HTML para todos los productos. Los datos viven en catalogo.js. */
(function () {
  const query = new URLSearchParams(window.location.search);
  const id = query.get('id');
  const producto = CATALOGO.find(p => p.id === id);
  const contenedor = document.getElementById('detalle-contenido');
  if (!producto) {
    contenedor.innerHTML = '<div class="empty">No encontramos este producto. <a href="index.html">Volver al inicio</a></div>';
    return;
  }
  const esFunda = producto.categoria === 'fundas';
  const modeloPrevio = query.get('modelo') || '';
  document.title = `${producto.nombre} | DNZ Mobiles`;
  document.getElementById('ruta-nombre').textContent = producto.nombre;
  document.getElementById('volver').href = esFunda ? (modeloPrevio ? `productos.html?modelo=${encodeURIComponent(modeloPrevio)}` : 'modelos.html') : 'accesorios.html';
  const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const select = (id,label,values,selected='') => `<label class="variant-field" for="${id}">${label}<select id="${id}"><option value="">Selecciona una opción</option>${values.map(v => `<option value="${safe(v)}" ${v===selected?'selected':''}>${safe(v)}</option>`).join('')}</select></label>`;
  const groups = producto.compatibilidad || (esFunda && producto.modelos.length ? {'iPhone':producto.modelos} : {});
  const compatibility = Object.entries(groups).map(([marca, modelos]) => `<div class="compat-group"><h3>${safe(marca)}</h3><div class="chips">${modelos.map(m=>`<span class="chip">${safe(m)}</span>`).join('')}</div></div>`).join('');
  contenedor.innerHTML = `
    <div class="detail-photo" style="background:${producto.fondoImagen||'#f0edeb'}"><img src="${safe(producto.imagen)}" alt="${safe(producto.nombre)}"></div>
    <div class="detail-info"><span class="eyebrow">DNZ MOBILES · COLECCIÓN 2026</span><h1>${safe(producto.nombre)}</h1><div class="detail-price">${money(producto.precio)}</div>
      <p class="detail-description">${safe(producto.descripcion)}</p>
      <div class="variant-grid">
        ${esFunda && producto.modelos.length ? select('var-modelo','Modelo de iPhone',producto.modelos,modeloPrevio) : ''}
        ${producto.tamanos ? select('var-tamano','Tamaño de Apple Watch',producto.tamanos) : ''}
        ${producto.versiones ? select('var-version','Versión',producto.versiones) : ''}
        ${producto.colores && producto.colores.length ? select('var-color','Color',producto.colores) : ''}
      </div>
      <a id="cotizar" class="btn btn-dark detail-cta" href="#" target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp ↗</a>
      <p class="fineprint">Disponibilidad de modelos y colores sujeta a confirmación. Entrega personal o a domicilio, coordinada por WhatsApp.</p>
      ${compatibility ? `<div class="compatibility"><h2>Compatibilidad según el catálogo</h2>${compatibility}</div>` : ''}
      ${producto.notaCompatibilidad ? `<p class="fineprint">${safe(producto.notaCompatibilidad)}</p>` : ''}
    </div>`;
  const link = document.getElementById('cotizar');
  const update = () => {
    const get = id => document.getElementById(id)?.value || '';
    const variants = [['Modelo de iPhone',get('var-modelo')],['Tamaño',get('var-tamano')],['Versión',get('var-version')],['Color',get('var-color')]].filter(x=>x[1]);
    const extra = variants.map(([k,v])=>`${k}: ${v}`).join('. ');
    const msg = `Hola, vi ${producto.nombre} en DNZ Mobiles y quiero cotizarlo. Precio publicado: ${money(producto.precio)}.${extra?' '+extra+'.':''} ¿Me confirmas disponibilidad, entrega y forma de pago?`;
    link.href = 'https://wa.me/528129041916?text='+encodeURIComponent(msg);
  };
  contenedor.querySelectorAll('select').forEach(el=>el.addEventListener('change',update));
  update();
  const related = CATALOGO.filter(p=>p.categoria===producto.categoria && p.id!==producto.id).slice(0,4);
  show(related,'relacionados');
})();
