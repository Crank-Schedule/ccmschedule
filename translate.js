const fs = require('fs');

let text = fs.readFileSync('admin.html', 'utf-8');

const replacements = [
    ['<title>크총모 S4 · 관리자</title>', '<title>CCM S4 · Admin</title>'],
    ['<h1>크총모 S4 <span style="color:var(--dim); font-weight:500; font-size:13px;">· 관리자 / Admin</span></h1>', '<h1>CCM S4 <span style="color:var(--dim); font-weight:500; font-size:13px;">· Admin</span></h1>'],
    ['연결 안 됨 / Disconnected', 'Disconnected'],
    ['← 대회 페이지로 / Back to Tournament', '← Back to Tournament'],
    ['<h2>관리자 로그인 / Admin Login</h2>', '<h2>Admin Login</h2>'],
    ['GitHub 토큰은 Cloudflare Worker에만 저장돼요. 이 브라우저에는 비밀번호만 저장됩니다 (이중 보안).<br>', 'GitHub tokens are securely stored in the Cloudflare Worker. Only the password is saved in your browser.<br>'],
    ['Cloudflare Worker 배포 후 나오는 주소 / The URL of your deployed Cloudflare Worker', 'The URL of your deployed Cloudflare Worker'],
    ['<label>비밀번호 / Password</label>', '<label>Password</label>'],
    ['Worker에 설정한 ADMIN_PASSWORD / Password set in Worker', 'ADMIN_PASSWORD set in Worker'],
    ['연결하기 / Connect', 'Connect'],
    ['새로고침 / Reload (원격에서 다시 불러오기)', 'Reload (Fetch from remote)'],
    ['로그아웃 / Logout', 'Logout'],
    ['· 순위표 / Standings (승 / 패 / 세트승 / 세트패)', '· Standings (W / L / SW / SL)'],
    ['<span>팀</span><span>승</span><span>패</span><span>SW</span><span>SL</span>', '<span>Team</span><span>W</span><span>L</span><span>SW</span><span>SL</span>'],
    ['· 경기 결과 및 라인업 / Match Results & Lineups', '· Match Results & Lineups'],
    ['변경사항 저장 (GitHub에 반영) / Save Changes to GitHub', 'Save Changes to GitHub'],
    ['비밀번호가 틀렸습니다.', 'Incorrect password.'],
    ['연결 오류', 'Connection error'],
    ['저장 실패', 'Save failed'],
    ['Worker URL과 비밀번호는 필수입니다.', 'Worker URL and Password are required.'],
    ['btn.disabled = true; btn.textContent = "연결 중...";', 'btn.disabled = true; btn.textContent = "Connecting...";'],
    ['btn.disabled = false; btn.textContent = "연결하기";', 'btn.disabled = false; btn.textContent = "Connect";'],
    ['setStatus("불러오는 중...", "");', 'setStatus("Loading...", "");'],
    ['setStatus("연결됨", "ok");', 'setStatus("Connected", "ok");'],
    ['setSaveMsg("원격 데이터를 다시 불러왔습니다.", "ok");', 'setSaveMsg("Reloaded remote data.", "ok");'],
    ['setStatus("오류", "err");', 'setStatus("Error", "err");'],
    ['btn.disabled = true; btn.textContent = "저장 중...";', 'btn.disabled = true; btn.textContent = "Saving...";'],
    ['setSaveMsg("✓ 저장 완료 — 실제 사이트에 반영됐습니다.", "ok");', 'setSaveMsg("✓ Saved successfully.", "ok");'],
    ['btn.disabled = false; btn.textContent = "변경사항 저장 (GitHub에 반영)";', 'btn.disabled = false; btn.textContent = "Save Changes to GitHub";'],
    ['선수 선택', 'Select Player'],
    ['<span style="color:var(--dim);">승자:</span>', '<span style="color:var(--dim);">Winner:</span>'],
    ['미정', 'TBD'],
    ['setStatus("연결 안 됨", "");', 'setStatus("Disconnected", "");']
];

for (const [k, v] of replacements) {
    text = text.split(k).join(v);
}

const jsOld = `document.getElementById("editor").addEventListener("change", (e)=>{
  if(e.target.tagName === "SELECT" && (e.target.dataset.field === "p1" || e.target.dataset.field === "p2")){
    const val = e.target.value;
    if(val && window.PLAYER_DB && window.PLAYER_DB[val.toLowerCase()]){
      const raceOpt = window.PLAYER_DB[val.toLowerCase()].race;
      let r = "";
      if(raceOpt.includes("terran")) r = "T";
      if(raceOpt.includes("protoss")) r = "P";
      if(raceOpt.includes("zerg")) r = "Z";
      const selectField = e.target.dataset.field === "p1" ? "race1" : "race2";
      const row = e.target.closest(".set-edit-row");
      row.querySelector(\`[data-field="\${selectField}"]\`).value = r;
    }
  }
});`;

const jsNew = `document.getElementById("editor").addEventListener("change", (e)=>{
  if(e.target.tagName === "SELECT" && (e.target.dataset.field === "p1" || e.target.dataset.field === "p2")){
    const val = e.target.value;
    const selectField = e.target.dataset.field === "p1" ? "race1" : "race2";
    const row = e.target.closest(".set-edit-row");
    if(val && window.PLAYER_DB && window.PLAYER_DB[val.toLowerCase()]){
      const raceOpt = window.PLAYER_DB[val.toLowerCase()].race;
      let r = "";
      if(raceOpt.includes("terran")) r = "T";
      if(raceOpt.includes("protoss")) r = "P";
      if(raceOpt.includes("zerg")) r = "Z";
      row.querySelector(\`[data-field="\${selectField}"]\`).value = r;
    } else if (!val) {
      row.querySelector(\`[data-field="\${selectField}"]\`).value = "";
    }
  }
});`;

text = text.split(jsOld).join(jsNew);

fs.writeFileSync('admin.html', text, 'utf-8');
console.log('Done!');
