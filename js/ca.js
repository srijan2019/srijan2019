function validateData(name, phone, inst) {
    var errors = {};
    if (name == "") {
        errors["name"] = "Please enter name";
    } else if (name.split(" ").length < 2) {
        errors["name"] = "Please enter fullname";
    }
    if (phone == "") {
        errors["phone"] = "Please enter phone number";
    } else if (phone.length != 10) {
        errors["phone"] = "Please enter 10 digit phone number";
    } else if (phone.match(/^\d{10}$/) === null) {
        errors["phone"] = "Please enter a valid 10 digit phone number";
    }
    if (inst == "") {
        errors["inst"] = "Please select an institution";
    }
    return errors;
}
function addError(form, target, error) {
    if (error !== undefined) {
        var error_text = document.getElementById(target+"_error");
        if (error_text === null) {
            error_text = document.createElement("div");
            error_text.className = "error error_text";
            error_text.id = target+"_error";
            error_text.style.top = (form.offsetTop) + "px";
            error_text.style.left = (form.offsetLeft + 14) + "px";
            form.parentElement.appendChild(error_text);
        }
        form.className = "error";
        error_text.innerHTML = error;
    } else {
        var error_text = document.getElementById(target+"_error");
        if (error_text !== null) {
            form.parentElement.removeChild(error_text);
            form.className = "";
        }
    }
}
function removeError(e) {
    var target = e.target.name;
    var target_error = document.getElementById(target+"_error");
    if (target_error !== null) {
        var form = document.forms["ca_form"];
        form.removeChild(target_error);
        form[target].className = "";
    }
}
function sendNotify(className, html) {
    var elem = document.createElement("div");
    elem.className = "notify "+className;
    elem.innerHTML = html;
    var n_list = document.getElementById("notify-list");
    n_list.appendChild(elem);
    var close = document.createElement("button");
    close.className = "notify-close";
    close.innerHTML = "X";
    close.onclick = function(e) {
        n_list.removeChild(elem);
    };
    elem.appendChild(close);
}
function submitData() {
    var form = document.forms["campus_ambassador"];
    var form_name = form["name"].value;
    var form_phone = form["phone"].value;
    var form_institution = form["inst"].value;
    var form_errors = validateData(form_name, form_phone, form_institution);
    if (form_errors["name"] === undefined && form_errors["phone"] === undefined && form_errors["inst"] === undefined) {
        var request = new XMLHttpRequest();
        request.addEventListener("load", function(e) {
            var response = JSON.parse(request.responseText);
            if (request.status === 200) {
                sendNotify("success", "<h2>Success!</h2><p>Your code is: <br/><strong>"+response.name.substr(1)+"</strong></p>");
            } else {
                sendNotify("failure", "<h2>Failed!</h2><p>Check your internet connection.<br/>If the error continues, contact us at <a href=\"mailto:contact@srijanju.in\">contact@srijanju.in</a></p>");
            }
        });
        request.addEventListener("error", function(e) {
            console.log("Error:", e);
        });
        request.open("POST", "https://srijan2019-b0bbc.firebaseio.com/campus_ambassador/"+form_institution+".json");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var send_json = JSON.stringify({"name": form_name, "phone": form_phone});
        request.send(send_json);
    } else {
        addError(form["name"], "name", form_errors["name"]);
        addError(form["phone"], "phone", form_errors["phone"]);
        addError(form["inst"], "inst", form_errors["inst"]);
    }
    return false;
}
window.onload = function(e) {
    var ins_dropdown = document.forms["campus_ambassador"]["inst"];
    var request = new XMLHttpRequest();
    request.addEventListener("load", function(e) {
        var response = JSON.parse(request.responseText);
        for (var key in response) {
            var ins_option = document.createElement("option");
            ins_option.value = key;
            ins_option.text = response[key];
            ins_dropdown.add(ins_option);
        }
    });
    request.addEventListener("error", function(e) {
        console.log("Error fetching institution names");
    });
    request.open("GET", "https://srijan2019-b0bbc.firebaseio.com/institutions.json", true);
    request.send();
}

