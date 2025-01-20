$(document).ready(function () {
    let inputfile = document.getElementById("input_file");
    let table = document.getElementById("table");
    let seeonlyword = document.getElementById("see_only_word");
    let seeonlymeaning = document.getElementById("see_only_meaning");
    let seeboth = document.getElementById("see_both");
    let mix = document.getElementById("mix");
    let words = [];
    inputfile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        generateWord(file);
    })
    seeonlyword.addEventListener('click',showOnlyWord);
    seeonlymeaning.addEventListener('click',showOnlyMeaning);
    seeboth.addEventListener('click',showBothWordAndMeaning);
    mix.addEventListener('click',mixWords);
    function generateWord(file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let data = event.target.result;
            let str = '';
            let tmpob = {};

            for (let i of data) {
                if (i == '\t') {
                    tmpob.word = str;
                    str = '';
                } else if (i == '\n') {
                    tmpob.meaning = str;
                    str = '';
                    words.push(tmpob);
                    tmpob = {};
                } else {
                    str += i;
                }
            }
            makeTable();

            console.log(words);
        };

        reader.readAsText(file);
    }

    function makeTable() {
        console.log("table");
        let result = '<table>';
        for (let i = 0; i < words.length; i++) {
            if (i % 10 == 0)
                result += `<tr class="boldborder"><td>${words[i].word}</td><td>${words[i].meaning}</td></tr>`;
            else if (i % 2 == 1)
                result += `<tr class="oddtr"><td>${words[i].word}</td><td>${words[i].meaning}</td></tr>`;
            else
                result += `<tr><td>${words[i].word}</td><td>${words[i].meaning}</td></tr>`;
        }
        result += '</table>';
        table.innerHTML = result;
    }
    function showOnlyWord() {
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (i % 2 == 0) {
                tds[i].innerText = words[i / 2].word;
            } else {
                tds[i].innerText = '';
            }
        }
    }
    function showOnlyMeaning() {
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (i % 2 == 1) {
                tds[i].innerText = words[(i - 1) / 2].meaning;
            } else {
                tds[i].innerText = '';
            }
        }
    }
    function showBothWordAndMeaning(){
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (i % 2 == 0) {
                tds[i].innerText = words[i / 2].word;
            } else {
                tds[i].innerText = words[(i - 1) / 2].meaning;
            }
        }
    }
    function mixWords(){
        words.sort(() => Math.random() - 0.5)
        console.log(words);
        makeTable();
    }
});
