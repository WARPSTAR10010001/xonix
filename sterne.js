function stern(){
    var line = document.getElementById("display").innerHTML;
    if(line === "..."){
        line = "";
    }
    line += " &#9733";
    document.getElementById("display").innerHTML = line;
    console.log(line);
}