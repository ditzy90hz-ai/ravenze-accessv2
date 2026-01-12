const form = document.getElementById("accessForm");
const waBtn = document.getElementById("waBtn");
const lockText = document.getElementById("lockText");

const WA_LINK = "https://chat.whatsapp.com/LP27HdRdbL61g41bwS5aGX";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9i38dvDy3B8ZSZuuidSLhws16l4fg_D6GhnmIvwOJf7wWP_YTw1Dye1mn7YGK-YYN/exec";

// cek localStorage dulu
if(localStorage.getItem("ravenze_unlocked") === "true"){
  unlockWA();
}

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    hp: form.hp.value,
    entryCode: form.entryCode.value
  };

  try{
    // POST data ke Web App
    await fetch(WEB_APP_URL, {
      method: "POST",
      body: new URLSearchParams(data)
    });

    lockText.innerText = "Form terkirim. Tunggu approval admin.";

    // polling tiap 3 detik cek status approval
    const checkStatus = setInterval(async ()=>{
      const statusRes = await fetch(WEB_APP_URL + "?entryCode=" + data.entryCode);
      const statusData = await statusRes.json();

      if(statusData.status === "approved"){
        localStorage.setItem("ravenze_unlocked", "true");
        unlockWA();
        lockText.innerText = "Akses terbuka! Klik tombol WA untuk masuk grup.";
        clearInterval(checkStatus);
      }
    }, 3000);

  } catch(err){
    console.error(err);
    lockText.innerText = "Terjadi kesalahan. Coba lagi.";
  }
});

function unlockWA(){
  waBtn.disabled = false;
  waBtn.innerText = "Masuk Grup WA";
  waBtn.classList.remove("locked");
  waBtn.classList.add("unlocked");

  // animasi tombol unlock
  waBtn.animate([
    { transform: 'scale(0.8)', opacity: 0.5 },
    { transform: 'scale(1.1)', opacity: 1 },
    { transform: 'scale(1)', opacity: 1 }
  ], {duration:500, easing:'ease-out'});

  waBtn.onclick = () => window.open(WA_LINK, "_blank");
}
