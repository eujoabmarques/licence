//<![CDATA[

/* === SearchFab (bind robusto, sem tocar no CSS) =================== */
(function(){
  // evita bind duplicado (loader, re-dispatch, etc.)
  if (window.__SFAB_BOUND__) return; 
  window.__SFAB_BOUND__ = true;

  function openWrap(wrap){
    if (!wrap) return;
    const btn = wrap.querySelector('.searchfab__toggle');
    const box = wrap.querySelector('.searchfab__box');
    wrap.classList.add('is-open');
    if (btn) btn.setAttribute('aria-expanded','true');
    if (box) {
      box.hidden = false;
      const input = box.querySelector('.searchfab__input');
      setTimeout(()=>{ try{ input && input.focus(); }catch(_){} }, 30);
    }
  }
  function closeWrap(wrap){
    if (!wrap) return;
    const btn = wrap.querySelector('.searchfab__toggle');
    const box = wrap.querySelector('.searchfab__box');
    wrap.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded','false');
    if (box) box.hidden = true;
  }
  function toggleFromButton(btn){
    const wrap = btn.closest('.searchfab');
    if (!wrap) return;
    if (wrap.classList.contains('is-open')) closeWrap(wrap);
    else openWrap(wrap);
  }

  // UM único listener p/ tudo (sem captura)
  document.addEventListener('click', function(e){
    const tgl = e.target.closest?.('.searchfab__toggle');
    if (tgl){ e.preventDefault(); toggleFromButton(tgl); return; }

    const cls = e.target.closest?.('.searchfab__close');
    if (cls){ e.preventDefault(); closeWrap(cls.closest('.searchfab')); return; }

    // clique fora fecha
    document.querySelectorAll('.searchfab.is-open').forEach(w=>{
      if (!w.contains(e.target)) closeWrap(w);
    });
  }, {passive:false});

  // ESC fecha
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){
      document.querySelectorAll('.searchfab.is-open').forEach(closeWrap);
    }
  });

  // log opcional
  try{ console.log('[SearchFab] bound once'); }catch(_){}
})();


(function () {
  'use strict';

  // Bloqueia menu do botão direito
  const stop = (e) => { e.preventDefault(); e.stopImmediatePropagation?.(); return false; };
  document.addEventListener('contextmenu', stop, { capture: true });

  // Bloqueia F12, Ctrl/Cmd+U, Ctrl/Cmd+Shift+I/J/C/K e Cmd+Option+I/C (Safari)
  window.addEventListener('keydown', function (e) {
    const key = (e.key || '').toLowerCase();
    const ctrlCmd = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    const isF12 = e.key === 'F12' || e.code === 'F12' || e.keyCode === 123;

    const block =
      isF12 ||
      (ctrlCmd && key === 'u') ||                                  // Ver código-fonte
      (ctrlCmd && shift && ['i','j','c','k'].includes(key)) ||     // DevTools/Console
      (ctrlCmd && alt && ['i','c'].includes(key));                 // Safari (⌘⌥I / ⌘⌥C)

    if (block) stop(e);
  }, { capture: true });

})();


