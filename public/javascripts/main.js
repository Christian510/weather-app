

function isEmpty() {
    let input;
    input = document.getElementById("city_state").value;
    console.log(input);
    if (input == "") {
        alert("Enter a City, State and/or Country");
        return false;
    }
}