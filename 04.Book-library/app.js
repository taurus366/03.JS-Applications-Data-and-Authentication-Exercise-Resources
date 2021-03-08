let url = 'http://localhost:3030/jsonstore/collections/books/';

let tableBody = document.querySelector('tbody');

function solve() {


    async function editBook(ev) {
        let text = formPlace.querySelector('h3');
        let btnSave = formPlace.querySelector('button');

        if (text.textContent !== 'Edit FORM') {
            text.textContent = 'Edit FORM';
        }
        if (btnSave.textContent !== 'Save') {
            btnSave.textContent = 'Save';
        }
        let title = formPlace.querySelector('[name=title]');
        let author = formPlace.querySelector('[name=author]');

        async function getBookById(id) {

            await fetch(url + id.trim())
                .then(response => response.json())
                .then(data => {
                    title.value = data.title;
                    author.value = data.author;
                    btnSave.setAttribute('id', id);

                });
        }


        await getBookById(ev.target.getAttribute('id'));


    }

    function deleteBook(ev) {
        fetch(url + ev.target.id, {
            method: 'delete'
        })
            .then(response => {
                if (response.ok) {
                    loadBooks();
                }
            })
    }

    function createEl(type, textContent) {
        let result = document.createElement(type);
        if (textContent !== undefined) {
            result.textContent = textContent;
        }
        return result;
    }


    let formPlace = document.querySelector('form');
    formPlace.addEventListener('submit', onSubmit);

    function onSubmit(ev) {
        ev.preventDefault();
        new FormData(ev.target);
    }

    function clearForm() {
        formPlace.querySelectorAll('input')
            .forEach(line => {
                line.value = '';
            })
    }

    formPlace.addEventListener('formdata', formData)

    async function formData(data) {

        let btn = formPlace.querySelector('button');

        let title = data.formData.get('title');
        let author = data.formData.get('author');

        if (btn.textContent === 'Save') {

            await fetch(url + btn.getAttribute('id'), {
                method: 'put',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({'title': title, 'author': author})
            }).then(response => {
                if (response.ok) {
                    clearForm();
                    let text = formPlace.querySelector('h3').textContent = 'FORM';
                    let btnSave = formPlace.querySelector('button').textContent = 'Submit';

                }
            })

        } else {
            if (title.length > 0 && author.length > 0) {

                await fetch(url, {
                    method: 'post',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({'title': title, 'author': author})
                })
                    .then(response => {
                        if (response.ok) {
                            clearForm();

                        }
                    })
            }
        }
        loadBooks();
    }

    document.querySelector('#loadBooks').addEventListener('click', loadBooks);

    function loadBooks() {
        while (tableBody.hasChildNodes()) {
            tableBody.firstChild.remove();
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                Object.entries(data)
                    .forEach(([key, value]) => {
                        let trEl = createEl('tr', undefined);

                        let td1 = createEl('td', value.title);
                        let td2 = createEl('td', value.author);
                        let td3 = createEl('td', undefined);

                        let btnEdit = createEl('button', 'Edit');
                        btnEdit.addEventListener('click', editBook);
                        btnEdit.setAttribute('id', key);

                        let btnDelete = createEl('button', 'Delete');
                        btnDelete.addEventListener('click', deleteBook);
                        btnDelete.setAttribute('id', key);

                        td3.appendChild(btnEdit);
                        td3.appendChild(btnDelete);

                        trEl.appendChild(td1);
                        trEl.appendChild(td2);
                        trEl.appendChild(td3);

                        tableBody.appendChild(trEl);
                    })
            })

    }

}

solve();





