
const cats = [
    { id: 9, name: "General Knowledge", icon: "fa-brain" },
    { id: 21, name: "Sports", icon: "fa-futbol" },
    { id: 22, name: "Geography", icon: "fa-globe" },
    { id: 11, name: "Movies", icon: "fa-film" },
    { id: 17, name: "Science", icon: "fa-flask" },
    { id: 18, name: "Computers", icon: "fa-laptop-code" },
    { id: 23, name: "History", icon: "fa-monument" },
    { id: 25, name: "Animals", icon: "fa-paw" }
];

cats.forEach(c => {
    document.getElementById('grid').innerHTML += `
                <div class="cat-card" onclick="start('${c.name}',${c.id})">
                    <i class="fas ${c.icon}"></i>
                    <h3>${c.name}</h3>
                </div>`;
});

function showCats() {
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('cats').classList.add('show');
}

let q = 0, qs = [], c = 0, w = 0, s = 0, t;
function start(n, id) {
    document.getElementById('cats').style.display = 'none';
    document.getElementById('title').textContent = n;
    document.getElementById('quiz').style.display = 'flex';
    fetch(`https://opentdb.com/api.php?amount=10&category=${id}`)
        .then(r => r.json()).then(d => { qs = d.results; nextQ(); });
}

function nextQ() {
    if (q >= 10) return end();
    document.getElementById('question').innerHTML = qs[q].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    document.getElementById('prog').style.width = (q + 1) * 10 + '%';
    const o = [...qs[q].incorrect_answers, qs[q].correct_answer].sort(() => 0.5 - Math.random());
    document.getElementById('opts').innerHTML = o.map(x => `<div class="opt" onclick="sel(this,'${x}')">${x}</div>`).join('');
    document.getElementById('next').classList.remove('active');
    timer(15);
}

function sel(el, a) {
    if (document.querySelector('.opt.selected')) return;
    el.classList.add('selected');
    document.getElementById('next').classList.add('active');
    if (a === qs[q].correct_answer) c++; else w++;
}

function timer(sec) {
    clearInterval(t);
    document.getElementById('timer').textContent = sec + 's';
    t = setInterval(() => {
        if (--sec <= 0) { clearInterval(t); s++; q++; nextQ(); }
        document.getElementById('timer').textContent = sec + 's';
    }, 1000);
}

document.getElementById('next').onclick = () => {
    if (!document.getElementById('next').classList.contains('active')) return;
    if (!document.querySelector('.opt.selected')) s++;
    clearInterval(t); q++; nextQ();
};

function end() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'flex';
    document.getElementById('pie').textContent = c + '/10';
    document.getElementById('c').textContent = c;
    document.getElementById('w').textContent = w;
    document.getElementById('s').textContent = s;
    document.getElementById('pie').style.background = `conic-gradient(#2563eb 0% ${c * 36}%, #3b82f6 ${c * 36}% ${(c + w) * 36}%, #ef4444 ${(c + w) * 36}% 360%)`;
    document.getElementById('msg').textContent = c >= 8 ? "GENIUS!" : c >= 6 ? "EXCELLENT!" : "GOOD EFFORT!";
    if (c >= 7) confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
}
