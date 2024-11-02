function changeText() {
    let arr = document.getElementsByClassName("fontExample");
    for(let i = 0; i < arr.length; i++) {
        arr[i].innerHTML = document.getElementById("demotext").value;
    }
}