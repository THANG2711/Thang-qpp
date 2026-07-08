let bal = parseInt(localStorage.getItem('bal')) || 0;
document.getElementById('totalDisplay').innerText = bal.toLocaleString() + " VNĐ";

const insults = [
    "Lại tiêu tiền à Thắng? Nghèo đến nơi rồi kìa!",
    "Bớt mồm lại, tiền không phải lá đa đâu!",
    "Tiêu thế này thì bao giờ mới giàu, hả Thắng?",
    "Nhìn số dư đi, còn dám chi nữa à?",
    "Thắng ơi, tiền đấy là mồ hôi nước mắt đấy, tỉnh lại đi!"
];

function triggerInsult() {
    let randomInsult = insults[Math.floor(Math.random() * insults.length)];
    
    // Hiện thông báo
    alert("⚡ CẢNH BÁO: " + randomInsult);
    
    // Phát giọng đọc tiếng Việt
    let msg = new SpeechSynthesisUtterance();
    msg.text = randomInsult;
    msg.lang = 'vi-VN';
    window.speechSynthesis.speak(msg);
}

function addEntry(name, amt, type) {
    if (type === 'Chi') triggerInsult();
    
    let val = parseInt(amt);
    if (!val) return;
    bal += (type === 'Thu' ? val : -val);
    updateUI();
    
    let now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    let li = document.createElement('li');
    li.style.display = "block";
    li.style.borderBottom = "1px solid #333";
    li.style.padding = "10px";
    
    li.innerHTML = `<span style="color:#00ffff">[${now}]</span> <strong>${name}</strong> <span style="float:right; color:${type==='Thu'?'#00ff41':'#ff4500'}">${type==='Thu'?'+':'-'}${val.toLocaleString()}đ</span>`;
    
    let list = document.getElementById('historyList');
    list.style.display = "block";
    list.prepend(li);
}

function updateUI() { 
    localStorage.setItem('bal', bal); 
    document.getElementById('totalDisplay').innerText = bal.toLocaleString() + " VNĐ"; 
}

function addDebt(name, amt) { 
    if(confirm("Trả nợ " + name + " " + amt.toLocaleString() + "đ?")) addEntry(name, amt, 'Chi'); 
}

function toggleStatus() {
    let btn = document.getElementById('btnStatus');
    btn.classList.toggle('on');
    btn.innerText = btn.classList.contains('on') ? "ĐANG CÀY..." : "TRẠNG THÁI: OFF";
}

function calcVisionGas() {
    let s = document.getElementById('startKm').value, e = document.getElementById('endKm').value;
    document.getElementById('amtInput').value = Math.round(((e - s) / 100) * 2.5 * 23000);
}

function changeAvatar(e) { 
    let r = new FileReader(); 
    r.onload = (ev) => { document.getElementById('avatar').src = ev.target.result; localStorage.setItem('avt', ev.target.result); }; 
    r.readAsDataURL(e.target.files[0]); 
}

setInterval(() => {
    let clock = document.getElementById('clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

window.onload = () => { 
    if(localStorage.getItem('avt')) document.getElementById('avatar').src = localStorage.getItem('avt'); 
};
let startPos = null;

// Lấy vị trí bắt đầu
function startTracking() {
    navigator.geolocation.getCurrentPosition((pos) => {
        startPos = pos.coords;
        alert("Đã bắt đầu đo hành trình...");
    });
}

// Tính khoảng cách và trừ tiền
function stopTracking() {
    if (!startPos) return alert("Chưa bắt đầu đo!");
    
    navigator.geolocation.getCurrentPosition((pos) => {
        let endPos = pos.coords;
        // Công thức tính khoảng cách (đơn giản hóa)
        let R = 6371; // Bán kính trái đất
        let dLat = (endPos.latitude - startPos.latitude) * Math.PI/180;
        let dLon = (endPos.longitude - startPos.longitude) * Math.PI/180;
        let a = Math.sin(dLat/2)**2 + Math.cos(startPos.latitude*Math.PI/180) * Math.cos(endPos.latitude*Math.PI/180) * Math.sin(dLon/2)**2;
        let km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        let tienXang = Math.round(km * 2500); // Giả sử 2500đ mỗi km
        
        if (confirm("Đi được " + km.toFixed(2) + "km. Trừ " + tienXang.toLocaleString() + "đ tiền xăng?")) {
            addEntry("Xăng tự động", tienXang, 'Chi');
        }
    });
}
