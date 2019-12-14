tableDataHistory();
function searchFunction() {

    var list = document.getElementById("search-result-filter");
    list.innerHTML = '';
    var x = document.getElementById("search");
    if(x.value === '' || x.value === null) {
        document.getElementById('search-result').style.display = 'none';
    }
    const Http = new XMLHttpRequest();
    const url='https://restcountries.eu/rest/v2/name/' + x.value;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        /*     console.log(Http.responseText);*/
        var result = JSON.parse(Http.responseText);
        console.log(result);
        document.getElementById('search-result').style.display = 'block';
        var li = '';
        for(var i=0; i<=result.length; i++) {
            if (typeof result[i] !== 'undefined') {
                var filter = result[i].name;


                li+= `<li tabindex="1" onclick="historyList('${filter}')">`+highlightQuery(filter, x.value);+`</li>`;


            }
        }
        list.innerHTML = li;
    }

}

function historyList(item) {
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var time = currentDate.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
    var dateString = year + "-" +(month + 1) + "-" + date + ", " + time;
    var searchTitle = item;
    var searchHistory  = [];
    var history = {};
    if(localStorage.getItem('searchHistory') === null) {
        history = {'searchTitle': searchTitle, 'date': dateString};
        searchHistory.push(history);
        /*searchHistory.push(searchTitle, date);*/
        console.log(JSON.stringify(searchHistory));
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } else {
        searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
        console.log(searchHistory);
        history = {'searchTitle': searchTitle, 'date': dateString};
        searchHistory.push(history);
        console.log(searchHistory);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    document.getElementById('search-result').style.display = 'none';
    document.getElementById("search").value = '';
    tableDataHistory();
}

function tableDataHistory() {
    var searchHistory  = [];
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    var table = document.getElementById('table-history').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    var row = '';
    if(searchHistory !== null) {
        for(var i=0; i<=searchHistory.length; i++) {
            if (typeof searchHistory[i] !== 'undefined') {
                var title = searchHistory[i].searchTitle;
                var date = searchHistory[i].date;


                row += '<tr id="'+i+'"><td class="title-history">'+title+'</td><td class="date-history">'+date+'</td><td onclick="deleteSearchHistoryRecord('+i+')" class="clear-history">&#10006;</td>';



            }
        }
        document.getElementById('clear-search-link').style.display = 'block';
    }
    table.innerHTML = row;
}
function deleteSearchHistory() {
    if (confirm('Are you sure you want to delete history?')) {
        // Delete it!
        var table = document.getElementById('table-history').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        localStorage.removeItem('searchHistory');
        document.getElementById('clear-search-link').style.display = 'none';
    } else {
        // Do nothing!
    }

}
function deleteSearchHistoryRecord(id) {
    console.log(id);
    var searchHistory = [];
    var searchHistoryEdited = [];
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (confirm('Are you sure you want to delete this record of history?')) {
        if(searchHistory.length === 1) {
            localStorage.removeItem('searchHistory');
            document.getElementById('clear-search-link').style.display = 'none';
        } else {
            console.log(searchHistory[id]);
            searchHistory.splice(id, 1);

            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        }
        tableDataHistory();
    }
    else {}
}
function highlightQuery(string,searchQuery){
    if(!string){
        return "";
    }
    var expr = searchQuery;
    expr = expr.replace(/\s+/, "|",searchQuery);
    var regex = new RegExp(expr,"gi");
    return string.replace(regex, function($1){
        return '<span class="highlight">'+ $1 +'</span>';
    });
}
