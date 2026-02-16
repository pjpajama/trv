const prefectures = [
"北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
"茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
"新潟県","富山県","石川県","福井県","山梨県","長野県",
"岐阜県","静岡県","愛知県","三重県",
"滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
"鳥取県","島根県","岡山県","広島県","山口県",
"徳島県","香川県","愛媛県","高知県",
"福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

// -------- index.html 用 --------
if(document.getElementById("buttons")){
let visited = JSON.parse(localStorage.getItem("visited")) || [];
let remaining = JSON.parse(localStorage.getItem("remaining")) || [...prefectures];
let current = null;
let mode = "home";

function renderButtons(){
    const area = document.getElementById("buttons");
    area.innerHTML = "";
    if(mode==="home"){
        area.innerHTML = `<button onclick="startRandom()">旅行する</button><button onclick="openMenu()">メニュー</button>`;
    }
    if(mode==="traveling"){
        area.innerHTML = `<button onclick="goVisit()">ここに行く</button><button onclick="skip()">一旦飛ばす</button>`;
    }
    if(mode==="menu"){
        area.innerHTML = `<button onclick="goRecord()">旅行記録</button><button onclick="resetTravel()">リセット</button><button onclick="closeMenu()">戻る</button>`;
    }
}

function startRandom(){
    if(remaining.length===0){
        document.getElementById("result").textContent="🎉 全県制覇 🎉";
        return;
    }
    const idx = Math.floor(Math.random()*remaining.length);
    current = remaining[idx];
    document.getElementById("result").textContent=current;
    mode="traveling";
    renderButtons();
}

function goVisit(){
    if(!current) return;
    visited.push(current);
    remaining = remaining.filter(p => p!==current);
    updateVisitedList();
    localStorage.setItem("visited", JSON.stringify(visited));
    localStorage.setItem("remaining", JSON.stringify(remaining));
    current=null;
    mode="home";
    renderButtons();
}

function skip(){
    current=null;
    document.getElementById("result").textContent="次の行き先はココ‼";
    mode="home";
    renderButtons();
}

function updateVisitedList(){
    document.getElementById("visited").textContent = visited.length ? "旅行済み: "+visited.join("、") : "";
}

function openMenu(){ mode="menu"; renderButtons(); }
function closeMenu(){ mode="home"; renderButtons(); }
function goRecord(){ window.location.href="kiroku.html"; }
function resetTravel(){
    if(!confirm("本当にリセットしますか？")) return;
    visited=[]; remaining=[...prefectures]; current=null;
    localStorage.removeItem("visited"); localStorage.removeItem("remaining"); localStorage.removeItem("photos");
    document.getElementById("result").textContent="次の行き先はココ‼";
    updateVisitedList();
    mode="home";
    renderButtons();
}

renderButtons();
updateVisitedList();
}

// -------- kiroku.html 用 --------
if(document.getElementById("japan-map")){
let visited = JSON.parse(localStorage.getItem("visited")) || [];
let photos = JSON.parse(localStorage.getItem("photos")) || {};

function goBack(){ window.location.href="index.html"; }

function updateMap(){
    document.querySelectorAll(".pref").forEach(pref => {
        pref.classList.toggle("visited", visited.includes(pref.id));
    });
}
updateMap();

document.querySelectorAll(".pref").forEach(pref => {
    pref.addEventListener("click", () => {
        if(!visited.includes(pref.id)) return;
        openModal(pref.id);
    });
});

function openModal(prefId){
    document.getElementById("photo-modal").style.display="block";
    document.getElementById("modal-pref").textContent = prefId;
    loadPhotos(prefId);
}

function closeModal(){
    document.getElementById("photo-modal").style.display="none";
    document.getElementById("photo-input").value="";
    document.getElementById("photo-list").innerHTML="";
}

document.getElementById("photo-input").addEventListener("change", function(){
    const file = this.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
        const prefId = document.getElementById("modal-pref").textContent;
        if(!photos[prefId]) photos[prefId]=[];
        photos[prefId].push(e.target.result);
        localStorage.setItem("photos", JSON.stringify(photos));
        loadPhotos(prefId);
    }
    reader.readAsDataURL(file);
});

function loadPhotos(prefId){
    const container = document.getElementById("photo-list");
    container.innerHTML="";
    (photos[prefId]||[]).forEach((src,i)=>{
        const img = document.createElement("img");
        img.src = src;
        img.className="photo-header";
        img.onclick = ()=>{
            photos[prefId].splice(i,1);
            localStorage.setItem("photos", JSON.stringify(photos));
            loadPhotos(prefId);
        };
        container.appendChild(img);
    });
}

