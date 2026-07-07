const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

html = html.replace(/<input type="number" min="0" data-field="w" value="\$\{s.w\}">/g, '<input type="number" min="0" data-field="w" value="${s.w}" readonly class="ro">');
html = html.replace(/<input type="number" min="0" data-field="l" value="\$\{s.l\}">/g, '<input type="number" min="0" data-field="l" value="${s.l}" readonly class="ro">');
html = html.replace(/<input type="number" min="0" data-field="sw" value="\$\{s.sw\}">/g, '<input type="number" min="0" data-field="sw" value="${s.sw}" readonly class="ro">');
html = html.replace(/<input type="number" min="0" data-field="sl" value="\$\{s.sl\}">/g, '<input type="number" min="0" data-field="sl" value="${s.sl}" readonly class="ro">');

if (!html.includes('.ro{background:transparent')) {
    html = html.replace('.team-edit-row input[type=number]{', '.team-edit-row input[type=number].ro{background:transparent; border:none; text-align:center; color:var(--text); font-weight:bold; pointer-events:none; outline:none;}\n  .team-edit-row input[type=number]{');
}

const recalcCode = `
function recalcStandings() {
  const stats = {};
  [...GROUP_A, ...GROUP_B].forEach(t => stats[t] = {w:0, l:0, sw:0, sl:0});
  document.querySelectorAll(".match-block").forEach(block => {
    const matchText = block.querySelector(".mh span").textContent;
    const [t1, t2] = matchText.split(" vs ");
    if(!stats[t1] || !stats[t2]) return;
    let t1_sw = 0, t2_sw = 0;
    block.querySelectorAll(".set-edit-row").forEach(row => {
      const winner = row.querySelector('[data-field="winner"]').value;
      if(winner === "1") t1_sw++;
      else if(winner === "2") t2_sw++;
    });
    stats[t1].sw += t1_sw;
    stats[t2].sw += t2_sw;
    stats[t1].sl += t2_sw;
    stats[t2].sl += t1_sw;
    if (t1_sw >= 3) { stats[t1].w++; stats[t2].l++; }
    else if (t2_sw >= 3) { stats[t2].w++; stats[t1].l++; }
  });
  document.querySelectorAll(".team-edit-row").forEach(row => {
    const t = row.dataset.team;
    if(stats[t]) {
      row.querySelector('[data-field="w"]').value = stats[t].w;
      row.querySelector('[data-field="l"]').value = stats[t].l;
      row.querySelector('[data-field="sw"]').value = stats[t].sw;
      row.querySelector('[data-field="sl"]').value = stats[t].sl;
    }
  });
}
`;

if (!html.includes('function recalcStandings')) {
    html = html.replace('function renderEditor(){', recalcCode + '\nfunction renderEditor(){');
}

if (!html.includes('recalcStandings();\n}')) {
    html = html.replace(/renderMatchesEditor\("matches-B", "B"\);\n\}/, 'renderMatchesEditor("matches-B", "B");\n  recalcStandings();\n}');
}

if (!html.includes('recalcStandings();\n});')) {
    html = html.replace(/\n\}\);\n\n\/\/ ---------------- editor rendering/, '\n  recalcStandings();\n});\n\n// ---------------- editor rendering');
}

fs.writeFileSync('admin.html', html, 'utf-8');
