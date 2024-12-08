const adminPassword = "001205"; // 관리자 비밀번호 설정
let customTimes = JSON.parse(localStorage.getItem("customTimes")) || [];

function drawAnalogClock(canvas, time) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.translate(radius, radius);

    // Draw the clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1e1e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw the hands
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / 360;
    const minuteAngle = (minutes * Math.PI) / 30;
    const secondAngle = (seconds * Math.PI) / 30;

    // Hour hand
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(hourAngle);
    ctx.lineTo(0, -radius * 0.5);
    ctx.stroke();
    ctx.rotate(-hourAngle);

    // Minute hand
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(minuteAngle);
    ctx.lineTo(0, -radius * 0.7);
    ctx.stroke();
    ctx.rotate(-minuteAngle);

    // Second hand
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(secondAngle);
    ctx.lineTo(0, -radius * 0.9);
    ctx.stroke();
    ctx.rotate(-secondAngle);
    ctx.translate(-radius, -radius);
}

function updateClocks() {
    const container = document.getElementById('clock-container');
    container.innerHTML = '';

    customTimes.forEach((custom, index) => {
        const customTime = new Date(custom.time);
        customTime.setSeconds(customTime.getSeconds() + 1); // 시간 증가
        custom.time = customTime.toISOString();

        const div = document.createElement('div');
        div.className = 'city';
        div.innerHTML = `
            <h2>${custom.name}</h2>
            <p>${customTime.toLocaleTimeString()}</p>
            <p>${customTime.toLocaleDateString()}</p>
            <canvas width="150" height="150"></canvas>
            <button onclick="openAdminModal(${index})">Delete</button>
        `;
        container.appendChild(div);

        const canvas = div.querySelector('canvas');
        drawAnalogClock(canvas, customTime);
    });

    // localStorage에 커스텀 시간 저장
    localStorage.setItem("customTimes", JSON.stringify(customTimes));
}

function openCustomTimeModal() {
    const modal = document.getElementById('custom-time-modal');
    modal.style.display = "block";
}

function closeCustomTimeModal() {
    const modal = document.getElementById('custom-time-modal');
    modal.style.display = "none";
}

function saveCustomTime() {
    const name = document.getElementById('custom-name').value;
    const datetime = document.getElementById('custom-datetime').value;

    if (name && datetime) {
        customTimes.push({ name, time: new Date(datetime).toISOString() });
        updateClocks();
        closeCustomTimeModal();
    }
}

function openAdminModal(index) {
    const modal = document.getElementById('admin-modal');
    modal.style.display = "block";
    modal.dataset.index = index;
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = "none";
}

function verifyAdmin() {
    const password = document.getElementById('admin-password').value;
    const modal = document.getElementById('admin-modal');
    const index = modal.dataset.index;

    if (password === adminPassword) {
        customTimes.splice(index, 1);
        updateClocks();
        closeAdminModal();
    } else {
        alert("Incorrect password!");
    }
}

// Toggle manifesto
document.getElementById("toggle-manifesto").addEventListener("click", () => {
    const manifestoContent = document.getElementById("manifesto-content");
    manifestoContent.style.display = manifestoContent.style.display === "none" ? "block" : "none";
});

document.getElementById("custom-time").addEventListener("click", openCustomTimeModal);
document.querySelector(".close-btn").addEventListener("click", closeCustomTimeModal);
document.getElementById("save-custom-time").addEventListener("click", saveCustomTime);
document.getElementById("verify-admin").addEventListener("click", verifyAdmin);

// 초기 클록 표시
updateClocks();
setInterval(updateClocks, 1000);
