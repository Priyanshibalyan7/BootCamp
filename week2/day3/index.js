let todoArr = JSON.parse(localStorage.getItem("todo")) || [];
displayTable(todoArr);



document.querySelector("form").addEventListener("submit", getDetails)

//step-2

function getDetails(e) {
    e.preventDefault()
    let name = document.querySelector("#name").value;
    let docID = document.querySelector("#docID").value;
    let dept = document.querySelector("#dept").value;
    let exp = document.querySelector("#exp").value;
    let email = document.querySelector("#email").value;
    let mbl = document.querySelector("#mbl").value;


    let taskObj = { name, docID, dept, exp, email, mbl }
    todoArr.push(taskObj);
    console.log(todoArr);
    localStorage.setItem("todo", JSON.stringify(todoArr));
    displayTable(todoArr); // [{},{},{}...{}]


}
function displayTable(arr) {
    document.querySelector("tbody").innerText = "";
    arr.forEach((el, i) => {

        let row = document.createElement("tr");
        let td1 = document.createElement("td")
        td1.innerText = el.name;

        let td2 = document.createElement("td");
        td2.innerText = el.docID;

        let td3 = document.createElement("td");
        td3.innerText = el.dept

        let td4 = document.createElement("td");
        td4.innerText = el.exp

        let td5 = document.createElement("td");
        td5.innerText = el.email

        let td6 = document.createElement("td");
        td6.innerText = el.mbl

        let td7 = document.createElement("td");
        if (el.exp > 5) {
            td7.innerText = "Senior "
        } else if (el.exp > 2 && el.exp < 5) {
            td7.innerText = "Junior "
        } else {
            td1.innerText = "Traniee"
        }
        let td8 = document.createElement("td")
        td8.innerHTML = `<button> delete</button>`
        // td8.innerText="Delete"
        td8.addEventListener("click", function () {
            todoArr.splice(i, 1)

            localStorage.setItem("todo", JSON.stringify(todoArr));
            displayTable(todoArr);
        });

        row.append(td1, td2, td3, td4, td5, td6, td7, td8);
        document.querySelector("tbody").append(row);
    });


}

