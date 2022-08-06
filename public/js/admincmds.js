document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ban').addEventListener('click', ban);
    document.getElementById('unban').addEventListener('click', unban);
});

async function ban() {
    const r = await fetch('/api/bot/ban', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}

async function unban() {
    const r = await fetch('/api/bot/unban', {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}