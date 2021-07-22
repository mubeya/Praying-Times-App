const timeTable = document.querySelector(".timeTable");
const imsak = document.getElementById("imsak");
const gunes = document.getElementById("gunes");
const ogle = document.getElementById("ogle");
const ikindi = document.getElementById("ikindi");
const aksam = document.getElementById("aksam");
const yatsi = document.getElementById("yatsi");
const miladiTakvim = document.getElementById("miladiTakvim");
const hicriTakvim = document.getElementById("hicriTakvim");
const cityDropdown = document.getElementById("cityName");
const nowTime = document.getElementById("nowTime");

getPrayingTimes();

cityDropdown.addEventListener("input", function () {  // Get selected city from list and call function
    imsak.classList.remove("active");
    gunes.classList.remove("active");
    ogle.classList.remove("active");
    ikindi.classList.remove("active");
    aksam.classList.remove("active");
    yatsi.classList.remove("active");
    getPrayingTimes();
});

function getPrayingTimes(){
    const cityName = cityDropdown.selectedOptions[0].textContent;;
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);


    let todayDate =  day + "-" + month + "-" + year;

    miladiTakvim.innerHTML = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long'}).format(date);
    hicriTakvim.innerHTML = new Intl.DateTimeFormat('tr-TR-u-ca-islamic', { dateStyle: 'long'}).format(date).substr(5); //substr using for divide array from 6he word "Hicri"

    const url = "https://api.aladhan.com/v1/calendarByCity?city="+ cityName +" &country=turkey&method=13&&month="+month+"&year="+year+"";
    fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.warn('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (resp) {
                    resp.data.forEach(function(datas,index){
                        if(datas.date.gregorian.date == todayDate){
                            imsak.innerHTML  = `<p>İmsak  <br><span> ${datas.timings.Fajr.substr(0,5)}</span></p>`;   //show praying times on screen
                            gunes.innerHTML  = `<p>Güneş  <br><span> ${datas.timings.Sunrise.substr(0,5)}</span></p>`;
                            ogle.innerHTML   = `<p>Öğle   <br><span> ${datas.timings.Dhuhr.substr(0,5)}</span></p>`;
                            ikindi.innerHTML = `<p>İkindi <br><span> ${datas.timings.Asr.substr(0,5)}</span></p>`;
                            aksam.innerHTML  = `<p>Akşam  <br><span> ${datas.timings.Sunset.substr(0,5)}</span></p>`;
                            yatsi.innerHTML  = `<p>Yatsı  <br><span> ${datas.timings.Isha.substr(0,5)}</span></p>`;
                            
                            nowTime.innerHTML = `<p>Bilgisayar Saati</p><span>${new Date().getHours() + ":" +  new Date().getMinutes()}</span>` 

                            // check wich praying time now then make that praying time background active
                            // get timestamp from API and convert to normal human date time
                            // Math.floor(new Date().getTime()/1000.0) => now time as a timestamp
                            // toTimestamp(year,month,day,(datas.timings.Fajr.substr(0,2)-3),datas.timings.Fajr.substr(3,2) => praying time as a timestamp ( substr(0,2)-3 minus 3 for GMT timezone )

                            if      (date.getTime()/1000 > toTimestamp(year,month,day,(datas.timings.Fajr.substr(0,2)-3),datas.timings.Fajr.substr(3,2)) 
                                    && date.getTime()/1000 < toTimestamp(year,month,day,(datas.timings.Sunrise.substr(0,2)-3),datas.timings.Sunrise.substr(3,2))) {  
                                    imsak.classList.add("active");
                                    document.getElementById("nextPraying").innerHTML = `<p>Sabah Ezanına Kalan Süre <br \></p>
                                                                                        <span>${toHumanDate(toTimestamp(year,month,day,(datas.timings.Sunrise.substr(0,2)-3),datas.timings.Sunrise.substr(3,2)) - 
                                                                                        Math.floor(new Date().getTime()/1000.0))}</span>`
                            }
                            else if (date.getTime()/1000 > toTimestamp(year,month,day,(datas.timings.Sunrise.substr(0,2)-3),datas.timings.Sunrise.substr(3,2)) 
                                    && date.getTime()/1000 < toTimestamp(year,month,day,(datas.timings.Dhuhr.substr(0,2)-3),datas.timings.Dhuhr.substr(3,2))) {
                                    gunes.classList.add("active");
                                    document.getElementById("nextPraying").innerHTML = `<p>Öğle Ezanına Kalan Süre <br \></p>
                                                                                        <span>${toHumanDate(toTimestamp(year,month,day,(datas.timings.Dhuhr.substr(0,2)-3),datas.timings.Dhuhr.substr(3,2)) - 
                                                                                        Math.floor(new Date().getTime()/1000.0))}</span>`
                            }
                            else if (date.getTime()/1000 > toTimestamp(year,month,day,(datas.timings.Dhuhr.substr(0,2)-3),datas.timings.Dhuhr.substr(3,2)) 
                                    && date.getTime()/1000 < toTimestamp(year,month,day,(datas.timings.Asr.substr(0,2)-3),datas.timings.Asr.substr(3,2))) {
                                    ogle.classList.add("active");
                                    document.getElementById("nextPraying").innerHTML = `<p>İkindi Ezanına Kalan Süre <br \></p>
                                                                                        <span>${toHumanDate(toTimestamp(year,month,day,(datas.timings.Asr.substr(0,2)-3),datas.timings.Asr.substr(3,2)) - 
                                                                                        Math.floor(new Date().getTime()/1000.0))}</span>`
                            }
                            else if (date.getTime()/1000 > toTimestamp(year,month,day,(datas.timings.Asr.substr(0,2)-3),datas.timings.Asr.substr(3,2)) 
                                    && date.getTime()/1000 < toTimestamp(year,month,day,(datas.timings.Sunset.substr(0,2)-3),datas.timings.Sunset.substr(3,2))) {
                                    ikindi.classList.add("active");
                                    document.getElementById("nextPraying").innerHTML = `<p>Akşam Ezanına Kalan Süre <br \></p>
                                                                                        <span>${toHumanDate(toTimestamp(year,month,day,(datas.timings.Sunset.substr(0,2)-3),datas.timings.Sunset.substr(3,2)) - 
                                                                                        Math.floor(new Date().getTime()/1000.0))}</span>`
                            }
                            else if (date.getTime()/1000 > toTimestamp(year,month,day,(datas.timings.Sunset.substr(0,2)-3),datas.timings.Sunset.substr(3,2)) 
                                    && date.getTime()/1000 < toTimestamp(year,month,day,(datas.timings.Isha.substr(0,2)-3),datas.timings.Isha.substr(3,2))) {
                                    aksam.classList.add("active");
                                    document.getElementById("nextPraying").innerHTML = `<p>Yatsı Ezanına Kalan Süre <br \></p>
                                                                                        <span>${toHumanDate(toTimestamp(year,month,day,(datas.timings.Isha.substr(0,2)-3),datas.timings.Isha.substr(3,2)) - 
                                                                                        Math.floor(new Date().getTime()/1000.0))}</span>`
                            }
                            else{ yatsi.classList.add("active");
                                  // checking if the new day is begin for the Fajr Time calculate 
                                  // ( if now time<fajr; answer is: fajr - nowtime else answer is : endoftheday - nowtime + fajr )
                                  // resp.data[index+1].timings.Fajr for the next day fajr time calculating
                                if(Math.floor(new Date().getTime()/1000.0) > toTimestamp(year,month,day,(resp.data[index+1].timings.Fajr.substr(0,2)-3), resp.data[index+1].timings.Fajr.substr(3,2))){
                                    document.getElementById("nextPraying").innerHTML = `<p>İmsak Vaktine Kalan Süre</p>
                                                                                        <p>${toHumanDate( toTimestamp(year,month,day,20,59) - Math.floor(new Date().getTime()/1000.0) +
                                                                                        resp.data[index+1].timings.Fajr.substr(1,1)*3600 +  resp.data[index+1].timings.Fajr.substr(3,2)*60)}</p>`  // *3600 for hour and *60 for minutes calculate for timestamp
                                }
                                else {
                                    document.getElementById("nextPraying").innerHTML = `<p>İmsak Vaktine Kalan Süre</p>
                                                                                        <p>${toHumanDate(toTimestamp(year,month,day,( resp.data[index+1].timings.Fajr.substr(0,2)-3), resp.data[index+1].timings.Fajr.substr(3,2)) 
                                                                                        - Math.floor(new Date().getTime()/1000.0))}</p>`
                                }  
                            }
                        }
                    });               
                });
            })
                
            .catch(function (err) {
               console.error('Fetch Error -', err);
            });
}


function toTimestamp(year,month,day,hour,minute){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute));
    return Math.floor(datum.getTime()/1000);
}


function toHumanDate(unix_timestamp){  //convert timestamp to real human date for newx praying calculate
    const hour = ('0' + Math.floor((unix_timestamp / 60) / 60)).slice(-2); 
    const minute = ('0' + Math.floor((unix_timestamp / 60) % 60)).slice(-2) ;
    return hour + ":" + minute;
}
