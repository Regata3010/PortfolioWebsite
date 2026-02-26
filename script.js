// ── Parsers ────────────────────────────────────────────────────────
function parseAbout(text) {
    const get = k => { const m = text.match(new RegExp(`^${k}:\\s*(.+)`,'m')); return m ? m[1].trim() : ''; };
    const bioMatch = text.match(/^BIO:\n([\s\S]*?)(?=\n[A-Z_]+:|\s*$)/m);
    const bio = bioMatch ? bioMatch[1].trim() : '';
    return `
        <p class="about-bio">${bio.replace(/\n\n/g,'</p><p class="about-bio">').replace(/\n/g,' ')}</p>
        <div class="tags">
            <span class="tag">Currently @ Northeastern MS CS</span>
            <span class="tag">GPA 3.6/4.0</span>
            <span class="tag">Open to: ${get('LOOKING_FOR')}</span>
        </div>`;
}

function parseEducation(text) {
    const blocks = text.split(/\n---+\n/).map(b=>b.trim()).filter(Boolean);
    return `<div class="cards-stack">${blocks.map(block => {
        const get = k => { const m = block.match(new RegExp(`^${k}:\\s*(.+)`,'m')); return m ? m[1].trim() : ''; };
        return `<div class="card">
            <div class="card-label">${get('YEARS')}</div>
            <h3>${get('SCHOOL')}</h3>
            <div class="meta">${get('DEGREE')} · ${get('LOCATION')}</div>
            <p>GPA: <strong style="color:var(--accent2)">${get('GPA')}</strong> &nbsp;·&nbsp; ${get('COURSES')}</p>
        </div>`;
    }).join('')}</div>`;
}

function parseExperience(text) {
    const blocks = text.split(/\n---+\n/).map(b=>b.trim()).filter(Boolean);
    return `<div class="cards-stack">${blocks.map(block => {
        const get = k => { const m = block.match(new RegExp(`^${k}:\\s*(.+)`,'m')); return m ? m[1].trim() : ''; };
        const bullets = [...block.matchAll(/^- (.+)/gm)].map(m=>`<li>${m[1]}</li>`).join('');
        return `<div class="card">
            <div class="card-label">${get('DURATION')} · ${get('LOCATION')}</div>
            <h3>${get('COMPANY')}</h3>
            <div class="meta">${get('ROLE')}</div>
            <ul>${bullets}</ul>
        </div>`;
    }).join('')}</div>`;
}

function parseProjects(text) {
    const blocks = text.split(/\n---+\n/).map(b=>b.trim()).filter(Boolean);
    const cards = blocks.map(block => {
        const get = k => { const m = block.match(new RegExp(`^${k}:\\s*(.*)`,'m')); return m ? m[1].trim() : ''; };
        const github = get('GITHUB'), demo = get('DEMO');
        const tag = get('TAG').toLowerCase();
        const statusClass = tag.includes('live') || tag.includes('prod') ? 'live' : '';
        const statusLabel = tag.includes('live') ? 'Live' : tag.includes('prod') ? 'Deployed' : 'Open Source';
        const stack = get('STACK').split('·').map(s=>`<span class="tag">${s.trim()}</span>`).join('');
        return `<div class="project-card">
            <div class="project-card-top">
                <h3>${get('FILE') || get('NAME')}</h3>
                <span class="project-status ${statusClass}">${statusLabel}</span>
            </div>
            <p>${get('DESC')}</p>
            <div class="tags">${stack}</div>
            <div class="project-links">
                ${github ? `<a href="${github}" target="_blank">↗ GitHub</a>` : ''}
                ${demo   ? `<a href="${demo}"   target="_blank">↗ Live Demo</a>` : ''}
            </div>
        </div>`;
    });
    return `<div class="project-grid">${cards.join('')}</div>`;
}

function parseSkills(text) {
    const blocks = text.split(/\n---+\n/).map(b=>b.trim()).filter(Boolean);
    const cards = blocks.map(block => {
        const get = k => { const m = block.match(new RegExp(`^${k}:\\s*(.+)`,'m')); return m ? m[1].trim() : ''; };
        const items = get('ITEMS').split(',').map(i=>`<span>${i.trim()}</span>`).join('');
        return `<div class="skill-card">
            <div class="skill-card-title">${get('CATEGORY')}</div>
            <div class="skill-items">${items}</div>
        </div>`;
    });
    return `<div class="skills-grid">${cards.join('')}</div>`;
}

