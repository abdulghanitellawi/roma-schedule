// nav.js — Roma Sidebar controller (works after nav.html injected)

(function(){
  const root = document.getElementById("romaNavRoot");
  if(!root) return;

  const overlay   = document.getElementById("romaNavOverlay");
  const openBtn   = document.getElementById("romaNavOpenBtn");
  const closeBtn  = document.getElementById("romaNavCloseBtn");
  const quickX    = document.getElementById("romaNavQuickClose");

  function setOpen(v){
    root.classList.toggle("is-open", !!v);
    if(overlay) overlay.setAttribute("aria-hidden", v ? "false" : "true");
    document.documentElement.style.overflow = v ? "hidden" : "";
  }

  // start closed
  setOpen(false);

  if(openBtn)  openBtn.addEventListener("click", ()=> setOpen(true));
  if(closeBtn) closeBtn.addEventListener("click", ()=> setOpen(false));
  if(quickX)   quickX.addEventListener("click", ()=> setOpen(false));
  if(overlay)  overlay.addEventListener("click", ()=> setOpen(false));

  window.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") setOpen(false);
  });

  // active link highlight
  try{
    const file = (location.pathname.split("/").pop() || "").toLowerCase();
    root.querySelectorAll("[data-nav]").forEach(a=>{
      const t = (a.getAttribute("data-nav")||"").toLowerCase();
      if(t === file) a.classList.add("active");
    });
  }catch{}

  // buttons: reuse existing page buttons
  const navOut = document.getElementById("navBtnOut");
  const navMakeAdmin = document.getElementById("navBtnMakeAdmin");

  if(navOut){
    navOut.addEventListener("click", ()=>{
      const real = document.getElementById("btnOut");
      if(real) return real.click();
      location.href="./login.html";
    });
  }

  if(navMakeAdmin){
    navMakeAdmin.addEventListener("click", ()=>{
      const real = document.getElementById("btnMakeAdmin");
      if(real) return real.click();
      alert("زر اجعل Admin غير موجود بهذه الصفحة.");
    });
  }

  // pills sync
  function setPill(txt){
    const a = document.getElementById("navMePill");
    const b = document.getElementById("navMePillTop");
    const val = (txt && String(txt).trim()) ? String(txt).trim() : "...";
    if(a) a.textContent = val;
    if(b) b.textContent = val;
  }

  // listen to event from pages
  window.addEventListener("roma:user", (e)=>{
    try{
      setPill(e.detail && e.detail.text ? e.detail.text : "...");
    }catch{}
  });

  // if page already knows user in a global stash
  if(window.__romaUserText) setPill(window.__romaUserText);

  // also fallback to old mePill if exists
  const old = document.getElementById("mePill");
  if(old && old.textContent && old.textContent.trim() && old.textContent.trim() !== "..."){
    setPill(old.textContent.trim());
  }

  // expose small helper (optional)
  window.__romaNavSetOpen = setOpen;
})();
