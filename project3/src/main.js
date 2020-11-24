import * as giant from "./giant-bomb.js"

function init(){
    document.querySelector("#search").onclick = giant.searchButtonClicked;
    document.querySelector("#next").onclick = giant.nextButtonClicked;
}

export {init};