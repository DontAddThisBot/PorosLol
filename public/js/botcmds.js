document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('part').addEventListener('click', part);
    document.getElementById('join').addEventListener('click', join);
});

async function part() {
    const r = await fetch('/api/bot/part', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
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
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}