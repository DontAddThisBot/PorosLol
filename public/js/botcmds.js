document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('part').addEventListener('click', part);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('join').addEventListener('click', join);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('joinOnDashboard').addEventListener('click', joinOnDashboard);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('joinOnCode').addEventListener('click', joinOnCode);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('poro').addEventListener('click', poro);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('offline').addEventListener('click', offline);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('stv').addEventListener('click', stv);
});

async function part() {
    const r = await fetch('/api/bot/part', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        window.location.href='/'
    } else {
        // show error notification with `b.message`
    }
}

async function join() {
    const r = await fetch('/api/bot/join', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        window.location.href='/'
    } else {
        // show error notification with `b.message`
    }
}

async function joinOnDashboard() {
    const r = await fetch('/api/bot/join', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        window.location.href='dashboard'
    } else {
        // show error notification with `b.message`
    }
}

async function joinOnCode() {
    const r = await fetch('/api/bot/join', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        window.location.href='code'
    } else {
        // show error notification with `b.message`
    }
}

async function poro() {
    const r = await fetch('/api/bot/poro', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}

async function offline() {
    const r = await fetch('/api/bot/offline', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}

async function stv() {
    const r = await fetch('/api/bot/stv', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}