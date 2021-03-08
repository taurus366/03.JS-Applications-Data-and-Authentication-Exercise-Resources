const url = 'http://localhost:3030/jsonstore/collections/students/';

let formForm = document.querySelector('#form')
formForm.addEventListener('submit', submit => {
    submit.preventDefault();
    new FormData(submit.target);

})

async function postStudent(firstName, lastName, facultyNumber, grade) {

    let data = await fetch(url, {
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({firstName, lastName, facultyNumber, grade})
    })
    if (data.ok) {
        getStudents();
    } else {
        console.log(data.statusText);
    }


}


formForm.addEventListener('formdata', data => {
    let firstName = data.formData.get('firstName');
    let lastName = data.formData.get('lastName');
    let facultyNumber = data.formData.get('facultyNumber');
    let grade = data.formData.get('grade');

    function clearFormData() {
        document.querySelector('.inputs')
            .childNodes
            .forEach(child => {
                child.value = '';
            })
    }

    if (firstName.length > 0 && lastName.length > 0 && facultyNumber.length > 0 && grade.length > 0 && Number.isInteger(Number(grade)) && Number.isInteger(Number(facultyNumber))) {
        postStudent(firstName, lastName, facultyNumber, Number(grade));
        clearFormData();

    }
})


function createEl(type, textContent) {
    let result = document.createElement(type);

    if (textContent !== undefined) {
        result.textContent = textContent;
    }
    return result;
}

let tBody = document.querySelector('tbody');

async function getStudents() {
    while (tBody.hasChildNodes()) {
        tBody.firstChild.remove();
    }
    let data = await fetch(url)
        .then(response => response.json());

    Object.values(data)
        .forEach(student => {
            let trEl = createEl('tr', undefined);

            let tdEl1 = createEl('td', student.firstName);
            let tdEl2 = createEl('td', student.lastName);
            let tdEl3 = createEl('td', student.facultyNumber);
            let tdEl4 = createEl('td', (student.grade).toFixed(2));

            trEl.appendChild(tdEl1);
            trEl.appendChild(tdEl2);
            trEl.appendChild(tdEl3);
            trEl.appendChild(tdEl4);
            tBody.appendChild(trEl);


        })
}

getStudents();






