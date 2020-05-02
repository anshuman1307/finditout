resultData=[];
sortarray = [];
$(document).ready(function () {
    if(pageName == "home"){
        $.ajax({
            url: "https://api.covid19india.org/data.json",
            async: true, error: function () {
                
            },
            beforeSend: function () {
              
            },
            success: function (result) {
               resultData = JSON.parse(JSON.stringify(result));
               console.log(resultData);
               let stateListHtml = '';
                resultData.statewise.map(function(val,key){
                    console.log(val);
                    
                    if(val.state != "Total"){
                        sortarray.push('{"key":'+key+',"value":'+JSON.stringify(val)+'}');
                        stateListHtml+='<tr onclick=redirectToState("'+val.statecode+'")><td scope="col" class="stateName underline">'+val.state.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                     +'<td scope="col" class="cardval">'+val.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                     +'<td scope="col" class="cardval ">'+val.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                     +'<td scope="col" class="cardval">'+val.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                     +'<td scope="col" class="cardval">'+val.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' </td></tr>'
                    }else{
                         totalConfirmed = val.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                         totalActive = val.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                         totalRecovered = val.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                         totalDeaths = val.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                })
                $('#totalConfirmed').text(totalConfirmed);
                $('#totalActive').text(totalActive);
                $('#totalRecovered').text(totalRecovered);
                $('#totalDeaths').text(totalDeaths);  
                $("#stateData").html(stateListHtml);
                var dateArr= resultData.statewise[0].lastupdatedtime.split('/');
                var nxtdateArr= dateArr[2].split(' ');
                var findateArr= nxtdateArr[1].split(':');
                let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];       
                $('#lastUpdated').html("Last Updated on : "+monthArr[(Number(dateArr[1])-1)]+" "+ dateArr[0] +" "+ nxtdateArr[1]);
        }})
    }
    if(pageName == "state"){
        $.ajax({
            url: "https://api.covid19india.org/state_district_wise.json",
            async: true, error: function () {
                
            },
            beforeSend: function () {
              
            },
            success: function (result) {
                resultData = JSON.parse(JSON.stringify(result));
                console.log(resultData);
                let stateName = Object.keys(resultData).filter(item => resultData[item].statecode == state.toUpperCase());
                let distArr =resultData[stateName].districtData;
                Object.keys(distArr).map(function(val,key){
                    sortarray.push('{"key":"'+val+'","value":'+JSON.stringify(distArr[val])+'}');
                })      
                var sortArr = sortarray.sort(function(a, b) {
                    return parseFloat(JSON.parse(b).value.confirmed) - parseFloat(JSON.parse(a).value.confirmed);  
                }); 
                let stateListHtml = '';
                let confirmed=active=recovered=deceased = 0;
                sortArr.map(function(val,key){
                    val=JSON.parse(val);
                    console.log(val.value.confirmed);
                    
                    confirmed += val.value.confirmed;
                    active+=val.value.active;
                    recovered+=val.value.recovered;
                    deceased+=val.value.deceased;
                    stateListHtml+='<tr><td scope="col" class="stateName">'+val.key.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>' 
                        +'<td scope="col" class="cardval">'+val.value.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                        +'<td scope="col" class="cardval ">'+val.value.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                        +'<td scope="col" class="cardval">'+val.value.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                        +'<td scope="col" class="cardval">'+val.value.deceased.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' </td></tr>'
            })
                $("#stateTitle").html(stateName);
                $('#totalConfirmed').text(confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $('#totalActive').text(active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $('#totalRecovered').text(recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $('#totalDeaths').text(deceased.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));  
                $("#stateData").html(stateListHtml);
              //  var dateArr= resultData.statewise[0].lastupdatedtime.split('/');
               // var nxtdateArr= dateArr[2].split(' ');
               // var findateArr= nxtdateArr[1].split(':');
               // let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];       
               // $('#lastUpdated').html("Last Updated on : "+monthArr[(Number(dateArr[1])-1)]+" "+ dateArr[0] +" "+ nxtdateArr[1]);
        }})
    }
});
	

    const sortData = (col , type) =>{
        typesArr=["confirmed","active","recovered","deaths"];
        typesArr = typesArr.filter(item =>item != col);
        typesArr.map(function(val){
            $(".col"+val).attr("onclick",'sortData("'+val+'","desc")');
        })
        if(type == "desc"){
            var sortArr = sortarray.sort(function(a, b) {
                return parseFloat(JSON.parse(b).value[col]) - parseFloat(JSON.parse(a).value[col]);  
            });
        }else{
            var sortArr = sortarray.sort(function(a, b) {
                return parseFloat(JSON.parse(a).value[col]) - parseFloat(JSON.parse(b).value[col]);  
            });
        }

        let stateListHtml="";
        sortArr.map(function(val,key){
            val=JSON.parse(val);      
            console.log(val);
               
            if(val.state != "Total"){          
                stateListHtml+='<tr><td scope="col" class="stateName underline">'+val.value.state.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                             +'<td scope="col" class="cardval">'+val.value.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                             +'<td scope="col" class="cardval">'+val.value.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                             +'<td scope="col" class="cardval">'+val.value.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                             +'<td scope="col" class="cardval">'+val.value.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' </td></tr>'
            }
        })
        $("#stateList th i").removeClass("sortUp sortDown");
        type == "desc" ? $(".col"+col+ " i").addClass("sortDown"):$(".col"+col+" i").addClass("sortUp");
        type = (type == "desc") ? "asc":"desc";
        $(".col"+col).attr("onclick",'sortData("'+col+'","'+type+'")');
        $("#stateData").html(stateListHtml);
    }

    const sortDistrictData = (col , type) =>{
        typesArr=["confirmed","active","recovered","deaths"];
        typesArr = typesArr.filter(item =>item != col);
        typesArr.map(function(val){
            $(".col"+val).attr("onclick",'sortDistrictData("'+val+'","desc")');
        })
        if(type == "desc"){
            var sortArr = sortarray.sort(function(a, b) {
                return parseFloat(JSON.parse(b).value[col]) - parseFloat(JSON.parse(a).value[col]);  
            });
        }else{
            var sortArr = sortarray.sort(function(a, b) {
                return parseFloat(JSON.parse(a).value[col]) - parseFloat(JSON.parse(b).value[col]);  
            });
        }

        let stateListHtml="";
        sortArr.map(function(val,key){
            val=JSON.parse(val);      
            stateListHtml+='<tr><td scope="col" class="stateName">'+val.key.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                +'<td scope="col" class="cardval">'+val.value.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                +'<td scope="col" class="cardval">'+val.value.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                +'<td scope="col" class="cardval">'+val.value.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>'
                                +'<td scope="col" class="cardval">'+val.value.deceased.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' </td></tr>'

        })
        $("#stateList th i").removeClass("sortUp sortDown");
        type == "desc" ? $(".col"+col+ " i").addClass("sortDown"):$(".col"+col+" i").addClass("sortUp");
        type = (type == "desc") ? "asc":"desc";
        $(".col"+col).attr("onclick",'sortDistrictData("'+col+'","'+type+'")');
        $("#stateData").html(stateListHtml);
    }
    const getQueryParams = (qs) =>{
        qs = qs.split('&').join(' ');
    console.log(qs);
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    
        return params;
    }

    const redirectToState = (code)=>{
        window.location = "state.html?state="+code;
    }