(function(){
const CONFIG = {
  PRODUCT_NAME: 'EnviaAgora · Licença',
  ISSUER_BLOG_ID: '3250349446996015558',
  WIDGET_ID: 'LinkList6',
  WIDGET_LICENSE_LABEL: 'Licença',

  PUBLIC_KEY_PEM: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlIT8WMYwpj6QUnlCdqiQ
Qo6lIvqzHJaKzTKV0HHYs7v36NJ9lKqxdOjUTenarTkChs/hAliQSH3hAmzB5Y3Z
9k5j+aLYkLovU112b9/dD4WDOws4qto6iV0u+dLSDcZZS7LXXgLmDQkhPGC0IXR3
Ba+1VzSmF70rG9QF33fW49pbUslzAJyuFazxXIic/cFy72HmEmJYJcl2ChxIZi+S
CKhB2aPqc4apdY6d5gAWFb7orMZRY1tG9SN2MvNIU5Umtn/g4Dhcrthdd6m9Wi0p
6+YMla9SHAjh73aGjInSvux6KyK5CqQ/unG3iveygB1C0muQRBV8X28x4ec/d2jv
VQIDAQAB
-----END PUBLIC KEY-----`,

  // opcionais:
  BLOCK_ALL_CSS: true,
  DEBUG: true
};


  const te=new TextEncoder(), td=new TextDecoder();
  const norm=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();

  const b64uDec=s=>{const b64=s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=');const bin=atob(b64),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);return u8.buffer;}
  const pemToBuf=pem=>{const b64=String(pem).replace(/-----BEGIN [^-]+-----/,'').replace(/-----END [^-]+-----/,'').replace(/\s+/g,'');const raw=atob(b64),u=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)u[i]=raw.charCodeAt(i);return u.buffer;}
  const importPub=pem=>crypto.subtle.importKey('spki',pemToBuf(pem),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);

  function getBlogId(){
    if (window.BLOGGER_ID) return String(window.BLOGGER_ID);
    const m=document.querySelector('meta[name="blogger-blog-id"]'); if(m&&m.content) return String(m.content);
    const html=document.documentElement.innerHTML;
    let r=/"blogId"\s*:\s*"(\d+)"/.exec(html)||/data-blog-id=['"](\d+)['"]/i.exec(html)||/blogger\.blogId\s*=\s*['"](\d+)['"]/i.exec(html);
    return r ? r[1] : 'UNKNOWN';
  }

  function ensureStyles(){
    if (document.getElementById('tb-lic-css')) return;
    const css=document.createElement('style'); css.id='tb-lic-css';
    css.textContent='.tb-lic-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:2147483647;display:flex;align-items:center;justify-content:center}.tb-lic-card{width:min(560px,94vw);background:#111;color:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,.6);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial}.tb-lic-card h1{font-size:22px;margin:0 0 8px}.tb-lic-card p{opacity:.9;line-height:1.5;margin:0 0 14px}.tb-lic-badge{display:inline-block;background:#222;border:1px solid #333;border-radius:999px;padding:6px 10px;font-size:12px;margin-bottom:10px}';
    document.head.appendChild(css);
  }
  function showBlocker(msg){
    ensureStyles();
    const o=document.createElement('div');o.className='tb-lic-overlay';
    const c=document.createElement('div');c.className='tb-lic-card';
    c.innerHTML=`<span class="tb-lic-badge">${CONFIG.PRODUCT_NAME}</span><h1>Ativação necessária</h1><p>${msg}</p><p style="opacity:.8">Abra <em>Layout → Configurações</em> e cole o token no item "<strong>${CONFIG.WIDGET_LICENSE_LABEL}</strong>" do widget <strong>${CONFIG.WIDGET_ID}</strong>.</p>`;
    o.appendChild(c);document.body.appendChild(o);if(CONFIG.BLOCK_ALL_CSS)document.documentElement.style.overflow='hidden';
  }
  function hideBlocker(){ const o=document.querySelector('.tb-lic-overlay'); if(o)o.remove(); document.documentElement.style.overflow=''; }

  // Ler token do(s) LinkList
  function allLinkLists(){ return Array.from(document.querySelectorAll('[id^="LinkList"]')); }
  function mapFromLinkList(el){
    const map={};
    el.querySelectorAll('.widget-content a').forEach(a=>{
      const key=(a.textContent||a.innerText||'').trim(); let val=(a.getAttribute('href')||'').trim();
      if(!key) return;
      if(val.startsWith('license:')) val=val.slice(8);
      if(val.startsWith('token:'))   val=val.slice(6);
      if(val.startsWith('<')&&val.endsWith('>')) val=val.slice(1,-1);
      map[norm(key)]=val;
    });
    return map;
  }
  function readToken(){
    // tenta o ID configurado
    const idEl=document.getElementById(CONFIG.WIDGET_ID);
    const keys=[norm(CONFIG.WIDGET_LICENSE_LABEL),'licenca','licença','license','chave'];
    if(idEl){
      const map=mapFromLinkList(idEl);
      for(const k of keys) if(map[k]) return map[k];
    }
    // varre todos
    for(const ll of allLinkLists()){
      const map=mapFromLinkList(ll);
      for(const k of keys) if(map[k]){ CONFIG.WIDGET_ID=ll.id; return map[k]; }
    }
    return '';
  }

  function parseToken(tok){
    const p=String(tok).split('.'); if(p.length!==3 || p[0]!=='v1') throw new Error('Formato do token inválido');
    const payload=JSON.parse(td.decode(b64uDec(p[1]))); const sig=new Uint8Array(b64uDec(p[2]));
    return {payload,payloadB64:p[1],signature:sig};
  }
  function validatePayload(pl, blogId){
    const {bid,plan,exp,iat,lic,iss}=pl||{};
    if(String(iss)!==String(CONFIG.ISSUER_BLOG_ID)) throw new Error('emissor inválido (iss)');
    if(String(bid)!==String(blogId)) throw new Error('blogId não confere (esperado '+blogId+', veio '+bid+')');
    if(!['trial','monthly'].includes(String(plan))) throw new Error('plano inválido');
    if(typeof exp!=='number' || Date.now()>=exp*1000) throw new Error('expirada');
    if(typeof iat!=='number' || iat>exp) throw new Error('iat inválido');
    if(!lic || typeof lic!=='string') throw new Error('id inválido');
  }

  async function verifyToken(tok){
    const {payload,payloadB64,signature}=parseToken(tok);
    const blogId=getBlogId(); validatePayload(payload, blogId);
    const pub=await importPub(CONFIG.PUBLIC_KEY_PEM);
    const ok=await crypto.subtle.verify({name:'RSASSA-PKCS1-v1_5'},pub,signature,te.encode('license-v1.'+payloadB64));
    if(!ok) throw new Error('assinatura inválida (PUBLIC_KEY_PEM não corresponde à privada usada para assinar)');
    if(CONFIG.DEBUG) console.log('[lic] OK payload:', payload);
    return payload;
  }

  async function boot(){
    try{
      const blogId=getBlogId(); if(CONFIG.DEBUG) console.log('[lic] blogId=', blogId);
      const tok=readToken();    if(CONFIG.DEBUG) console.log('[lic] token=', tok ? (tok.slice(0,32)+'...'):'(não encontrado)', 'widget=', CONFIG.WIDGET_ID);
      if(!tok){ showBlocker('Token não encontrado no widget (item "Licença").'); return; }
      await verifyToken(tok); hideBlocker();
}catch(e){
  const msgRaw = String(e && e.message || e);
  if (CONFIG.DEBUG) console.warn('[lic] Falha:', msgRaw);

  let msg = 'Licença inválida, expirada ou revogada.';
  if (!isSecureContext || !crypto || !crypto.subtle) {
    msg = 'HTTPS obrigatório para validar a licença. Ative HTTPS (Configurações → HTTPS) e aguarde o certificado.';
  } else if (/blogId n[oã]o confere/i.test(msgRaw) || /emissor inv[áa]lido|iss/i.test(msgRaw)) {
    msg = 'Este token pertence a outro blog. Gere um novo token para este blog.';
  } else if (/Token n[aã]o encontrado/i.test(msgRaw)) {
    msg = 'Token não encontrado no widget. Verifique o LinkList com o item “Licença”.';
  }
  showBlocker(msg);
}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();




(function(){
"use strict";

/* ===== SHIMS para evitar "não definido" antes do carregamento ===== */
if (!window.adicionarAoCarrinho) {
  window.__pendingAdds = [];
  window.adicionarAoCarrinho = function(){
    window.__pendingAdds.push([].slice.call(arguments));
    try{ console.warn('Carrinho carregando; item será adicionado ao finalizar.'); }catch(_){}
  };
}
if (!window.toggleMenu) { window.toggleMenu = function(){}; }

/* ========= Estado ========= */
var carrinho = [];
try{ carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]"); }catch(_){ carrinho = []; }
var TAXAS_ENTREGA = []; // [{bairro, valor}]
function fmt(v){ return 'R$ ' + Number(v||0).toFixed(2).replace('.', ','); }
function save(){ try{ localStorage.setItem("carrinho", JSON.stringify(carrinho)); }catch(_){} }
function escapeHTML(s){
  return String(s || '').replace(/[&<>"']/g, function(m){
    return {"&":"&amp;","<":"&lt;","&gt;":">","\"":"&quot;","'":"&#39;"}[m];
  });
}

/* ========= CONFIG (widget 'configuracao') ========= */
function _getConfigAnchors(){
  var sec =
    document.getElementById('configuracao') ||
    document.querySelector('b\\:section#configuracao') ||
    document.querySelector('#configuracao.section');
  if (!sec) return [];
  var as = sec.querySelectorAll('a');
  var out = [];
  for (var i=0;i<as.length;i++){
    var a = as[i];
    var name = (a.textContent||'').trim();
    var value = (a.getAttribute('href') || a.textContent || '').trim();
    out.push({ name:name, lower:name.toLowerCase(), value:value });
  }
  return out;
}
function getWhatsNumberFromWidget(){
  var anchors = _getConfigAnchors();
  var cand = null;
  for (var i=0;i<anchors.length;i++){ if (/whats/.test(anchors[i].lower)){ cand = anchors[i]; break; } }
  if (!cand){
    for (var j=0;j<anchors.length;j++){
      if (/\d{10,}/.test(anchors[j].value) || /\d{10,}/.test(anchors[j].name)){ cand = anchors[j]; break; }
    }
  }
  var raw = (cand && (cand.value || cand.name) || '').trim();
  var digits = (raw.match(/\d+/g)||[]).join('');
  if (!digits) return null;
  if (digits.length <= 11) digits = '55' + digits; // DDI BR
  return digits;
}
function parseFeesString(s){
  s = String(s||'').trim();
  if (!s) return [];
  var tokens = s.split(/[,;\n]+/);
  var out = [];
  for (var i=0;i<tokens.length;i++){
    var t = (tokens[i]||'').trim();
    if (!t) continue;
    var m = t.match(/([\d]+(?:[.,]\d+)?)/); // número da taxa
    if (!m) continue;
    var valor = parseFloat(m[1].replace(',', '.')) || 0;
    var bairro = t
      .replace(m[0], '')        // tira o número
      .replace(/R\$\s*/gi, '')  // tira "R$" se existir
      .replace(/[:=\-–—]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!bairro) bairro = 'Região ' + (out.length+1);
    out.push({ bairro:bairro, valor:valor });
  }
  // dedup por bairro (último vence)
  var map = {};
  for (var k=0;k<out.length;k++){ map[out[k].bairro] = out[k].valor; }
  var uniq = [];
  for (var b in map){ uniq.push({ bairro:b, valor:map[b] }); }
  return uniq;
}
function getDeliveryFeesFromWidget(){
  var anchors = _getConfigAnchors();
  var item = null;
  for (var i=0;i<anchors.length;i++){ if (/taxa|entrega/.test(anchors[i].lower)){ item = anchors[i]; break; } }
  return parseFeesString(item && item.value);
}



// ====== CUPONS ===================================================
var CUPONS_DISPONIVEIS = [];     // [{code, type:'percent'|'fixed', value}]
var CUPOM_ATIVO = null;
var CUPOM_KEY = 'cupomAtivo';

function __normCup(s){
  return String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().replace(/\s+/g,'');
}
function parseCouponsString(s){
  s = String(s||'').trim(); if (!s) return [];
  const tokens = s.split(/[,;\n]+/);
  const out = [];
  tokens.forEach(raw0=>{
    const raw = String(raw0||'').trim(); if (!raw) return;
    let code = raw, type='percent', value=0;

    // Formatos aceitos (mistos):
    //   CODIGO:10%   | CODIGO = 10% | CODIGO 10%
    //   CODIGO:R$5   | CODIGO = R$5 | CODIGO 5reais
    //   CODIGO10     (sufixo numérico => %)
    let m = raw.match(/^(.+?)[\s:=\-]+([\%\-\+R\$\s]*[0-9]+(?:[.,][0-9]{1,2})?)$/i);
    if (m){
      code = m[1].trim();
      const amt = m[2].trim();
      if (/R?\$|reais|fix/i.test(amt)) type='fixed';
      if (/%/.test(amt)) type='percent';
      value = parseFloat(amt.replace(/[^\d,.-]/g,'').replace(',', '.'))||0;
    } else {
      const m2 = raw.match(/^(.+?)(\d{1,3})$/); // CODIGO10 -> 10%
      code  = (m2 ? m2[1] : raw).trim();
      value = m2 ? parseInt(m2[2],10) : 0;
      type  = value>0 ? 'percent' : 'percent';
    }
    if (!code) return;
    if (value <= 0) value = 10; // fallback: 10%
    out.push({ code, type, value:Number(value) });
  });
  return out;
}
function getCouponsFromWidget(){
  var anchors = _getConfigAnchors(); // já existe no seu código
  var item = null;
  for (var i=0;i<anchors.length;i++){
    if (/cupom|cupons|desconto/.test(anchors[i].lower)){ item = anchors[i]; break; }
  }
  return parseCouponsString(item && item.value);
}
function findCoupon(code){
  const c = __normCup(code);
  for (var i=0;i<CUPONS_DISPONIVEIS.length;i++){
    if (__normCup(CUPONS_DISPONIVEIS[i].code) === c) return CUPONS_DISPONIVEIS[i];
  }
  return null;
}
function setActiveCoupon(obj){
  CUPOM_ATIVO = obj ? { code: obj.code, type: obj.type, value: Number(obj.value)||0 } : null;
  try{ localStorage.setItem(CUPOM_KEY, JSON.stringify(CUPOM_ATIVO||null)); }catch(_){}
  atualizarResumoFinalizar(); // recalcula total
}
function loadActiveCoupon(){
  try{
    const s = localStorage.getItem(CUPOM_KEY);
    if (s){ const obj = JSON.parse(s); if (obj && obj.code) CUPOM_ATIVO = obj; }
  }catch(_){}
}
function calcDiscount(subtotal){
  if (!CUPOM_ATIVO) return 0;
  var d = 0;
  if (CUPOM_ATIVO.type === 'percent') d = subtotal * (Number(CUPOM_ATIVO.value||0)/100);
  else d = Number(CUPOM_ATIVO.value||0);
  if (d < 0) d = 0;
  if (d > subtotal) d = subtotal;
  return d;
}
function ensureCupomUI(){
  var tab = document.getElementById('tab-finalizar') || document.getElementById('carrinho-flutuante') || document.body;
  if (!tab) return;
  if (document.getElementById('cupom-wrap')) return;

  var wrap = document.createElement('div');
  wrap.id = 'cupom-wrap';
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0;';
  wrap.innerHTML =
    '<input id="cf-cupom" placeholder="Cupom de desconto" style="flex:1;padding:8px;border:1px solid #e5e7eb;border-radius:8px" autocomplete="off">'+
    '<button id="btn-aplicar-cupom" style="border:0;background:#dcfce7;color:#166534;border-radius:8px;padding:8px 10px;cursor:pointer;font-weight:700">Aplicar</button>'+
    '<button id="btn-remover-cupom" style="border:0;background:#fee2e2;color:#991b1b;border-radius:8px;padding:8px 10px;cursor:pointer;display:none">Remover</button>'+
    '<div id="cupom-hint" class="muted" style="font-size:12px;flex:0 0 100%;margin:6px 0 0 0;display:none"></div>';

  var resumo = document.getElementById('cart-resumo');
  if (resumo && resumo.parentNode) resumo.parentNode.insertBefore(wrap, resumo);
  else tab.insertBefore(wrap, tab.firstChild);

  var input = document.getElementById('cf-cupom');
  var btnA  = document.getElementById('btn-aplicar-cupom');
  var btnR  = document.getElementById('btn-remover-cupom');
  var hint  = document.getElementById('cupom-hint');

function refreshUI(){
  if (CUPOM_ATIVO){
    input.value = CUPOM_ATIVO.code;
    input.disabled = true;
    btnA.style.display = 'none';
    btnR.style.display = '';
    hint.textContent = CUPOM_ATIVO.type==='percent'
      ? ('Aplicado: ' + Number(CUPOM_ATIVO.value||0) + '%')
      : ('Aplicado: -' + fmt(Number(CUPOM_ATIVO.value||0)));
    hint.style.display = 'block';            // << mostra na segunda linha
  } else {
    input.disabled = false;
    btnA.style.display = '';
    btnR.style.display = 'none';
    hint.textContent = '';
    hint.style.display = 'none';             // << esconde quando vazio
  }
}

  btnA.addEventListener('click', function(){
    var code = (input.value||'').trim();
    if (!code){ alert('Digite um cupom.'); input.focus(); return; }
    var c = findCoupon(code);
    if (!c){ alert('Cupom inválido.'); input.focus(); return; }
    setActiveCoupon(c); refreshUI();
  });
  btnR.addEventListener('click', function(){ setActiveCoupon(null); refreshUI(); });

  if (CUPOM_ATIVO && CUPOM_ATIVO.code) input.value = CUPOM_ATIVO.code;
  refreshUI();
}


  
/* ========= UI da Entrega (aba Finalizar) ========= */
function ensureBairroUI(){
  if (!TAXAS_ENTREGA || !TAXAS_ENTREGA.length) return; // nada a montar
  var tab = document.getElementById('tab-finalizar') ||
            document.getElementById('carrinho-flutuante') ||
            document.body;
  if (!tab) return;

  var wrap = document.getElementById('entrega-bairro-wrap');
  if (!wrap){
    wrap = document.createElement('div');
    wrap.id = 'entrega-bairro-wrap';
    wrap.style.margin = '12px 0 8px';
    wrap.innerHTML =
      '<label for="cf-bairro" style="display:block;margin-bottom:6px;font-weight:600">Entrega</label>'+
      '<select id="cf-bairro" style="width:100%;padding:8px;border-radius:8px;border:1px solid #e5e7eb">'+
      '  <option value="">Selecione a entrega...</option>'+
      '</select>';
    var resumo = document.getElementById('cart-resumo');
    if (resumo && resumo.parentNode) resumo.parentNode.insertBefore(wrap, resumo.nextSibling);
    else tab.appendChild(wrap);
  }

  var sel = document.getElementById('cf-bairro');
  if (!sel) return;

  var html =
    '<option value="">Selecione a entrega...</option>' +
    '<option value="Retirar" data-valor="0" data-retirar="1">Retirar no balcão — sem taxa</option>';
  for (var i=0;i<TAXAS_ENTREGA.length;i++){
    var t = TAXAS_ENTREGA[i];
    html += '<option value="'+escapeHTML(t.bairro)+'" data-valor="'+t.valor+'">'+escapeHTML(t.bairro)+' — '+fmt(t.valor)+'</option>';
  }
  sel.innerHTML = html;

  // restaura seleção salva (inclui "Retirar")
  try{
    var dados = JSON.parse(localStorage.getItem('dadosCliente')||'{}');
    if (dados && dados.bairro){
      if (dados.bairro === 'Retirar'){ sel.value = 'Retirar'; }
      else {
        for (var j=0;j<TAXAS_ENTREGA.length;j++){
          if (TAXAS_ENTREGA[j].bairro === dados.bairro){ sel.value = dados.bairro; break; }
        }
      }
    }
  }catch(_){}

  function toggleEndereco(){
    var opt = sel.selectedOptions && sel.selectedOptions[0];
    var isRetirar = !!(opt && opt.dataset && opt.dataset.retirar === '1');
    var end = document.getElementById('cf-endereco');
    var cont = end && (end.closest && end.closest('.field') || end.parentElement);
    if (cont) cont.style.display = isRetirar ? 'none' : '';
  }

  sel.onchange = function(){ salvarForm(); atualizarResumoFinalizar(); toggleEndereco(); };
  toggleEndereco();
}
function getBairroSelecionado(){
  var sel = document.getElementById('cf-bairro');
  var bairro = (sel && sel.value) || '';
  var taxa = 0, retirar = false;

  if (sel && sel.selectedOptions && sel.selectedOptions[0]){
    var opt = sel.selectedOptions[0];
    if (opt.dataset.retirar === '1'){ retirar = true; bairro = 'Retirar'; taxa = 0; }
  }

  if (!retirar && bairro){
    for (var i=0;i<TAXAS_ENTREGA.length;i++){
      if (TAXAS_ENTREGA[i].bairro === bairro){ taxa = Number(TAXAS_ENTREGA[i].valor||0); break; }
    }
    if (!taxa && sel && sel.selectedOptions && sel.selectedOptions[0]){
      taxa = Number(sel.selectedOptions[0].getAttribute('data-valor')||0);
    }
  }
  return { bairro:bairro, taxa:taxa, retirar:retirar };
}

/* ========= Carrinho ========= */
function toggleCarrinho(){
  var el = document.getElementById('carrinho-flutuante');
  if (!el) return;
  var open = !el.classList.contains('aberto');
  el.classList.toggle('aberto', open);
  el.classList.toggle('fechado', !open);
  toggleOverlay(open);
}
function fecharCarrinho(){
  var el = document.getElementById('carrinho-flutuante');
  if (el){ el.classList.remove('aberto'); el.classList.add('fechado'); toggleOverlay(false); }
}
function atualizarBadge(totalItens){
  var b1 = document.getElementById('contador-itens');
  var b2 = document.getElementById('badge-itens');
  if (b1) b1.textContent = totalItens;
  if (b2) b2.textContent = totalItens;
}
function atualizarResumoFinalizar(){
  var subtotal = 0, qtd = 0;
  for (var i=0;i<carrinho.length;i++){
    subtotal += Number(carrinho[i].preco||0) * Number(carrinho[i].quantidade||1);
    qtd      += Number(carrinho[i].quantidade||0);
  }
  var sel = getBairroSelecionado();
  var el  = document.getElementById('cart-resumo'); if (!el) return;

  var desconto = calcDiscount(subtotal);
  var total = subtotal - desconto + Number(sel.taxa||0);

  var partes = [
    'Itens: <strong>'+qtd+'</strong>',
    'Subtotal: <strong>'+fmt(subtotal)+'</strong>'
  ];
  if (CUPOM_ATIVO && desconto>0){
    partes.push('Desconto ('+escapeHTML(CUPOM_ATIVO.code)+'): <strong>-'+fmt(desconto)+'</strong>');
  }
  if (sel.bairro){
    if (sel.bairro === 'Retirar'){
      partes.push('Retirada no balcão: <strong>sem taxa</strong>');
    } else {
      partes.push('Entrega ('+escapeHTML(sel.bairro)+'): <strong>'+fmt(sel.taxa)+'</strong>');
    }
  }
  partes.push('Total: <strong>'+fmt(total)+'</strong>');
  el.innerHTML = partes.map(p => `<span class="resumo-item">${p}</span>`).join('');
}
function atualizarCarrinho(){
  save();
  var totalItens = 0;
  for (var i=0;i<carrinho.length;i++) totalItens += (Number(carrinho[i].quantidade)||0);
  atualizarBadge(totalItens);

  var carrinhoDiv = document.getElementById('carrinho') || document.getElementById('carrinho-lista');
  if (!carrinhoDiv) return;

  carrinhoDiv.innerHTML = "<h3>Carrinho:</h3>";

  if (!carrinho.length){
    carrinhoDiv.innerHTML += "<p>Seu carrinho está vazio.</p>";
    var total0 = document.getElementById('carrinho-total');
    if (total0) total0.textContent = "Subtotal: " + fmt(0);
    atualizarResumoFinalizar();
    return;
  }

  var total = 0;
  for (var idx=0; idx<carrinho.length; idx++){
    var item = carrinho[idx];
    var qtd = Number(item.quantidade)||1;
    var sub = Number(item.preco||0) * qtd;
    total += sub;

    var opcoesHtml = (item.opcoes && item.opcoes.length)
      ? '<div class="muted" style="font-size:12px;margin-top:2px">'+item.opcoes.map(function(o){return '— '+escapeHTML(o);}).join('<br>')+'</div>' : '';
    var obsHtml = item.obs ? '<div class="muted" style="font-size:12px;margin-top:4px"><em>Obs:</em> '+escapeHTML(item.obs)+'</div>' : '';

    var row = document.createElement('div');
    row.className = 'item-carrinho';
    row.innerHTML =
      '<div>'+
        '<div><strong>'+escapeHTML(item.nome)+'</strong></div>'+
        opcoesHtml+obsHtml+
        '<div style="color:#ef4444;font-weight:800;margin-top:4px">'+fmt(sub)+'</div>'+
      '</div>'+
      '<div>'+
        '<div class="qtd">'+
          '<button aria-label="menos">−</button>'+
          '<input type="text" value="'+qtd+'" />'+
          '<button aria-label="mais">+</button>'+
        '</div>'+
        '<div style="text-align:right;margin-top:6px">'+
          '<button data-remove="'+idx+'" style="border:0;background:#fee2e2;color:#991b1b;border-radius:8px;padding:6px 8px;cursor:pointer">remover</button>'+
        '</div>'+
      '</div>';

    (function(index, rowEl, qtdAtual){
      var btnMenos = rowEl.querySelector('.qtd button:first-child');
      var input    = rowEl.querySelector('.qtd input');
      var btnMais  = rowEl.querySelector('.qtd button:last-child');
      function clamp(v){ v=parseInt(String(v).replace(/\D/g,''),10)||1; return Math.max(1, Math.min(999, v)); }
      if (btnMenos) btnMenos.addEventListener('click', function(){ carrinho[index].quantidade = clamp(qtdAtual-1); atualizarCarrinho(); });
      if (btnMais)  btnMais .addEventListener('click', function(){ carrinho[index].quantidade = clamp(qtdAtual+1); atualizarCarrinho(); });
      if (input)    input.addEventListener('input', function(){ carrinho[index].quantidade = clamp(this.value); atualizarCarrinho(); });
      var rm = rowEl.querySelector('[data-remove]');
      if (rm) rm.addEventListener('click', function(){ carrinho.splice(index,1); atualizarCarrinho(); });
    })(idx, row, qtd);

    carrinhoDiv.appendChild(row);
    carrinhoDiv.appendChild(document.createElement('hr'));
  }

  var totalEl = document.getElementById('carrinho-total');
  if (totalEl) totalEl.textContent = "Subtotal: " + fmt(total);
  atualizarResumoFinalizar();
}
function limparCarrinho(){ carrinho = []; atualizarCarrinho(); }

/* ========= ADICIONAR AO CARRINHO ========= */
function adicionarAoCarrinho(nome, preco, quantidade, meta){
  var qtd = Number(quantidade || 1);
  var opcoes = (meta && Object.prototype.toString.call(meta.opcoes)==='[object Array]') ? meta.opcoes : [];
  var obs = meta && meta.obs || '';
  var key = String(nome)+'|'+JSON.stringify(opcoes)+'|'+String(obs);

  var existente = null;
  for (var i=0;i<carrinho.length;i++){ if (carrinho[i]._key === key){ existente = carrinho[i]; break; } }
  if (existente){
    existente.quantidade = Number(existente.quantidade || 0) + qtd;
  } else {
    carrinho.push({ nome:nome, preco:Number(preco), quantidade:qtd, opcoes:opcoes, obs:obs, _key:key });
  }

  atualizarCarrinho();

  if (window.matchMedia && window.matchMedia('(max-width:1023.98px)').matches){
    var el = document.getElementById('carrinho-flutuante');
    if (el){ el.classList.add('aberto'); el.classList.remove('fechado'); toggleOverlay(true); }
  }
}

/* ========= FORM (Finalizar) ========= */
var FORM_KEY = 'dadosCliente';
function salvarForm(){
  var sel = getBairroSelecionado();
  var dados = {
    nome: (document.getElementById('cf-nome')||{}).value || '',
    email:(document.getElementById('cf-email')||{}).value || '',
    whats:(document.getElementById('cf-whats')||{}).value || '',
    endereco:(document.getElementById('cf-endereco')||{}).value || '',
    pagto:(document.getElementById('cf-pagto')||{}).value || '',
    bairro: sel.bairro || '',
    taxaEntrega: Number(sel.taxa||0)
  };
  try{ localStorage.setItem(FORM_KEY, JSON.stringify(dados)); }catch(_){}
  return dados;
}
function carregarForm(){
  var dados = {};
  try{ dados = JSON.parse(localStorage.getItem(FORM_KEY) || '{}'); }catch(_){ dados = {}; }
  if (!dados) return;
  var f;
  if ((f=document.getElementById('cf-nome')))  f.value = dados.nome || '';
  if ((f=document.getElementById('cf-email'))) f.value = dados.email || '';
  if ((f=document.getElementById('cf-whats'))) f.value = dados.whats || '';
  if ((f=document.getElementById('cf-endereco'))) f.value = dados.endereco || '';
  if ((f=document.getElementById('cf-pagto'))) f.value = dados.pagto || '';
  if (dados.bairro && (f=document.getElementById('cf-bairro'))) f.value = dados.bairro;
}

/* ========= ENVIO ========= */
function enviarPedido(){
  if (!carrinho.length){ alert('Seu carrinho está vazio!'); return; }

  if (TAXAS_ENTREGA.length && !document.getElementById('cf-bairro')){ ensureBairroUI(); }

  var dados = salvarForm();

  if (TAXAS_ENTREGA.length && !dados.bairro){
    if (TAXAS_ENTREGA.length === 1){
      var unico = TAXAS_ENTREGA[0];
      var sel = document.getElementById('cf-bairro');
      if (sel) sel.value = unico.bairro;
      dados.bairro = unico.bairro;
      dados.taxaEntrega = Number(unico.valor||0);
      try{ localStorage.setItem(FORM_KEY, JSON.stringify(dados)); }catch(_){}
      atualizarResumoFinalizar();
    } else {
      try{ switchCartTab('finalizar'); }catch(_){}
      var s = document.getElementById('cf-bairro'); if (s) s.focus();
      alert('Selecione a Entrega para calcular a taxa.');
      return;
    }
  }

  if (!dados.nome || !dados.whats){
    alert('Informe pelo menos o Nome e o WhatsApp para finalizarmos 😊');
    return;
  }

  var subtotal = 0, msg = "Olá, quero fazer o seguinte pedido:\n\n";
  for (var i=0;i<carrinho.length;i++){
    var it = carrinho[i], q = Number(it.quantidade||1), pr = Number(it.preco||0);
    msg += '• '+it.nome+' - '+fmt(pr)+' x '+q+'\n';
    if (it.opcoes && it.opcoes.length){ for (var k=0;k<it.opcoes.length;k++) msg += '   - '+it.opcoes[k]+'\n'; }
    if (it.obs){ msg += '   - Obs: '+it.obs+'\n'; }
    subtotal += pr*q;
  }

  var desconto = calcDiscount(subtotal);
  if (CUPOM_ATIVO && desconto>0){
    var cupTxt = (CUPOM_ATIVO.type==='percent' ? (CUPOM_ATIVO.value+'%') : fmt(CUPOM_ATIVO.value));
    msg += '\nDesconto ('+CUPOM_ATIVO.code+'): -'+ (CUPOM_ATIVO.type==='percent' ? fmt(desconto) : fmt(desconto)) + ' ('+cupTxt+')\n';
  }

  if (dados.bairro){
    if (dados.bairro === 'Retirar'){
      msg += 'Retirada no balcão (sem taxa)\n';
    } else {
      msg += 'Entrega ('+dados.bairro+'): '+fmt(dados.taxaEntrega||0)+'\n';
    }
  }

  var total = subtotal - desconto + Number(dados.taxaEntrega||0);
  msg += '\nTotal: '+fmt(total)+'\n\n';

  msg += 'Dados para entrega:\n';
  msg += '• Nome: '+dados.nome+'\n';
  if (dados.email)   msg += '• E-mail: '+dados.email+'\n';
  msg += '• WhatsApp: '+dados.whats+'\n';
  if (dados.bairro === 'Retirar'){
    msg += '• Modalidade: Retirada no balcão\n';
  } else {
    if (dados.endereco) msg += '• Endereço: '+dados.endereco+'\n';
    if (dados.bairro)   msg += '• Entrega: '+dados.bairro+'\n';
  }
  if (dados.pagto)    msg += '• Pagamento: '+dados.pagto+'\n';
  if (CUPOM_ATIVO && CUPOM_ATIVO.code) msg += '• Cupom usado: '+CUPOM_ATIVO.code+'\n';

  var numero = getWhatsNumberFromWidget() || "5582991090858";
  window.open('https://wa.me/'+numero+'?text='+encodeURIComponent(msg), '_blank');

  limparCarrinho();
  try{ switchCartTab('itens'); fecharCarrinho(); }catch(_){}
}

/* ========= MENU & OVERLAY ========= */
function toggleMenu(open){
  var sidebar = document.getElementById('sidebarDrawer');
  if (!sidebar) return;
  var willOpen = (typeof open === 'boolean') ? open : !sidebar.classList.contains('aberta');
  sidebar.classList.toggle('aberta', willOpen);
  toggleOverlay(willOpen);
}
function toggleOverlay(show){
  var ov = document.getElementById('drawer-overlay');
  if (!ov) return;
  ov.classList.toggle('show', !!show);
}

/* ========= TABS ========= */
function switchCartTab(tab){
  var btns = document.querySelectorAll('#cart-tabs .tab-btn');
  for (var i=0;i<btns.length;i++){ btns[i].classList.toggle('active', btns[i].getAttribute('data-tab')===tab); }
  var t1 = document.getElementById('tab-itens');     if (t1) t1.classList.toggle('active', tab==='itens');
  var t2 = document.getElementById('tab-finalizar'); if (t2) t2.classList.toggle('active', tab==='finalizar');
  if (tab==='finalizar'){ atualizarResumoFinalizar(); carregarForm(); }
}

/* ========= BINDS ========= */
document.addEventListener('click', function(e){
  var a = e.target.closest ? e.target.closest('a[href*="#sacola"]') : null;
  if (a){ e.preventDefault(); toggleCarrinho(); }
}, {passive:false});

document.addEventListener('DOMContentLoaded', function(){
  var el;
  el = document.getElementById('fechar-carrinho'); if (el) el.addEventListener('click', fecharCarrinho);
  el = document.getElementById('btn-menu'); if (el) el.addEventListener('click', function(){ toggleMenu(); });
  el = document.getElementById('drawer-overlay'); if (el) el.addEventListener('click', function(){ toggleMenu(false); fecharCarrinho(); });
  document.addEventListener('keydown', function(e){ if (e.key==='Escape'){ toggleMenu(false); fecharCarrinho(); } });

  // Carrega taxas do widget e monta UI da entrega
  TAXAS_ENTREGA = getDeliveryFeesFromWidget() || [];
  ensureBairroUI();
  CUPONS_DISPONIVEIS = getCouponsFromWidget() || [];
  loadActiveCoupon();
  ensureCupomUI();
  atualizarResumoFinalizar();

  // tabs
  var tbs = document.querySelectorAll('#cart-tabs .tab-btn');
  for (var i=0;i<tbs.length;i++){
    (function(btn){ btn.addEventListener('click', function(){ switchCartTab(btn.getAttribute('data-tab')); }); })(tbs[i]);
  }
  el = document.getElementById('btn-ir-finalizar'); if (el) el.addEventListener('click', function(){ switchCartTab('finalizar'); });
  el = document.getElementById('btn-enviar-wa');    if (el) el.addEventListener('click', enviarPedido);

  // autosave dos campos (inclui cf-bairro)
  ['cf-nome','cf-email','cf-whats','cf-endereco','cf-pagto','cf-bairro'].forEach(function(id){
    var f = document.getElementById(id);
    if (f){ f.addEventListener('input', salvarForm); f.addEventListener('change', salvarForm); }
  });

  atualizarCarrinho();
  carregarForm();
  atualizarResumoFinalizar();

  // drenar itens clicados antes do carregamento
  if (Array.isArray(window.__pendingAdds) && window.__pendingAdds.length){
    var pend = window.__pendingAdds.splice(0);
    for (var i=0;i<pend.length;i++){ try{ window.adicionarAoCarrinho.apply(null, pend[i]); }catch(_){ } }
    try{ console.info('Carrinho: '+pend.length+' item(ns) adicionados após carregamento.'); }catch(_){}
  }

  // exportar helpers
  window.toggleCarrinho = toggleCarrinho;
  window.atualizarCarrinho = atualizarCarrinho;
  window.limparCarrinho = limparCarrinho;
  window.enviarPedido = enviarPedido;
  window.adicionarAoCarrinho = adicionarAoCarrinho;
  window.fecharCarrinho = fecharCarrinho;
  window.toggleMenu = toggleMenu;
  window.switchCartTab = switchCartTab;
});

})(); // IIFE

  document.addEventListener('DOMContentLoaded', function () {
    const headerRoot =
      document.querySelector('b\\:section#header') ||
      document.querySelector('.header.section') ||
      document.querySelector('.header');

    if (!headerRoot) return;

    /* ====== STATUS ====== */

(function(){
  'use strict';

  /* ---------- utils ---------- */
  function norm(s){
    return String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  }
  // unifica nomes de dias (com/sem "-feira", abreviações)
  function canonDay(s){
    const n = norm(s).replace(/\s*-\s*feira$/,'');
    if (/^dom/.test(n)) return 'domingo';
    if (/^seg/.test(n) || /^2a$/.test(n)) return 'segunda';
    if (/^ter/.test(n) || /^3a$/.test(n)) return 'terca';
    if (/^qua/.test(n) || /^4a$/.test(n)) return 'quarta';
    if (/^qui/.test(n) || /^5a$/.test(n)) return 'quinta';
    if (/^sex/.test(n) || /^6a$/.test(n)) return 'sexta';
    if (/^sab/.test(n)) return 'sabado';
    return n;
  }
  function parseTime(s){
    const m=/(\d{1,2}):(\d{2})/.exec(String(s||'')); if(!m) return null;
    const h=+m[1], mi=+m[2]; return h*60+mi;
  }
  function fmtHM(mins){
    const h=Math.floor(mins/60), m=mins%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
  }
  function todayKey(d=new Date()){
    return canonDay(new Intl.DateTimeFormat('pt-BR',{weekday:'long'}).format(d));
  }

  /* ---------- lê a tabela .open-hours ---------- */
  function getSchedule(){
    const rows=[...document.querySelectorAll('.open-hours tr')];
    if(!rows.length) return null;
    const map={};
    rows.forEach(tr=>{
      const day = canonDay(tr.children?.[0]?.textContent || '');
      const txt = (tr.children?.[1]?.textContent || '').trim();
      const low = norm(txt);
      // fechado: vazio, "Fechado", traço, ou 00:00 às 00:00
      if(!txt || /fechado|—|^-+$/.test(low)){ map[day]=null; return; }
      const mm=/(\d{1,2}:\d{2})\s*às\s*(\d{1,2}:\d{2})/i.exec(txt);
      if(!mm){ map[day]=null; return; }
      const a=parseTime(mm[1]), b=parseTime(mm[2]);
      if(a===null||b===null||a===b){ map[day]=null; return; } // 00:00–00:00 => fechado
      map[day]={start:a,end:b,overnight:(b<a)}; // overnight: ex 20:00–02:00
    });
    return map;
  }

  /* ---------- estado aberto/fechado ---------- */
  function calcNextOpenText(sched, now){
    const key=todayKey(now); const slot=sched[key];
    const mins=now.getHours()*60+now.getMinutes();
    if (slot && !slot.overnight && mins < slot.start){
      return 'Abrimos às ' + fmtHM(slot.start);
    }
    for (let i=1;i<=7;i++){
      const d=new Date(now); d.setDate(now.getDate()+i);
      const k=todayKey(d); const s=sched[k];
      if (s){ return (i===1 ? 'Amanhã' : 'Em breve') + ' às ' + fmtHM(s.start); }
    }
    return '';
  }
  function isOpenNow(){
    const sched=getSchedule(); if(!sched) return {open:null,nextText:''};
    const now=new Date(); const key=todayKey(now); const slot=sched[key];
    if(!slot) return {open:false,nextText:calcNextOpenText(sched, now)};
    const mins=now.getHours()*60+now.getMinutes();
    let open=false;
    if (slot.overnight){ open = (mins>=slot.start || mins<=slot.end); }
    else { open = (mins>=slot.start && mins<=slot.end); }
    return {open,nextText: open ? '' : calcNextOpenText(sched, now)};
  }

  /* ---------- UI: selo no header ---------- */
  function updateHeaderPill(){
    const headerRoot =
      document.querySelector('b\\:section#header') ||
      document.querySelector('.header.section') ||
      document.querySelector('.header');
    if (!headerRoot) return;
    const slot=headerRoot.querySelector('.status-slot');
    if(!slot) return;
    const {open}=isOpenNow();
    const pill=document.createElement('span');
    pill.className='pill'+(open ? '' : ' closed');
    pill.textContent=open ? 'DELIVERY ABERTO!' : 'DELIVERY FECHADO!';
    slot.innerHTML=''; slot.appendChild(pill);
  }

  /* ---------- UI: bloquear finalização fora do horário ---------- */
  function enforceCheckoutGuard(){
    const {open}=isOpenNow();
    const send=document.getElementById('btn-enviar-wa');
    const go=document.getElementById('btn-ir-finalizar');

    if (send){ send.disabled=!open; send.style.opacity=open?'':'0.6'; send.title=open?'':'Estamos fechados no momento'; }
    if (go){   go.disabled=!open;   go.style.opacity=open?'':'0.6';   go.title=open?'':'Estamos fechados no momento'; }

    const wrap=document.getElementById('tab-finalizar') || document.getElementById('carrinho-flutuante');
    let banner=document.getElementById('closed-banner');
    if (!open){
      if (!banner && wrap){
        banner=document.createElement('div');
        banner.id='closed-banner';
        banner.style.cssText='background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:10px;padding:10px;margin:8px 0;font-weight:600';
        banner.textContent='Estamos fechados agora. Faça seu pedido no horário de atendimento.';
        wrap.insertBefore(banner, wrap.firstChild);
      }
    } else if (banner){ banner.remove(); }
  }

  // trava via captura (garante bloqueio mesmo se alguém tentar burlar)
  document.addEventListener('click', function(e){
    const send = e.target.closest?.('#btn-enviar-wa');
    const go   = e.target.closest?.('#btn-ir-finalizar');
    if (send || go){
      const {open,nextText}=isOpenNow();
      if (!open){
        e.preventDefault(); e.stopImmediatePropagation();
        alert('Estamos fechados no momento. ' + (nextText || 'Volte no nosso horário de atendimento.'));
      }
    }
  }, true);





  
// ================================================================
// Helpers: próxima abertura (DIA + HORÁRIO)
// Requer: getSchedule(), todayKey(), fmtHM() já definidos no seu STATUS
// ================================================================
function displayDayName(key){
  const map = {
    domingo:'Domingo', segunda:'Segunda', terca:'Terça',
    quarta:'Quarta',  quinta:'Quinta',   sexta:'Sexta',
    sabado:'Sábado'
  };
  return map[key] || (key.charAt(0).toUpperCase()+key.slice(1));
}

function getNextOpenInfo(){
  const sched = getSchedule();
  if (!sched) return null;

  const now = new Date();
  const nowMins = now.getHours()*60 + now.getMinutes();
  const today = todayKey(now);
  const slot  = sched[today];

  function buildInfo(dayKey, dayOffset, startMins){
    return {
      isToday: dayOffset===0,
      isTomorrow: dayOffset===1,
      dayKey,
      dayName: displayDayName(dayKey),
      timeText: fmtHM(startMins)
    };
  }

  // tentar hoje
  if (slot){
    if (!slot.overnight){
      if (nowMins < slot.start) return buildInfo(today, 0, slot.start);
    } else {
      // janela cruza a meia-noite (ex: 20:00–02:00). Se estamos fechados,
      // a próxima abertura é "hoje" às slot.start.
      if (nowMins <= slot.end || (nowMins > slot.end && nowMins < slot.start)){
        return buildInfo(today, 0, slot.start);
      }
    }
  }

  // procurar nos próximos dias
  for (let i=1;i<=7;i++){
    const d = new Date(now); d.setDate(now.getDate()+i);
    const k = todayKey(d);
    const s = sched[k];
    if (s) return buildInfo(k, i, s.start);
  }
  return null;
}

// ================================================================
// --- BANNER GLOBAL "DELIVERY FECHADO" (cores personalizadas) ---
// Substitui a sua versão antiga.
// ================================================================
function updateGlobalClosedBanner(){
  const { open } = isOpenNow();

  // Se aberto (true) ou indeterminado (null), remover banner
  if (open !== false){
    document.getElementById('delivery-alert')?.remove();
    return;
  }

  const info = getNextOpenInfo(); // {dayName, timeText, isToday, isTomorrow}
  let whenText = 'em breve.';
  if (info){
    const hint = info.isToday ? ' (hoje)' : (info.isTomorrow ? ' (amanhã)' : '');
    // se quiser tirar o "na", troque por "Abrimos " + info.dayName...
    whenText = `na ${info.dayName}${hint} às ${info.timeText}.`;
  }

  // cria / atualiza o banner
  let bar = document.getElementById('delivery-alert');
  if (!bar){
    bar = document.createElement('div');
    bar.id = 'delivery-alert';
    bar.setAttribute('role','status');
    bar.setAttribute('aria-live','polite');
    bar.style.cssText = [
      'position:sticky','top:0','z-index:9998',
      'background:#ff0000',            // sua cor de fundo
      'color:#fff',                     // cor do texto
      'border-bottom:1px solid #fecaca',// borda (ajuste se quiser)
      'padding:10px 12px','text-align:center',
      'font-weight:700','font-size:14px'
    ].join(';');

    // insere logo abaixo do header; fallback: topo do body
    const headerRoot =
      document.querySelector('b\\:section#header') ||
      document.querySelector('.header.section') ||
      document.querySelector('.header');
    if (headerRoot && headerRoot.parentNode){
      headerRoot.parentNode.insertBefore(bar, headerRoot.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  bar.textContent = `Estamos fechados agora. Abrimos ${whenText}`;
}


  


  
  function tick(){ updateHeaderPill(); enforceCheckoutGuard(); updateGlobalClosedBanner();}
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', tick);
  else tick();
  setInterval(tick, 60*1000);
})();


    /* ====== NOTIFICAÇÕES ====== */
    const notifSlot = headerRoot.querySelector('.notif-slot');
    const raw = notifSlot?.querySelector('.notif-content')?.innerHTML?.trim();

    if (notifSlot) {
      const btn = document.createElement('button');
      btn.className = 'icon-btn';
      btn.setAttribute('aria-label', 'Notificações');
      btn.title = 'Notificações';
      btn.innerHTML =
        '<svg class="icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
          '<path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"></path>' +
          '<path d="M15 17a3 3 0 1 1-6 0"></path>' +
        '</svg>';

      btn.addEventListener('click', () => {
        const id = 'notif-pop';
        let pop = document.getElementById(id);
        if (!pop) { pop = document.createElement('div'); pop.id = id; document.body.appendChild(pop); }
        pop.className = ''; // reset
        pop.innerHTML =
          (raw || 'Sem novidades no momento.') +
          '<div style="margin-top:10px;text-align:left">' +
            '<button style="border:0;background:#e5e7eb;border-radius:8px;padding:6px 10px;cursor:pointer" onclick="document.getElementById(\'notif-pop\').remove()">Fechar</button>' +
          '</div>';

        // Posiciona abaixo do botão
        const r = btn.getBoundingClientRect();
        pop.style.left = Math.max(12, r.left + window.scrollX - 150 + r.width/2) + 'px';
        pop.style.top  = (r.bottom + 8 + window.scrollY) + 'px';
        pop.style.minWidth = '260px';
        pop.style.maxWidth = '340px';
        pop.style.position = 'fixed';
        pop.style.zIndex = '10000';
        pop.style.background = 'var(--paper)';
        pop.style.color = 'var(--ink)';
        pop.style.border = '1px solid ' + (getComputedStyle(document.documentElement).getPropertyValue('--ring')||'#e5e7eb');
        pop.style.borderRadius = '12px';
        pop.style.boxShadow = 'var(--shadow)';
        pop.style.padding = '12px';
        pop.style.fontSize = '14px';
      });

      notifSlot.innerHTML = '';
      notifSlot.appendChild(btn);
    }
  });



(function(){
  const HOST_PRECO = /^(https?:)?\/\/(www\.)?preco\.blog/i;
  const HOST_OPCAO = /^(https?:)?\/\/(www\.)?opcao\.blog/i;
  const norm = u => String(u||'').replace(/^https?:\/\//i,'').replace(/\?m=\d+$/,'').replace(/\/$/,'');
  const BRtoNumber = s => {const t=String(s||'').replace(/[^\d,.-]/g,'').replace(/\.(?=\d{3}\b)/g,'').replace(',', '.'); const v=parseFloat(t); return isNaN(v)?0:v;};
  const fmt = v => 'R$ ' + Number(v||0).toFixed(2).replace('.', ',');

  function priceFromLink(l){
    if(!l) return null;
    let txt = '';
    if (l.type && /^R\$/i.test(l.type)) txt = l.type.trim();
    else if (l.title && /^R\$/i.test(l.title)) txt = l.title.trim();
    else { try{ const u=new URL(l.href); const v=u.searchParams.get('v')||u.searchParams.get('valor'); if(v) txt = /^R\$/i.test(v)?v:('R$ '+v);}catch(e){} }
    const num = BRtoNumber(txt);
    return isNaN(num)?null:{texto:(/^R\$/i.test(txt)?txt:fmt(num)), numero:num};
  }
  function extractPrice(entry){
    if(!entry || !entry.link) return null;
    let enc = entry.link.find(l => l.rel==='enclosure' && HOST_PRECO.test(l.href));
    if(!enc) enc = entry.link.find(l => HOST_PRECO.test(l.href));
    return priceFromLink(enc);
  }

  /** ==============================
   *  opcao.blog: grupos + limites
   *  ============================== */
  function parseOpcaoURL(href){
    try{
      const url   = new URL(href, location.origin);
      if (!HOST_OPCAO.test(url.href)) return null;

      const parts = url.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
      const group = decodeURIComponent(parts[0] || 'Opções').trim();
      const type  = (parts[1] || 'radio').toLowerCase(); // radio | check | select

      // limites
      let min = 0, max = Infinity;
      if (type === 'radio'){ min = 1; max = 1; }
      if (type === 'check'){
        const seg = parts[2] || '';
        if (/^\d+\+$/.test(seg)) { min = parseInt(seg,10); max = Infinity; }
        else if (/^\d+$/.test(seg)) { max = parseInt(seg,10); }
        if (url.searchParams.get('min')) min = parseInt(url.searchParams.get('min'),10);
        if (url.searchParams.get('max')) {
          const m = parseInt(url.searchParams.get('max'),10);
          if (!Number.isNaN(m)) max = m;
        }
      }
      return { group, type, min, max };
    }catch(e){ return null; }
  }

// Lê itens do campo Mime e extrai o adicional
// Suporta: "Cebola0", "Tomate+2", "Carne:3", "Ervilhas + R$ 1,50"
function itemsFromMime(raw){
  return String(raw||'')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const m = s.match(/^(.+?)\s*(?:[:+]\s*)?(?:R?\$?\s*)?([0-9]+(?:[.,][0-9]{1,2})?)\s*$/);
      if (m) {
        const label = m[1].trim();
        const extra = BRtoNumber(m[2]);
        return { label, extra };
      }
      return { label: s, extra: 0 };
    });
}


  // Lê grupos/itens a partir dos links do post
  function extractOptions(entry){
    const out = [];
    if(!entry || !entry.link) return out;
    (entry.link||[]).forEach(l=>{
      const cfg = parseOpcaoURL(l.href);
      if (!cfg) return;
      const items = itemsFromMime(l.type||'');
      if (items.length) out.push({ ...cfg, items });
    });
    return out;
  }

  // Desenha os grupos na página do produto
  function renderOptions(container, groups){
    if (!groups.length) return;
    const box = container.querySelector('#extras-box') || container;
    const frag = document.createDocumentFragment();

    groups.forEach((g, gi)=>{
      const niceGroup = g.group.charAt(0).toUpperCase()+g.group.slice(1);
      const wrap = document.createElement('fieldset');
      wrap.className = 'extra-group';
      wrap.dataset.type = g.type;
      wrap.dataset.min  = String(g.min || 0);
      wrap.dataset.max  = Number.isFinite(g.max) ? String(g.max) : '';
      wrap.style.cssText = 'border:1px solid var(--ring);border-radius:12px;padding:12px;margin:10px 0;';

      const hintParts = [];
      if (g.type === 'radio') hintParts.push('(obrigatório)');
      if (g.type === 'check'){
        if (Number.isFinite(g.max)) hintParts.push(`Escolha até ${g.max}`);
        if (g.min > 0) hintParts.push(`mínimo ${g.min}`);
      }

      wrap.innerHTML =
        `<legend style="padding:0 6px;font-weight:800">${niceGroup} ` +
        `<span class="muted" style="font-size:12px">${hintParts.join(' ')}</span>` +
        `</legend>`;

      const list = document.createElement('div');
      list.style.display='flex';
      list.style.flexWrap='wrap';
      list.style.gap='16px';
      list.style.alignItems='center';

      const name = `opt-${gi}-${g.group.replace(/\W+/g,'-')}`;

      if (g.type==='select'){
        const sel = document.createElement('select');
        sel.name = name; sel.dataset.group = niceGroup;
        sel.style.cssText='height:40px;border:1px solid var(--ring);border-radius:10px;padding:0 10px;';
        const o0 = document.createElement('option'); o0.value=''; o0.textContent='Selecione';
        sel.appendChild(o0);
        g.items.forEach(it=>{
          const o = document.createElement('option');
          o.value = it.label;
          o.textContent = it.label + (it.extra>0?` (+${fmt(it.extra)})`:``);
          o.dataset.price = it.extra;
          sel.appendChild(o);
        });
        list.appendChild(sel);
      } else {
        g.items.forEach((it, ii)=>{
          const id = `${name}-${ii}`;
          const label = document.createElement('label');
          label.setAttribute('for', id);
          label.style.cssText='display:inline-flex;gap:8px;align-items:center;padding:6px 10px;border-radius:10px;background:#f3f4f6;cursor:pointer;';
          const inp = document.createElement('input');
          inp.type = (g.type==='check'?'checkbox':'radio');
          inp.name = name; inp.id=id;
          inp.required = (g.type==='radio');
          inp.dataset.group = niceGroup;
          inp.dataset.label = it.label;
          inp.dataset.price = it.extra;
          if (g.type==='radio' && ii===0) inp.checked = true;
          const span = document.createElement('span');
          span.textContent = it.label + (it.extra>0?` (+${fmt(it.extra)})`:``);
          label.appendChild(inp); label.appendChild(span);
          list.appendChild(label);
        });
      }

      function enforceLimits(){
        if (g.type !== 'check') return;
        const checks = Array.from(list.querySelectorAll('input[type="checkbox"]'));
        const sel = checks.filter(i => i.checked).length;
        const hasMax = Number.isFinite(g.max);
        if (hasMax && sel >= g.max){
          checks.forEach(i => { if (!i.checked) i.disabled = true; });
        } else {
          checks.forEach(i => i.disabled = false);
        }
      }
      list.addEventListener('change', enforceLimits);
      enforceLimits();

      wrap.appendChild(list);
      frag.appendChild(wrap);
    });

    box.innerHTML = '';
    box.appendChild(frag);
  }

  // Coleta selecionados + total de acréscimos + valida mínimos
  function collectSelected(container){
    const box = container.querySelector('#extras-box') || container;
    const result = { list:[], extra:0, valid:true, errors:[] };
    if (!box) return result;

    const groups = Array.from(box.querySelectorAll('fieldset.extra-group'));
    groups.forEach(fs=>{
      const type = fs.dataset.type;
      const min  = parseInt(fs.dataset.min||'0',10) || 0;
      const legend = fs.querySelector('legend')?.textContent?.trim() || 'Opção';

      if (type === 'radio'){
        const sel = fs.querySelector('input[type="radio"]:checked');
        if (!sel) { result.valid = false; result.errors.push(`${legend}: obrigatório`); return; }
        const price = Number(sel.dataset.price||0);
        const label = sel.dataset.label || sel.value || '';
        result.list.push(`${(sel.dataset.group||'Opção')}: ${label}${price>0?` (+${fmt(price)})`:''}`);
        result.extra += price;
        return;
      }

      if (type === 'check'){
        const checks = Array.from(fs.querySelectorAll('input[type="checkbox"]'));
        const selected = checks.filter(i=>i.checked);
        if (min > 0 && selected.length < min){
          result.valid = false; result.errors.push(`${legend}: mínimo ${min}`);
        }
        selected.forEach(i=>{
          const price = Number(i.dataset.price||0);
          const label = i.dataset.label || '';
          result.list.push(`${(i.dataset.group||'Opção')}: ${label}${price>0?` (+${fmt(price)})`:''}`);
          result.extra += price;
        });
        return;
      }

      if (type === 'select'){
        const sel = fs.querySelector('select');
        if (sel && sel.value){
          const opt = sel.options[sel.selectedIndex];
          const price = Number(opt?.dataset?.price||0);
          result.list.push(`${(sel.dataset.group||'Opção')}: ${opt.textContent}`);
          result.extra += price;
        } else if (min > 0){
          result.valid = false; result.errors.push(`${legend}: selecione uma opção`);
        }
      }
    });

    return result;
  }

  async function loadEntries(){
    const res = [];
    try{
      const [p,g] = await Promise.all([
        fetch('/feeds/posts/default?alt=json&max-results=500').then(r=>r.json()).catch(()=>null),
        fetch('/feeds/pages/default?alt=json&max-results=500').then(r=>r.json()).catch(()=>null)
      ]);
      if (p && p.feed && p.feed.entry) res.push(...p.feed.entry);
      if (g && g.feed && g.feed.entry) res.push(...g.feed.entry);
    }catch(e){}
    return res;
  }

  document.addEventListener('DOMContentLoaded', async function(){
    const entries = await loadEntries();
    const byUrl   = href => entries.find(e => (e.link||[]).some(l => l.rel==='alternate' && norm(l.href)===norm(href)));
    const byTitle = t    => entries.find(e => e.title && e.title.$t && e.title.$t.trim() === String(t||'').trim());

    // INDEX
    document.querySelectorAll('.card.produto').forEach(card=>{
      const nome = (card.getAttribute('data-nome') || card.querySelector('.title')?.textContent || '').trim();
      const link = card.getAttribute('data-link') || card.querySelector('.link-post')?.href;
      const entrada = (link && byUrl(link)) || (nome && byTitle(nome));
      if (!entrada) return;
      const price = extractPrice(entrada);
      if (price){ const out = card.querySelector('.preco-produto'); if (out) out.textContent = price.texto; }
      const btn = card.querySelector('.add-carrinho');
      if (btn && price){ btn.addEventListener('click', ()=>{ adicionarAoCarrinho(nome, price.numero, 1, {opcoes:[], obs:''}); }); }
    });

    // ITEM
    const produtoIn = document.getElementById('produto-in');
    if (produtoIn){
      const nome = (produtoIn.getAttribute('data-nome') || produtoIn.querySelector('.nome-produto')?.textContent || '').trim();
      const link = produtoIn.getAttribute('data-link') || location.href;
      const entrada = byUrl(link) || byTitle(nome);

      if (entrada){
        const price = extractPrice(entrada);
        if (price){
          produtoIn.setAttribute('data-preco', price.numero.toFixed(2));
          const out = produtoIn.querySelector('.preco-produto'); if (out) out.textContent = price.texto;
        }
        const groups = extractOptions(entrada);
        renderOptions(produtoIn, groups);
      }

      const qtdEl=document.getElementById('qtd'), menos=document.getElementById('menos'), mais=document.getElementById('mais');
      const clamp=v=>{v=parseInt(String(v).replace(/\D/g,''),10)||1;return Math.max(1,Math.min(999,v));};
      menos && menos.addEventListener('click', ()=>{ qtdEl.value=clamp((qtdEl.value||1)-1); });
      mais  && mais .addEventListener('click', ()=>{ qtdEl.value=clamp((qtdEl.value||1)-(-1)); });
      qtdEl && qtdEl.addEventListener('input', ()=>{ qtdEl.value=clamp(qtdEl.value); });

      const btnAdd = produtoIn.querySelector('.add-carrinho');
      if (btnAdd){
        btnAdd.addEventListener('click', ()=>{
          const nomeFinal  = (produtoIn.getAttribute('data-nome') || produtoIn.querySelector('.nome-produto')?.textContent || '').trim();
          const precoBase  = parseFloat(produtoIn.getAttribute('data-preco') || '0')||0;
          const qtd        = clamp((qtdEl?.value) || 1);
          if (!nomeFinal) return;

          const sel = collectSelected(produtoIn);
          if (!sel.valid){
            alert('Selecione as opções obrigatórias: \n- ' + sel.errors.join('\n- '));
            return;
          }
          const obsVal = (document.getElementById('obs')?.value || '').trim();
          const precoFinal = (precoBase + sel.extra);

          adicionarAoCarrinho(nomeFinal, precoFinal, qtd, { opcoes: sel.list, obs: obsVal });
        });
      }
    }
  });
})();



(function () {
  function enhanceAll() {
    // Procura seção Ads se existir, senão aplica no documento inteiro
    var root = document.getElementById('Ads') || document.querySelector('[id*="Ads"]') || document;

    // Pega todos os widgets de imagem
    var widgets = root.querySelectorAll('.widget.Image, .widget[type="Image"]');
    widgets.forEach(function (w) {
      if (w.dataset.adProcessed === '1') return;

      var content = w.querySelector('.widget-content');
      var img = content && content.querySelector('img');
      if (!content || !img) return;

      // transforma em card
      content.classList.add('ad-card');
      img.classList.add('ad-img');

      // remove <br> solto
      content.querySelectorAll('br').forEach(function (br){ br.remove(); });

      // badge Promoção
      if (!content.querySelector('.ad-badge')) {
        var badge = document.createElement('span');
        badge.className = 'ad-badge';
        badge.textContent = 'Promoção';
        content.appendChild(badge);
      }

      // botão fechar
      if (!content.querySelector('.ad-close')) {
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ad-close';
        closeBtn.setAttribute('aria-label','Fechar anúncio');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function(){
          if (w && w.parentNode) w.parentNode.removeChild(w);
        });
        content.appendChild(closeBtn);
      }

      // mover título para dentro do card
      var title = w.querySelector('h2, .title');
      if (title) {
        title.classList.add('ad-title');
        content.insertBefore(title, content.firstChild);
      }

      // legenda vira descrição
      var caption = content.querySelector('.caption');
      if (caption) caption.classList.add('ad-desc');

      // CTA "Ver mais" com link do widget
      if (!content.querySelector('.ad-btn')) {
        var body = document.createElement('div');
        body.className = 'ad-body';
        if (title) body.appendChild(title);
        if (caption) body.appendChild(caption);

        var imgLink = content.querySelector('a[href]');
        var href = (imgLink && imgLink.getAttribute('href')) || '#';

        var cta = document.createElement('a');
        cta.className = 'ad-btn';
        cta.textContent = 'Ver mais';
        cta.href = href;
        cta.rel = 'noopener';
        body.appendChild(cta);

        content.appendChild(body);
      }

      w.dataset.adProcessed = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }
  window.addEventListener('load', enhanceAll);

  new MutationObserver(function(muts){
    for (var i=0;i<muts.length;i++){
      if (muts[i].addedNodes && muts[i].addedNodes.length){ enhanceAll(); break; }
    }
  }).observe(document.body, {subtree:true, childList:true});
})();
//]]>
