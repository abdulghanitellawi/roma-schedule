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

  // close sidebar when clicking any nav link
  try{
    root.querySelectorAll('a[href]').forEach(a=>{
      a.addEventListener("click", ()=>{
        // لا تسكر إذا الرابط # أو javascript
        const href = (a.getAttribute("href")||"").trim();
        if(!href || href === "#" || href.startsWith("javascript:")) return;
        setOpen(false);
      });
    });
  }catch{}

  // active link highlight
  try{
    const file = (location.pathname.split("/").pop() || "").toLowerCase();
    root.querySelectorAll("[data-nav]").forEach(a=>{
      const t = (a.getAttribute("data-nav")||"").toLowerCase();
      if(t === file) a.classList.add("active");
    });
  }catch{}

  // ===== Logout helper (IMPORTANT) =====
  async function doLogoutFromNav(){
    try{
      // ✅ يمنع auto-redirect في login.html
      sessionStorage.setItem("roma_logout", "1");
    }catch{}

    // 1) إذا الصفحة عرّفت دالة logout عالمستوى العام استخدمها
    if(typeof window.__romaLogout === "function"){
      try{ await window.__romaLogout(); return; }catch(e){ console.warn(e); }
    }

    // 2) جرّب أزرار الخروج الموجودة بالصفحات
    const real =
      document.getElementById("btnOut") ||
      document.getElementById("btnLogout") ||
      document.getElementById("navBtnOutReal");

    if(real){
      try{
        real.click();
        return;
      }catch(e){
        console.warn("Failed to click real logout button", e);
      }
    }

    // 3) fallback: روح على login (الفلاج موجود)
    location.href = "./login.html";
  }

  // buttons: reuse existing page buttons
  const navOut = document.getElementById("navBtnOut");
  const navMakeAdmin = document.getElementById("navBtnMakeAdmin");

  if(navOut){
    if(!navOut.__bound){
      navOut.__bound = true;
      navOut.addEventListener("click", doLogoutFromNav);
    }
  }

  if(navMakeAdmin){
    if(!navMakeAdmin.__bound){
      navMakeAdmin.__bound = true;
      navMakeAdmin.addEventListener("click", ()=>{
        const real = document.getElementById("btnMakeAdmin");
        if(real) return real.click();
        alert("زر اجعل Admin غير موجود بهذه الصفحة.");
      });
    }
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
  window.__romaNavLogout = doLogoutFromNav;
})();