function parseContact(text) {
    const get = k => { const m = text.match(new RegExp(`^${k}:\\s*(.+)`,'m')); return m ? m[1].trim() : ''; };
    const email=get('EMAIL'), github=get('GITHUB'), linkedin=get('LINKEDIN');
    return `<div class="contact-grid">
        <a href="mailto:${email}" class="contact-link">
            <span class="contact-link-icon">Email</span>
            <div class="contact-link-text">
                <span class="contact-link-label">Reach out</span>
                <span class="contact-link-value">${email}</span>
            </div>
        </a>
        <a href="${github}" target="_blank" class="contact-link">
            <span class="contact-link-icon">GitHub</span>
            <div class="contact-link-text">
                <span class="contact-link-label">Source code</span>
                <span class="contact-link-value">${github.replace('https://','')}</span>
            </div>
        </a>
        <a href="${linkedin}" target="_blank" class="contact-link">
            <span class="contact-link-icon">LinkedIn</span>
            <div class="contact-link-text">
                <span class="contact-link-label">Connect</span>
                <span class="contact-link-value">${linkedin.replace('https://','')}</span>
            </div>
        </a>
        <div class="contact-cta">
            <p>Open to: <span>${get('OPEN_TO')}</span></p>
            <p>Roles: <span>${get('ROLES')}</span></p>
            <p>Available: <span>${get('AVAILABLE')}</span> · <span>${get('LOCATION')}</span></p>
        </div>
    </div>`;
}

// ── Section config ─────────────────────────────────────────────────
const SECTIONS = [
    { id:'about',      num:'01', label:'About',      parser:parseAbout },
    { id:'education',  num:'02', label:'Education',  parser:parseEducation },
    { id:'experience', num:'03', label:'Experience', parser:parseExperience },
    { id:'projects',   num:'04', label:'Projects',   parser:parseProjects },
    { id:'skills',     num:'05', label:'Skills',     parser:parseSkills },
    { id:'contact',    num:'06', label:'Contact',    parser:parseContact },
];

// ── Load all sections on boot ──────────────────────────────────────
async function loadAllSections() {
    const container = document.getElementById('sections-container');
    for (const s of SECTIONS) {
        let inner = '';
        try {
            const res = await fetch(`data/${s.id}.txt`);
            inner = s.parser(await res.text());
        } catch(e) {
            inner = `<p style="color:var(--text-muted)">Could not load ${s.id}.txt</p>`;
        }
        const el = document.createElement('section');
        el.className = 'portfolio-section fade-in';
        el.id = s.id;
        el.innerHTML = `
            <div class="section-header">
                <span class="section-num">${s.num}</span>
                <h2>${s.label}</h2>
                <div class="section-line"></div>
            </div>
            ${inner}`;
        container.appendChild(el);
    }
    initObserver();
}

// ── Scroll progress bar ────────────────────────────────────────────
function initProgressBar() {
    const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
        updateActiveNav();
    }, { passive: true });
}

// ── Active nav ─────────────────────────────────────────────────────
function updateActiveNav() {
    let current = '';
    SECTIONS.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 90) current = s.id;
    });
    document.querySelectorAll('#sticky-nav button').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/'(\w+)'/);
        btn.classList.toggle('active', match && match[1] === current);
    });
}

// ── Smooth scroll ──────────────────────────────────────────────────
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── IntersectionObserver for fade-ins ─────────────────────────────
function initObserver() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.06 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ── Ripple on click ────────────────────────────────────────────────
document.addEventListener('click', e => {
    const target = e.target.closest('button, a, .project-card, .skill-card, .contact-link');
    if (!target) return;
    const r = target.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ripple';
    rip.style.cssText = `left:${e.clientX-r.left-3}px;top:${e.clientY-r.top-3}px`;
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
});

// ── Boot typing effect ─────────────────────────────────────────────
function typeText(el, text, speed, cb) {
    let i = 0; el.textContent = '';
    const iv = setInterval(() => {
        if (i < text.length) el.textContent += text[i++];
        else { clearInterval(iv); if (cb) cb(); }
    }, speed);
}

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    // Fade in hero immediately
    document.querySelector('.hero').classList.add('visible');

    const el = document.getElementById('typing-cmd');
    typeText(el, 'init_portfolio --user=arav', 45, () => {
        const out = document.getElementById('main-output');
        out.style.opacity = 1;
        loadAllSections();
    });
});
