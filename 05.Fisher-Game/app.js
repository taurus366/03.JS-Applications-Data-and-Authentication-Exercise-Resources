function attachEvents() {
    let forms = document.querySelectorAll('form');


    if (forms.length !== 0) {
        let urlRegister = 'http://localhost:3030/register/';
        // login.html PAGE !
        console.log(forms)

        let register = forms[0].addEventListener('submit', onSubmitRegister);
        let login = forms[1];



        function onSubmitRegister(ev) {
            ev.preventDefault();
            const registerForm = new FormData(ev.target);
            postRegister(registerForm);
        }

      async  function postRegister(form) {
            let email = form.get('email');
            let password = form.get('password');
            let rePassword = form.get('rePass');

            if (email.length > 0 && password.length > 0 && rePassword.length > 0 && password === rePassword){
                console.log('asdsa')
               let data = await fetch(urlRegister,{
                   method:'post',
                   headers:{'Content-Type':'application/json'},
                   body: JSON.stringify({email,password})
               })

                if (data.ok){
                    let data2 = await data.json();
                    console.log(data2.accessToken);
                }else {
                    let e = await data.json();
                    console.log(e.error);
                }
            }


        }



















    } else {
        // index.html PAGE !
    }


}

attachEvents();

