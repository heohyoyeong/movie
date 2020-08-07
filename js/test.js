function call_ajax() {
    // if(event.keyCode == 13){

    // 입력 텍스트 상자에서 키보드로 입력이 들어왔을 때 호출
    // 모든 키에 대해서 처리하는게 아니라 enter key일 경우에만 처리
    // if(event.keyCode == 13){           //사전 경고의 의미로 바가 처진다
    // AJAX call을 이용해서 데이터를 받아오는 코드가 나오면 된다.
    // keyCode 13번은 엔터이다. 만약 입력된 key가 enter key이면 이 부분이 수행된다.
    // 서버쪽 프로그램을 호출해서 결과를 받아온다.
    // jQuery를 이용해서 AJAX 처리를 한다.
    // $.ajax("서버프로그램을 어떻게 호출할건지를 작성")
    // ajax의 인자로 javascript 객체를 넣어준다. javascript 객체는 => {key : value, key : value, .....} (JSON 표현방식)
    // 제일 처음 들어가는것은 async인데 true 혹은 false가 들어간다. true의 경우는 비동기 방식 false는 동기방식
    // url은 서버쪽 프로그램을 입력 => "http://192.168.0.200:8080/bookSearch/search" 이렇게 입력
    // data는 서버프로그램에게 넘겨줄 데이터들.. => 객체로 표시하고 jquery로 지정
    // timeout의 경우는 밀리세컨드 단위
    // dataType은 정상적으로 작동하였을때 서버로 부터 오는 데이터의 타입 // 결과 JSON을 자바스크립트 객체로 변
    var da=$("input[type=date]").val();
    var dda=da.split("-");
    var ddda=dda.join("");



    $.ajax({
        async : true,
        url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
        data : {
            key : "072e2a33352b28b0523210064d24cab7",
            targetDt : ddda
        },
        type : "GET",
        timeout : "3000",
        dataType : "json", //대소문자 상관없음 //여기까지가 이렇게 할꺼에요!! 라는 의미
        success : function (result) {
            var a = result["boxOfficeResult"]["dailyBoxOfficeList"]

            $("tbody").empty()

            $.each(a,function(idx,item){
                var tr = $("<tr></tr>") // <tr></tr>
                var titleTd = $("<td></td>").text(item.rank) //<td></td>
                tr.append(titleTd)
                var nam=item.movieNm
                var imTd=$("<td></td>")
                var ima= function () {
                    $.ajax({
                        async: true,  //동기혹은 비동기
                        url : "https://dapi.kakao.com/v2/search/image",
                        data :{
                            query : "영화 "+ nam +" 공식 포스터",
                            sort : "accuracy"
                        },
                        beforeSend : function (xhr) {
                            xhr.setRequestHeader("Authorization","KakaoAK 7fe97a043f259df41363fcdf9394aabe")
                        }, //ajax를 수행하기전에 이것을 수행하라! // xhr은 request 객체
                        type: "GET",
                        timeout : "3000",
                        dataType : "json",
                        success : function (result) {
                            var img_list= result.documents
                            var img = $("<img />").attr("src",img_list[0].thumbnail_url).addClass("myImage")
                            imTd.append(img)
                        },  //thumbnail_url
                        error : function (error) {
                            alert("서버처리실패!")
                        }
                    })
                }
                ima()
                tr.append(imTd)
                var nameTd = $("<td></td>").text(item.movieNm) //<td></td>
                var moneyTd = $("<td></td>").text(item.salesAcc) //<td></td>
                var numberTd = $("<td></td>").text(item.audiAcc) //<td></td>
                tr.append(nameTd)
                tr.append(moneyTd)
                tr.append(numberTd)
                var movTd=item.movieCd
                var deTd= $("<td></td>")
                var bu=$("<input />").attr("type", "button").attr("value", "영화상세보기")//.attr("onclick","delt()")
                bu.on("click",function(){

                    $.ajax({
                        async: true,
                        url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?",
                        data: {
                            key: "072e2a33352b28b0523210064d24cab7",
                            movieCd: movTd
                        },
                        type: "GET",
                        timeout: "3000",
                        dataType: "json", //대소문자 상관없음 //여기까지가 이렇게 할꺼에요!! 라는 의미
                        success: function (bb) {
                            var b = bb["movieInfoResult"]["movieInfo"]
                            var c = bb["movieInfoResult"]["movieInfo"]["actors"]
                            const cc = [];
                            $.each(c,function (idx,item) {
                                var ccc= item.peopleNm
                                cc.push(ccc)
                            })
                            alert("영화 제목 : "+b.movieNm+"\n제작년도 : "+b.prdtYear+"\n영화장르 : "+b["genres"][0].genreNm+"\n감독명 : "+
                                b["directors"][0].peopleNm+"\n배우명 : "+cc)

                        },
                        error : function(error){
                            alert("서버호출 실패!")
                        }
                    })//현재 발생된 이벤트가 발생된 객체를 지칭!!

                })
                deTd.append(bu)
                tr.append(deTd)
                $("tbody").append(tr)
            })
        },  //여기부터는 성공하면 이렇게 할껍니다! result는 서버가 주는 데이터를 바꾼 결과 객체
        error : function(error){
            alert("서버호출 실패!")
        }
    })

    // }
}


