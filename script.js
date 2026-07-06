/* ---------------- Starfield background ---------------- */
(function(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  function initStars(){
    stars = [];
    const count = Math.floor((canvas.width*canvas.height)/9000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.4+0.3,
        alpha: Math.random(),
        speed: Math.random()*0.015+0.003
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const s of stars){
      s.alpha += s.speed;
      const a = (Math.sin(s.alpha)+1)/2;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(232,236,251,${0.15+a*0.5})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', ()=>{resize();initStars();});
  resize();initStars();draw();
})();

/* ---------------- Mobile nav toggle ---------------- */
(function(){
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navList');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', ()=> nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('open')));
})();

/* ---------------- FAQ accordion ---------------- */
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  if(!q) return;
  q.addEventListener('click', ()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

/* ---------------- Contact form (mailto fallback) ---------------- */
(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if(serviceParam){
    const select = document.getElementById('service');
    for(const opt of select.options){
      if(opt.value.toLowerCase().includes(serviceParam.toLowerCase())){
        select.value = opt.value;
        break;
      }
    }
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('Inquiry: '+service+' — from '+name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`);
    window.location.href = `mailto:shasmeenofficial12@gmail.com?subject=${subject}&body=${body}`;
  });
})();

/* ---------------- Assistant widget (rule-based) ---------------- */
(function(){
  const toggle = document.getElementById('assistantToggle');
  const panel = document.getElementById('assistantPanel');
  if(!toggle || !panel) return;
  const messages = document.getElementById('assistantMessages');
  const input = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSend');
  const quickReplies = document.getElementById('quickReplies');

  toggle.addEventListener('click', ()=> panel.classList.toggle('open'));

  const responses = {
    services: "I offer three things: website & AI development, design & video editing, and online tutoring across all school subjects (with a strong focus on math). Want details on any one of these?",
    pricing: "Pricing depends on scope — a simple website, a monthly design package, or a tutoring plan all cost differently. Send a message through the contact page and you'll get a clear quote back within a day.",
    tutoring: "Tutoring is one-on-one, online, and covers all school subjects for grades 6–12 — with extra focus on math since that's where most students need the most help. Sessions are flexible and scheduled around you.",
    contact: "Easiest way is the contact page — fill in what you need and it'll open a ready-to-send email. You can also reach out directly at shasmeenofficial12@gmail.com, or through WhatsApp and socials in the footer.",
    about: "This is a one-person studio — full-stack development, design, video editing, and teaching, all handled personally. Check out the About page for the full background.",
    default: "Good question — I don't have a scripted answer for that one, but send it through the contact page and you'll get a proper reply directly, usually within a day."
  };

  function addMessage(text, who){
    const div = document.createElement('div');
    div.className = 'msg '+who;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleQuery(text){
    addMessage(text, 'user');
    const lower = text.toLowerCase();
    let key = 'default';
    if(lower.includes('service')||lower.includes('offer')||lower.includes('do you')) key='services';
    else if(lower.includes('price')||lower.includes('cost')||lower.includes('charge')||lower.includes('rate')) key='pricing';
    else if(lower.includes('tutor')||lower.includes('math')||lower.includes('teach')||lower.includes('class')) key='tutoring';
    else if(lower.includes('about')||lower.includes('who')||lower.includes('background')) key='about';
    else if(lower.includes('contact')||lower.includes('start')||lower.includes('reach')||lower.includes('email')) key='contact';
    setTimeout(()=> addMessage(responses[key], 'bot'), 500);
  }

  if(quickReplies){
    quickReplies.addEventListener('click', (e)=>{
      if(e.target.classList.contains('quick-reply')){
        handleQuery(e.target.textContent);
      }
    });
  }
  sendBtn.addEventListener('click', ()=>{
    const val = input.value.trim();
    if(!val) return;
    handleQuery(val);
    input.value='';
  });
  input.addEventListener('keypress', (e)=>{
    if(e.key==='Enter'){ sendBtn.click(); }
  });
})();
