function attachEvents() {
    let url = 'http://localhost:3030/jsonstore/phonebook/';

    let buttons = document.querySelectorAll('button');

    let btnLoad = buttons[0];
    btnLoad.addEventListener('click', onLoad);
    let btnCreate = buttons[1];
    btnCreate.addEventListener('click', onCreate);

    async function onLoad() {
        try {
            let ulPhoneBook = document.querySelector('#phonebook');

            while (ulPhoneBook.hasChildNodes()) {
                ulPhoneBook.firstChild.remove();
            }
            let response = await fetch(url);
            let data = await response.json();

            Object.entries(data)
                .forEach(([id, person]) => {

                    let liEl = document.createElement('li');
                    liEl.textContent = `${person.person}: ${person.phone}`;
                    let btn = document.createElement('button');
                    btn.textContent = 'Delete';
                    btn.addEventListener('click', onDelete);
                    btn.setAttribute('id', id);
                    liEl.appendChild(btn);
                    ulPhoneBook.appendChild(liEl);


                })


        } catch (e) {
            alert(e.message);
        }
    }

   async function onCreate(ev) {
        try {
            let inputs = document.querySelectorAll('input')
            let person = inputs[0].value;
            let phone = inputs[1].value;

            if (person.length > 0 && phone.length > 0){

                let response = await fetch(url,{
                    method:'post',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({'person':person,'phone':phone})
                })
                if (response.ok){
                   await onLoad();
                    inputs[0].value = '';
                    inputs[1].value = '';
                }

            }


        } catch (e) {
            alert(e.message);
        }
    }

    async function onDelete(ev) {
        try {
            let response = await fetch(url + ev.target.getAttribute('id'), {
                method: 'delete'
            });
            if (response.ok){
                await onLoad();
            }
        } catch (e) {
            alert(e.message);
        }


    }


}

attachEvents();