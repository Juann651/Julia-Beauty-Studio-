const DB_KEY = 'julia_beauty_bookings_v3';
const ADMIN_PW = 'julia2026';
const SVCS = [
    { id: 'chapinha', name: 'Chapinha', icon: '', dur: '40 min', price: 'R$ 45,00', desc: 'Finalização lisa, alinhada e com brilho.' },
    { id: 'escova', name: 'Escova', icon: '', dur: '50 min', price: 'R$ 55,00', desc: 'Escova modelada para um acabamento elegante.' },
    { id: 'hidratacao', name: 'Hidratação', icon: '', dur: '60 min', price: 'R$ 80,00', desc: 'Tratamento para maciez, brilho e saúde dos fios.' },
    { id: 'coloracao', name: 'Coloração', icon: '', dur: '120 min', price: 'A consultar', desc: 'Renove a cor com técnica e cuidado.' },
    { id: 'luzes', name: 'Luzes', icon: '', dur: '180 min', price: 'A consultar', desc: 'Iluminação sofisticada para os cabelos.' },
    { id: 'progressiva', name: 'Progressiva', icon: '', dur: '180 min', price: 'A consultar', desc: 'Alinhamento capilar com efeito duradouro.' },
    { id: 'penteado', name: 'Penteados', icon: '', dur: '90 min', price: 'A consultar', desc: 'Festas, noivas e eventos especiais.' },
    { id: 'pele', name: 'Limpeza de pele', icon: '', dur: '70 min', price: 'R$ 120,00', desc: 'Cuidado facial para uma pele mais limpa e leve.' },
    { id: 'sobrancelha', name: 'Design de sobrancelha', icon: '', dur: '30 min', price: 'R$ 35,00', desc: 'Design personalizado para valorizar o olhar.' },
    { id: 'henna', name: 'Henna', icon: '', dur: '40 min', price: 'R$ 45,00', desc: 'Preenchimento com efeito natural.' },
    { id: 'cilios', name: 'Extensão de cílios', icon: '', dur: '120 min', price: 'R$ 150,00', desc: 'Volume e curvatura para realçar o olhar.' },
    { id: 'massagem', name: 'Massagem relaxante', icon: '', dur: '60 min', price: 'R$ 110,00', desc: 'Relaxamento e bem-estar para o corpo.' },
    { id: 'drenagem', name: 'Drenagem linfática', icon: '', dur: '60 min', price: 'R$ 120,00', desc: 'Técnica corporal para leveza e cuidado.' },
    { id: 'depilacao', name: 'Depilação', icon: '', dur: '40 min', price: 'A consultar', desc: 'Procedimento cuidadoso e higiênico.' },
    { id: 'maquiagem', name: 'Maquiagem', icon: '', dur: '75 min', price: 'R$ 130,00', desc: 'Produção para eventos, fotos e ocasiões especiais.' }
];
const CATS = [
    ['Cabelo', 'imagens/cabelo.jpg', 'Chapinha, escova, hidratação, coloração, luzes, progressiva e penteados.'],
    ['Olhar', 'imagens/olhar.jpg', 'Design de sobrancelha, henna e extensão de cílios com acabamento delicado.'],
    ['Estética', 'imagens/estetica.jpg', 'Limpeza de pele, massagem relaxante, drenagem linfática e depilação.'],
    ['Make', 'imagens/make.jpg', 'Maquiagem para festas, fotos, formaturas, noivas e momentos especiais.'],
    ['Noivas', 'imagens/noivas.jpg', 'Penteados e produção para um dia inesquecível.'],
    ['Experiência', 'imagens/experiencia.jpg', 'Atendimento agendado, ambiente limpo e cuidado em cada detalhe.']
];
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
let S = { svc: null, date: null, time: null }, calY = new Date().getFullYear(), calM = new Date().getMonth(), admAuthed = false, filter = 'all';
function $(id) { return document.getElementById(id) }
function dKey(d) { return d instanceof Date ? d.toISOString().slice(0, 10) : d }
function load() { try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]') } catch { return [] } }
function save(v) { localStorage.setItem(DB_KEY, JSON.stringify(v)) }
function genId() { return 'JB-' + Math.floor(1000 + Math.random() * 9000) }
function booked(date) { return load().filter(b => b.date === date && b.status !== 'cancelled').map(b => b.time) }
function renderServiceCards() { $('servicesCards').innerHTML = CATS.map(c => `<article class="service"><div class="ico"><img src="${c[1]}" alt="${c[0]}" /></div><div><h3>${c[0]}</h3><p>${c[2]}</p></div></article>`).join('') }
function initSvcs() { $('svcGrid').innerHTML = SVCS.map(s => `<button class="pick" id="pick-${s.id}" onclick="pickSvc('${s.id}')"><i>${s.icon}</i><h4>${s.name}</h4><small>${s.dur}</small><span class="price">${s.price}</span></button>`).join('') }
function pickSvc(id) { S.svc = SVCS.find(x => x.id === id); document.querySelectorAll('.pick').forEach(e => e.classList.remove('sel')); $('pick-' + id).classList.add('sel'); $('next1').disabled = false }
function goStep(n) { if (n === 2 && !S.svc) return; if (n === 3 && (!S.date || !S.time)) return;[1, 2, 3, 4].forEach(i => { $('p' + i).classList.toggle('active', i === n); let s = $('si' + i); s.classList.remove('active', 'done'); if (i === n) s.classList.add('active'); else if (i < n) s.classList.add('done') }); if (n === 3) summary(); $('agendar').scrollIntoView({ behavior: 'smooth', block: 'start' }) }
function drawCal() { $('calTitle').textContent = MONTHS[calM] + ' ' + calY; let g = $('calGrid'); g.innerHTML = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => `<div class="dn">${d}</div>`).join(''); let by = {}; load().filter(b => b.status !== 'cancelled').forEach(b => { (by[b.date] || (by[b.date] = [])).push(b.time) }); let first = new Date(calY, calM, 1), dow = first.getDay(), dim = new Date(calY, calM + 1, 0).getDate(), today = new Date(); today.setHours(0, 0, 0, 0); for (let i = 0; i < dow; i++)g.innerHTML += '<button class="day empty"></button>'; for (let d = 1; d <= dim; d++) { let dt = new Date(calY, calM, d), dk = dKey(dt), past = dt < today, sun = dt.getDay() === 0, full = (by[dk] || []).length >= SLOTS.length, cls = 'day'; if (past || sun || full) cls += ' off'; if (dt.getTime() === today.getTime()) cls += ' today'; if (S.date && dKey(S.date) === dk) cls += ' sel'; if ((by[dk] || []).length && !full && !past && !sun) cls += ' dot'; g.innerHTML += `<button class="${cls}" ${past || sun || full ? 'disabled' : ''} onclick="pickDate(${calY},${calM},${d})">${d}</button>` } }
function pickDate(y, m, d) { S.date = new Date(y, m, d); S.time = null; drawCal(); drawSlots(); $('next2').disabled = true }
function drawSlots() { let gr = $('slotsGrid'); if (!S.date) { gr.innerHTML = '<div class="empty-msg">Selecione uma data no calendário.</div>'; return } let dk = dKey(S.date), b = booked(dk); $('slotsTitle').textContent = S.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); if (SLOTS.every(s => b.includes(s))) { gr.innerHTML = '<div class="empty-msg">Sem horários disponíveis neste dia.</div>'; return } gr.innerHTML = SLOTS.map(s => `<button class="slot ${S.time === s ? 'sel' : ''}" ${b.includes(s) ? 'disabled' : ''} onclick="pickSlot('${s}')">${s}</button>`).join('') }
function pickSlot(t) { S.time = t; drawSlots(); $('next2').disabled = false }
function summary() { let dt = S.date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }); $('summary').innerHTML = `<span>${S.svc.icon} <b>${S.svc.name}</b></span><span>${S.svc.price}</span><span>${dt}</span><span>${S.time}</span>` }
function confirmBooking() { let name = $('cName').value.trim(), phone = $('cPhone').value.trim(), email = $('cEmail').value.trim(), notes = $('cNotes').value.trim(); if (!name) return alert('Informe seu nome.'); if (!phone) return alert('Informe seu telefone.'); if (booked(dKey(S.date)).includes(S.time)) { alert('Esse horário acabou de ser ocupado. Escolha outro.'); goStep(2); return } let id = genId(), b = { id, service: S.svc.name, icon: S.svc.icon, price: S.svc.price, date: dKey(S.date), time: S.time, name, phone, email, notes, status: 'pending', createdAt: new Date().toISOString() }; let all = load(); all.push(b); save(all); let date = S.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); $('confDetails').innerHTML = `<div><span>Serviço</span><b>${b.icon} ${b.service}</b></div><div><span>Valor</span><b>${b.price}</b></div><div><span>Data</span><b>${date}</b></div><div><span>Horário</span><b>${b.time}</b></div><div><span>Cliente</span><b>${b.name}</b></div><div><span>Código</span><b class="code">${b.id}</b></div>`; goStep(4); drawCal() }
function resetFlow() { S = { svc: null, date: null, time: null };['cName', 'cPhone', 'cEmail', 'cNotes'].forEach(id => $(id).value = ''); document.querySelectorAll('.pick').forEach(e => e.classList.remove('sel')); $('next1').disabled = true; $('next2').disabled = true; goStep(1) }
function openAdmin() { $('adminModal').classList.add('open'); if (admAuthed) renderAdmin() } function closeAdmin() { $('adminModal').classList.remove('open') } function checkAdmin() { if ($('admPw').value === ADMIN_PW) { admAuthed = true; $('admLogin').style.display = 'none'; $('admPanel').style.display = 'block'; renderAdmin() } else $('admErr').style.display = 'block' }
function setFilter(f, el) { filter = f; document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active')); el.classList.add('active'); renderAdmin() }
function renderAdmin() { let q = ($('admSearch')?.value || '').toLowerCase(); let list = load().filter(b => (filter === 'all' || b.status === filter) && (!q || b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))).sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)); $('admList').innerHTML = list.length ? list.map(b => `<div class="adm-row"><div><b>${b.id}</b> · ${b.icon} ${b.service}<br><small>${b.date} às ${b.time} · ${b.name} · ${b.phone} · ${b.status}</small></div><div class="adm-actions"><button class="mini neutral" onclick="statusAdm('${b.id}','confirmed')">Confirmar</button><button class="mini ok" onclick="statusAdm('${b.id}','done')">Concluir</button><button class="mini bad" onclick="statusAdm('${b.id}','cancelled')">Cancelar</button><button class="mini" onclick="delAdm('${b.id}')">Excluir</button></div></div>`).join('') : '<div class="empty-msg">Nenhum agendamento encontrado.</div>' }
function statusAdm(id, st) { let all = load(); let b = all.find(x => x.id === id); if (b) b.status = st; save(all); renderAdmin(); drawCal() } function delAdm(id) { if (confirm('Excluir este agendamento?')) { save(load().filter(b => b.id !== id)); renderAdmin(); drawCal() } }
$('prevM').onclick = () => { calM--; if (calM < 0) { calM = 11; calY-- } drawCal() }; $('nextM').onclick = () => { calM++; if (calM > 11) { calM = 0; calY++ } drawCal() }; $('menu').onclick = () => $('mobile').classList.toggle('open'); document.querySelectorAll('.mobile a').forEach(a => a.onclick = () => $('mobile').classList.remove('open'));
renderServiceCards(); initSvcs(); drawCal();

