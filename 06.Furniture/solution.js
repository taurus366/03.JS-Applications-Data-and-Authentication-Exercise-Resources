function solve() {
    let path = window.location.pathname.substring(1);
    //console.log(path)

    function generateEl(type, text) {
        let result = document.createElement(type);
        if (text !== undefined){
            result.setAttribute('src',text);
        }
        return result;
    }

    async function getFurniture(type) {
        let tbody = document.querySelector('tbody');
        let url = 'http://localhost:3030/data/furniture';

        let response = await fetch(url);

        if (response.ok){
            let data = await response.json();

            data
                .forEach(line => {
                    let image = line.Image;
                    let name = line.Name;
                    let price = line.Price;
                    let decorationFactor = line.DecorationFactor;

                    let tr = document.createElement('tr');

                    let tdEl1 = document.createElement('td');
                    tdEl1.innerHTML = `<img src="${image}">`;

                    let tdEl2 = document.createElement('td');
                    tdEl2.innerHTML = `<p>${name}</p>`;

                    let tdEl3 = document.createElement('td');
                    tdEl3.innerHTML = `<p>${price}</p>`;

                    let tdEl4 = document.createElement('td');
                    tdEl4.innerHTML = `<p>${decorationFactor}</p>`;

                    let tdEl5 = document.createElement('td');
                    tdEl5.innerHTML = `<input type="checkbox" ${type}>`;

                    tr.appendChild(tdEl1);
                    tr.appendChild(tdEl2);
                    tr.appendChild(tdEl3);
                    tr.appendChild(tdEl4);
                    tr.appendChild(tdEl5);

                    tbody.appendChild(tr);
                })
        }
    }

// Login page
    if (path === 'login.html') {
        let url = {
            register: 'http://localhost:3030/users/register/',
            login: 'http://localhost:3030/users/login/'
        };

        let colMd12 = document.querySelector('.col-md-12');

        colMd12.addEventListener('submit', onSubmit);

        async function onSubmit(ev) {
            ev.preventDefault();

            let formData = new FormData(ev.target);

            let user = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            if (ev.target.querySelector('button').textContent === 'Register') {
                user.rePassword = formData.get('rePass');
                if (user.email.length > 0 && user.password.length > 0 && user.rePassword.length > 0 && user.rePassword === user.password) {

                    await fetch(url.register, {
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({'email': user.email, 'password': user.password})
                    })
                        .then(response => {
                            const resp = response.json();
                            if (response.ok) {

                                resp
                                    .then(data => {
                                        sessionStorage.clear();
                                        sessionStorage.setItem('softuniTest', data.accessToken);
                                        window.location.replace('./homeLogged.html');
                                    })
                            } else {
                                alert(response.statusText);
                            }
                        })


                }


            }
            else if (ev.target.querySelector('button').textContent === 'Login') {

                await fetch(url.login, {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'email': user.email, 'password': user.password})
                })
                    .then(response => {
                        const resp = response.json();
                        if (response.ok) {

                            resp
                                .then(data => {
                                    sessionStorage.clear();
                                    sessionStorage.setItem('softuniTest', data.accessToken);
                                    window.location.replace('./homeLogged.html');
                                })
                        } else {
                            alert(response.statusText);
                        }

                    })

            }


        }
    }
    else if (path === 'home.html') {
        getFurniture('disabled')
    }
    else if (path === '' || path === 'index.html') {
        console.log('index loaded')
        window.location.replace('./home.html');
    }
    else if (path === 'homeLogged.html'){
        let url = 'http://localhost:3030/data/furniture';
        let form = document.querySelector('form');
        form.addEventListener('submit',onCreate);

        function onCreate(ev) {
            ev.preventDefault();
          onFormData(new FormData(ev.target));

        }
       async function onFormData(formData) {
            let name = formData.get('name');
            let price = formData.get('price');
            let factor = formData.get('factor');
            let img = formData.get('img');



            if (name.length > 0 && price !== 0 && factor !== 0 && img.length > 0 &&
                !isNaN(price) && !isNaN(factor) &&
                /(.jpg|.gif|.png|.JPG|.GIF|.PNG|.JPEG|.jpeg)$/.test(img)
            ){
                await fetch(url,{
                    method:'post',
                    headers: {'X-Authorization':sessionStorage.getItem('softuniTest'),
                    'Content-Type':'application/json'},
                    body: JSON.stringify({
                        'Image':img,
                        'Name':name,
                        'Price':parseFloat(price).toFixed(2),
                        'DecorationFactor':factor
                       })
                })
                    .then(response => {
                        if (!response.ok){
                            alert(response.statusText);
                        }
                    })

            }


        }

        getFurniture('');

        let buttons = document.querySelectorAll('button');
        let btnBuy = buttons[1];
        let btnAllOrders = buttons[2];

        btnBuy.addEventListener('click',onClick);
        btnAllOrders.addEventListener('click',getOrders);

         function onClick(ev) {
            let tbody = document.querySelector('tbody');
            let tbodyTr = tbody.querySelectorAll('tr');


            let items = {};
             let hasOneBought = false;
            tbodyTr
                .forEach(line => {
                    let checkBox = line.querySelectorAll('td')[4].querySelector('input');
                    if (checkBox.checked) {
                        let price = line.querySelectorAll('td')[2].querySelector('p').textContent;
                        let name = line.querySelectorAll('td')[1].querySelector('p').textContent;

                        items[name] = parseFloat(price).toFixed(2);
                        hasOneBought = true;
                         // totalPrice += parseFloat(price);
                         // names.push(name);
                    }

                })
            if (hasOneBought) {
                let url = 'http://localhost:3030/data/orders/';

               async function makeOrder() {
                   Object.entries(items)
                       .forEach(([key,value])=>{
                           fetch(url,{
                               method:'post',
                               headers: {'X-Authorization':sessionStorage.getItem('softuniTest'),
                                   'Content-Type':'application/json'},
                               body: JSON.stringify({'name':key,'price':value})
                           })
                               .then(response => {
                                   const data = response.json();
                                   if (response.ok){
                                      data
                                           .then(line => {
                                               sessionStorage.getItem('id').replace('id',line._ownerId)
                                           })
                                       alert('Now you can check All orders button!')
                                   }
                               })
                       })
                }
                makeOrder();
            }
        }
       async function getOrders(ev) {
           let ordersClassSpans = document.querySelector('.orders').querySelectorAll('span');
           let boughtFurniture = ordersClassSpans[0];
           let tPrice = ordersClassSpans[1];

             let url = 'http://localhost:3030/data/orders?_ownerId=';
            let totalPrice = 0;
            let names = [];
            //http://localhost:3030/data/orders?_ownerId=73d6dbdb-4f31-4056-8d43-6a1d9a3abee4

         if (sessionStorage.getItem('id')){
             let response =  await fetch(url + sessionStorage.getItem('id'))

             if (response.ok){
                 let data = await response.json();

                 await data
                     .forEach(line => {
                         let name = line.name;
                         let price = Number(line.price);

                         names.push(name);
                         totalPrice += price;




                     })
             }
             boughtFurniture.textContent = names.join(', ');
             tPrice.textContent = `${totalPrice.toFixed(2)} $`;
         }
        }


        let logOut = document.querySelector('#logoutBtn');
         logOut.addEventListener('click',onLogOut);
         function onLogOut() {
             sessionStorage.clear();
             window.location.replace('./login.html');
         }
    }
}

solve();