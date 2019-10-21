// Global variables
var _data;

window.onload = function(){
    setup();
}

function setup() {
    loadData("AB_NYC_2019_Subset_2.csv")
}

function loadData(dataPath)
{
    d3.csv(dataPath).then(function (data)
    {
        _data = data
    })
}