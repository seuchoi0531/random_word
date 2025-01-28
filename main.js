$(document).ready(function () {
    const fontsize = "20px";
    //const pdffontsize = "12px";
    let inputfile = document.getElementById("input_file");
    let table = document.getElementById("table");
    //let bookmarkarea = document.getElementById("bookmark_area");
    let addfile = document.getElementById("add_file");
    let deletefile = document.getElementById("delete_file");
    let hiddenarea = document.getElementById("hidden_area");
    let seeonlyword = document.getElementById("see_only_word");
    let seeonlymeaning = document.getElementById("see_only_meaning");
    let seeboth = document.getElementById("see_both");
    let mix = document.getElementById("mix");
    let isDrag = document.getElementById("isDrag");
    let body = document.getElementsByTagName("body")[0];
    let toPDF = document.getElementById("toPDF");
    let filename = [];
    const pageHeight = 900;
    const options = {
        margin: [10, 0, 10, 0],
        filename: 'output.pdf',
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4' },
        pagebreak: {
            mode: 'css',  // CSS로 페이지 분할 처리
            before: '.pagebreak'  // `pagebreak` 클래스를 가진 요소에서 페이지 분할
        }
    };
    let isDragable = false;
    let words = [];
    let bookmarks = [];
    inputfile.addEventListener('change', (e) => {
        //const file = e.target.files[0];
        //generateWord(file);
        for (file of e.target.files) {
            filename.push(file);
            generateWord(file);
        }
        console.log(filename);
    })
    addfile.addEventListener('click', () => { inputfile.click() });
    deletefile.addEventListener('click', setHiddenArea);
    seeonlyword.addEventListener('click', showOnlyWord);
    seeonlymeaning.addEventListener('click', showOnlyMeaning);
    seeboth.addEventListener('click', showBothWordAndMeaning);
    mix.addEventListener('click', mixWords);
    isDrag.addEventListener('click', toggleDrag);
    toPDF.addEventListener('click', saveToPDF);
    function generateWord(file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let data = event.target.result;
            wordSplit(data, words);
            makeTable();
        };
        reader.readAsText(file);
    }
    function wordSplit(data, arr) {
        let str = '';
        let tmpob = {};
        for (let i of data) {
            if (i == '\t') {
                tmpob.word = str;
                str = '';
            } else if (i == '\n') {
                tmpob.meaning = str;
                str = '';
                arr.push(tmpob);
                tmpob = {};
            } else
                str += i;
        }
        tmpob.meaning = str;
        arr.push(tmpob);
        console.log(arr.length);
    }
    function makeTable() {
        let result = '<table>';
        for (let i = 0; i < words.length; i += 2) {
            if (i + 1 < words.length) {
                if (i != 0 && i % 20 == 0)
                    result += `<tr class="boldborder"><td>${words[i].word}</td><td>${words[i].meaning}</td><td>${words[i + 1].word}</td><td>${words[i + 1].meaning}</td></tr>`;
                else if ((i / 2) % 2 == 1)
                    result += `<tr class="oddtr"><td>${words[i].word}</td><td>${words[i].meaning}</td><td>${words[i + 1].word}</td><td>${words[i + 1].meaning}</td></tr>`;
                else
                    result += `<tr><td>${words[i].word}</td><td>${words[i].meaning}</td><td>${words[i + 1].word}</td><td>${words[i + 1].meaning}</td></tr>`;
            }
            else {
                if (i != 0 && i % 20 == 0)
                    result += `<tr class="boldborder"><td>${words[i].word}</td><td>${words[i].meaning}</td><td></td><td></td></tr>`;
                else if ((i / 2) % 2 == 1)
                    result += `<tr class="oddtr"><td>${words[i].word}</td><td>${words[i].meaning}</td><td></td><td></td></tr>`;
                else
                    result += `<tr><td>${words[i].word}</td><td>${words[i].meaning}</td><td></td><td></td></tr>`;
            }
        }
        result += '</table>';
        table.innerHTML = result;
        const trs = document.getElementsByTagName("tr");
        Array.from(trs).forEach((tr) => {
            tr.style.fontSize = fontsize;
        })
        const tds = document.getElementsByTagName("td");
        Array.from(tds).forEach((td, i) => {
            td.addEventListener('click', () => {
                if (td.innerText == '') {
                    if (i % 2 == 0 && words.length > i / 2)
                        td.innerText = words[i / 2].word;
                    else if (i % 2 == 1 && words.length > (i - 1) / 2)
                        td.innerText = words[(i - 1) / 2].meaning;
                } else
                    td.innerText = '';
            })
        })
    }
    function setHiddenArea() {
        if (hiddenarea.innerText == '') {
            if (filename.length != 0) {
                let str = '';
                Array.from(filename).forEach((file, i) => {
                    str += `<label><input type="checkbox" name="file" value="${file.name}">${file.name}</label>`;
                })
                str += '<button id="delete">delete</button>';
                str += '<button id="allselect">all</button>';
                hiddenarea.innerHTML = str;
                document.getElementById("delete").addEventListener('click', deleteFile);
                document.getElementById("allselect").addEventListener('click', selectAllFile);
            } else {
                hiddenarea.innerHTML = "File not found";
                setTimeout(() => {
                    hiddenarea.innerHTML = "";
                }, 2500);
            }
        } else
            hiddenarea.innerHTML = '';
    }
    function deleteFile() {
        const selectedFiles = document.querySelectorAll('input[name="file"]:not(:checked)');
        words = [];
        tmp = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            for (let j = 0; j < filename.length; j++) {
                if (filename[j].name == selectedFiles[i].value) {
                    console.log(`find!! filename:${filename[j].name}, selectedFiles:${selectedFiles[i].value}`);
                    generateWord(filename[j], words);
                    tmp.push(filename[j]);
                }
            }
        }
        filename = [];
        if (tmp.length != 0)
            tmp.forEach((file) => { filename.push(file) });
        else
            table.innerHTML = "";
        hiddenarea.innerHTML = "";
    }
    function selectAllFile() {
        const selectedFiles = document.querySelectorAll('input[name="file"]:not(:checked)');
        Array.from(selectedFiles).forEach((file)=>{
            file.checked = true;
        })
    }
    function showOnlyWord() {
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (words.length > i / 2) {
                if (i % 2 == 0)
                    tds[i].innerText = words[i / 2].word;
                else
                    tds[i].innerText = '';
            }
        }
    }
    function showOnlyMeaning() {
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (words.length > i / 2) {
                if (i % 2 == 1)
                    tds[i].innerText = words[(i - 1) / 2].meaning;
                else
                    tds[i].innerText = '';
            }
        }
    }
    function showBothWordAndMeaning() {
        const tds = document.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            if (words.length > i / 2) {
                if (i % 2 == 0)
                    tds[i].innerText = words[i / 2].word;
                else
                    tds[i].innerText = words[(i - 1) / 2].meaning;
            }
        }
    }
    function mixWords() {
        words.sort(() => Math.random() - 0.5)
        makeTable();
    }
    function toggleDrag() {
        if (isDragable)
            body.setAttribute("onselectstart", "return false");
        else
            body.setAttribute("onselectstart", "return true");
        isDragable = !isDragable;
    }
    function saveToPDF() {
        const trs = document.getElementsByTagName("tr");
        let sum = 0;
        for (let i = 0; i < trs.length; i++) {
            console.log(trs[i].innerHTML);
            if (sum + trs[i].offsetHeight > pageHeight) {
                trs[i].classList.add("pagebreak");
                sum = 0;
            } else
                sum += trs[i].offsetHeight;
        }
        html2pdf().from(table).set(options).save();
        //html2pdf(table);
    }
});