const STATUS_LABEL = { pending: '⏳ Pendente', confirmed: '✅ Confirmado', done: '🎉 Concluído', cancelled: '❌ Cancelado' };
const STATUS_COLOR = { pending: '#c99545', confirmed: '#16a34a', done: '#d94f86', cancelled: '#b91c1c' };
function lookupBooking() {
    const q = ($('lookupInput').value || '').trim().toLowerCase();
    const out = $('lookupResult');
    if (q.length < 2) { out.innerHTML = ''; return; }
    const results = load().filter(b =>
        b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)
    );
    if (!results.length) {
        out.innerHTML = '<div class="lookup-empty">Nenhum agendamento encontrado. Verifique o código ou nome.</div>';
        return;
    }
    out.innerHTML = results.map(b => {
        const dt = new Date(b.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        const color = STATUS_COLOR[b.status] || '#5f4a56';
        const label = STATUS_LABEL[b.status] || b.status;
        return `<div class="lookup-card">
          <div class="lookup-row"><span class="lookup-code">${b.id}</span><span class="lookup-badge" style="color:${color}">${label}</span></div>
          <div class="lookup-row"><b>${b.icon || ''} ${b.service}</b><span>${b.price}</span></div>
          <div class="lookup-row"><span>📅 ${dt}</span><span>🕐 ${b.time}</span></div>
          <div class="lookup-row"><span>👤 ${b.name}</span><span>📱 ${b.phone}</span></div>
        </div>`;
    }).join('');
}