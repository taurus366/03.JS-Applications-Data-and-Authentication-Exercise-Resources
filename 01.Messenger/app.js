function attachEvents() {
    const url = 'http://localhost:3030/jsonstore/messenger/';
    let btns = document.querySelectorAll('[type=button]');
    let sendBtn = btns[0];
    sendBtn.addEventListener('click', postMessage);
    let refreshBtn = btns[1];
    refreshBtn.addEventListener('click', getMessage);
    let txtArea = document.querySelector('#messages');

    async function getMessage() {
        try {
            let response = await fetch(url);
            let data = await response.json();
            let messages = [];
            Object.values(data)
                .forEach(line => {
                    messages.push(`${line.author}: ${line.content}`);
                })
            txtArea.textContent = messages.join('\n');
        } catch (error) {
            console.log(error.message)
            alert(error.statusText)
        }
    }

    async function postMessage() {
        let inputs = document.querySelectorAll('[type=text]');
        let name = inputs[0];
        let message = inputs[1];

        if (name.value.length > 0 && message.value.length > 0) {
            let response = await fetch(url, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'author': name.value, 'content': message.value})
            })
            if (response.ok) {
                await getMessage();
            } else {
                alert(response.statusText);
            }
        }
    }
}

attachEvents();