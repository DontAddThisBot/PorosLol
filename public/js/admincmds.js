document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ban').addEventListener('click', ban);
    document.getElementById('unban').addEventListener('click', unban);
});

async function ban() {
    const username = document.getElementById('admin-ban-user-username-input').value
    console.log(username)
    const r = await fetch(`/api/bot/ban?username=${encodeURIComponent(username)}`, {
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
    const username = document.getElementById('admin-unban-user-username-input').value
    console.log(username)
    const r = await fetch(`/api/bot/unban?username=${encodeURIComponent(username)}`, {
        method: 'POST',
    });
    const b = await r.json();
    if (b.success) {
        // show success notification
    } else {
        // show error notification with `b.message`
    }
}