let ytt="";
var htmlTxt = {};
var version = "v3.0";
var scriptID = "AKfycbz_sVsR3XryGOtjQ6dEI7W07oZs0eqcKXXPc8vCB32fQqr_RU72";
var uploadFormat = "";

// sbv to json
function sbvJson(sbvData) {
  sbv = sbvData.split("\n");
  var output = {};
  var outputCount = 0;
  for (var i = 0; i < sbv.length; i++) {
  if (sbv[i].match(/.*:.*:.*,.*:.*:.*/)) {
    sbvTime = sbv[i].split(",");
    var t = listFloat(sbvTime[0].split(":"));
    t = parseInt(((t[0]*60+t[1])*60+t[2])*1000);
    if ( t==0 ) {t=1};
    var d = listFloat(sbvTime[1].split(":"));
    d = parseInt(((d[0]*60+d[1])*60+d[2])*1000 - t);
    output[outputCount] = {"time":{"sbv":sbv[i],"t":t,"d":d},"subtitle":""}
  } else if ((sbv[i].length == 1 || sbv[i] == "") && sbv[i+1] !== "") {
    outputCount++;
  } else {
    if (output[outputCount]["subtitle"] != "") {
      output[outputCount]["subtitle"] = output[outputCount]["subtitle"]+"\n"+sbv[i];
    }else { 
      output[outputCount]["subtitle"] = sbv[i];
    }
  }
  }
  return output
}
// colour json
function colourJson() {
  var colour = {};
  var colourNameList = document.getElementsByClassName("colourName");
  var colourCodeList = document.getElementsByClassName("colourCode");
  colour['default'] = {"id":0,"code":`#${colourCodeList[0].value.toUpperCase()}`};
  for (var i = 1; i < colourNameList.length; i++) {
    colour[`${colourNameList[i].value}`] = {"id":i,"code":`#${colourCodeList[i].value.toUpperCase()}`}
  }
  return colour
}
// sbv colour json
function sbvJsonColour(sbvData, colour) {
  var output = {};
  var txt = [];
  for (var iii = 0; iii < Object.keys(sbvData).length; iii++) {
    output[iii] = {"time":sbvData[iii]["time"],"subtitle":[]};
    if (sbvData[iii]["subtitle"]) {
      var sbv = sbvData[iii]["subtitle"].split("\n");
      for (var i = 0; i < sbv.length; i++) {
        if (sbv[i].match(/.*[:|\uff1a].*/)) {
          txt = sbv[i].split(/:|\uff1a/,2);
          if (txt[0].match(/.*[,|&|\u3001|、].*/)) {
            var speaker = txt[0].split(/,|&|\u3001|、/)
            for (var ii = 0; ii < speaker.length; ii++) {
              if (typeof(colour[speaker[ii].split(' ').join('')]) == "undefined") {c=0} else {c=colour[speaker[ii].split(' ').join('')]["id"]}
              if (ii < speaker.length-1) {
                output[iii]["subtitle"].push({"c":c,"d":`${speaker[ii]}`});
                output[iii]["subtitle"].push({"c":0,"d":`&`});}
              else {output[iii]["subtitle"].push({"c":c,"d":speaker[ii]});}
            }
            output[iii]["subtitle"].push({"c":0,"d":`\uff1a${txt[1]}`});
          } else {
            if (typeof(colour[txt[0].split(' ').join('')]) == "undefined") {c=0} else {c=colour[txt[0].split(' ').join('')]["id"]}
            output[iii]["subtitle"].push({"c":c,"d":sbv[i]})
          }
        } else {
          output[iii]["subtitle"].push({"c":0,"d":sbv[i]})
        }
        output[iii]["subtitle"].push({"c":0,"d":"\n"})
      }
    }   
  }
  return output
}
function videoID(fid) {
  var url = document.getElementById(fid).value
  if (url.match("https://www.youtube.com/watch.*v=.*")) {
    valid(fid);
    return new URL(url).search.split(/&|=/)[1]
  } else if (url.match("https://youtu.be/")) {
    valid(fid);
    return url.split(".be/")[1];
  } else if (url.match("https://studio.youtube.com/video/")) {
    valid(fid);
    return url.split("/")[4];
  } else if (url.match("https://www.youtube.com/timedtext_editor.*v=.*")) {
    valid(fid);
    return new URL(url).search.split(/&|=/)[1]
  }
   else {
    invalid(fid);
    return false
  }
}
function invalid(id) {
  $("#"+id).removeClass("is-valid");
  $("#"+id).addClass("is-invalid");
}
function valid(id) {
  $("#"+id).removeClass("is-invalid");
  $("#"+id).addClass("is-valid");
}
function updateDIV(oldDIV,newDIV) {
  $(`#${oldDIV}`).css("display","none");
  $(`#${newDIV}`).css("display","inline");
}
function updatePageSelect(last,next) {
  $("#pageSelector").css("display","inline");
  if ( last == "" ) {$("#last").css("display","none");} 
  else {$("#last").css("display","inline");$("#last").attr("onclick",last);}
  if ( next == "" ) {$("#next").css("display","none");} 
  else {$("#next").css("display","inline");$("#next").attr("onclick",next);}
}
// Operations when the web page is loaded.
function appOnLoad() {
  returnApp();
  $('#StepStart').load('html_part/app/start');
  $('#StepSBVUpload').load('html_part/app/1a_sbv_upload');
  $('#StepImportYt').load('html_part/app/1b_from_youtube');
  $('#StepPreviewSBV').load('html_part/app/2_preview_sbv');
  $('#StepColourSetting').load('html_part/app/3_colour_setting');
  $('#StepPreview').load('html_part/app/4_preview_new');
  $('#StepDownload').load('html_part/app/5a_download');
  $('#StepUpload').load('html_part/app/5b_upload');
  window.addEventListener('message',function(e){
    if (e.data[0] == "Height") {
      $("#"+e.data[1]).css("height",e.data[2])
    } else if (e.data[0] == "video_caption") {
      previewSBVStep(e.data[1]);
      updateDIV("StepImportYt","StepPreviewSBV");
    } else if (e.data[0] == "login") {
      $("#googleLogin").css("display","none");
    } else if (e.data[0] == "upload") {
      var uploadData = JSON.parse(e.data[1])
      if (uploadData.hasOwnProperty('kind')) {
        $("#uploadSuccess").css("display","inline");
        $("#uploadFormOutput").css("display","none");
        $("#youtubePreview").css("display","inline");
        $("#youtubePreview").attr("src",$("#youtubePreview").attr("src"));
        $("#uploading").css("display","none");
      } else {
        $("#uploadFail").css("display","inline");
        $("#uploadFormOutput").css("display","none");
        $("#uploadFailMsg").html(e.data[1]);
      }
    }
  },false);
  onLoad();
} 
// step 1
function uploadSBVStep() {
  updateDIV("StepStart","StepSBVUpload");
  updatePageSelect("returnApp()","previewUploadSBVStep()");
  document.querySelector('#sbvupload').addEventListener('change', (e) => {
    previewUploadSBVStep();});
  uploadFormat = "backUploadSBVStep()";
}
function ytSubtitleStep() {
  $("#googleLogin").css("display","inline");
  if (uploadFormat !== "backYoutubeCCStep()") {
  $("#downloadForm").attr("src",`https://script.google.com/macros/s/${scriptID}/exec?hl=${localStorage.getItem('lang')}`)}
  updateDIV("StepStart","StepImportYt");
  updatePageSelect("returnApp()","");
  uploadFormat = "backYoutubeCCStep()";
}
// step 2
function backUploadSBVStep() {
  updateDIV("StepPreviewSBV","StepSBVUpload");
  updatePageSelect("returnApp()","previewUploadSBVStep()");
}
function backYoutubeCCStep() {
  updateDIV("StepPreviewSBV","StepImportYt");
  updatePageSelect("returnApp()","");
}
function previewUploadSBVStep() {
  var sbvFiles = document.getElementById("sbvupload").files;
  if (!sbvFiles.length) {
    invalid("sbvupload")
  } else if (sbvFiles[0].name.match('.sbv')) {
    valid("sbvupload");
    updateDIV("StepSBVUpload","StepPreviewSBV");
    updatePageSelect("backUploadSBVStep()","colourSettingStep()");
    uploadFormat="backUploadSBVStep()"
    try {
      const sbvreader = new FileReader();
      sbvreader.onload = function (e) {
        sbv = e.target.result;
        previewSBVStep(sbv);
      };
      sbvreader.readAsText(sbvFiles[0]);
      } catch(e) {
      showerror(e)
    }
  }
}
function previewYTSBVStep() {
  updateDIV("StepImportYt","StepPreviewSBV");
  updatePageSelect("backYoutubeCCStep()","colourSettingStep()");
  uploadFormat="backYoutubeCCStep()";
}
function previewSBVStep(sbv) {
  document.getElementById("sbvRPreview").innerHTML = sbv.split(" \n").join("");
  updateDIV("sbvPreviewLoading","sbvRPreview");
  updatePageSelect(uploadFormat,"colourSettingStep()");
  $("#sbvTPreview").css("display","none");
}
function showRawDataView() {
  updateDIV("sbvTPreview","sbvRPreview");
  $("#sbvRPreviewBtn").addClass("disabled");
  $("#sbvTPreviewBtn").removeClass("disabled");
  $("#sbvEPreviewBtn").removeClass("disabled");
}
function EditRawData(){
  $("#sbvEPreviewBtn").attr("onclick","SaveRawData()");
  $("#sbvEPreviewBtn").html(`<i class="material-icons">save</i><span data-translate="_save"></span>`);
  updateTxt();  $('#sbvRPreview').prop('readonly', false);
}
function SaveRawData(){
  $("#sbvEPreviewBtn").attr("onclick","EditRawData()");
  $("#sbvEPreviewBtn").html(`<i class="material-icons">create</i><span data-translate="_edit"></span>`);
  updateTxt();  $('#sbvRPreview').prop('readonly', true);
}
function showTableView() {
  let output = '<table class="table table-dark"><thead><tr><th scope="col" data-translate="_time">Time</th><th scope="col" data-translate="_subtitle">Subtitle</th></tr></thead><tbody>';
  var sbvJsonData = sbvJson(document.getElementById("sbvRPreview").value)
  for (var i = 0; i < Object.keys(sbvJsonData).length; i++) { 
    if (sbvJsonData[i]["time"]) {
      if (sbvJsonData[i]["time"]["d"] < 0) {var error = "bg-danger"} else {var error = ""}
      output += `<tr class="${error}" ><th scope="row">${sbvJsonData[i]["time"]["sbv"]}</th><td>`
    }
    if (sbvJsonData[i]["subtitle"]) {
      output += sbvJsonData[i]["subtitle"].split('\n').join('<br>')
    }
    output += "</td></tr>"
  }
  output += "</tbody></table>"
  document.getElementById("sbvTPreview").innerHTML = output;
  updateDIV("sbvRPreview","sbvTPreview");
  document.getElementById("sbvRPreviewBtn").classList.remove("disabled");
  document.getElementById("sbvTPreviewBtn").classList.add("disabled");
  document.getElementById("sbvEPreviewBtn").classList.add("disabled");
}
// step 3
function backPreviewSbvVStep() {
  updateDIV("StepColourSetting","StepPreviewSBV");
  updatePageSelect(uploadFormat,"colourSettingStep()");
  colorPweviewR("0");
}
function colourSettingStep() {
  updateDIV("StepPreviewSBV","StepColourSetting");
  updatePageSelect('backPreviewSbvVStep()',"previewStep()");
  document.querySelector('#colorupload').addEventListener('change', (e) => {
    loadJSON();});
  colorPweview("0");
}
function listFloat(list) {
  var newList = [];
  for (var i = 0; i < list.length; i++) {
    newList.push(parseFloat(list[i]))
  }
  return newList
}
function loadJSON() {
  removeAllColour();
  try {
  let fileToLoad = document.getElementById("colorupload").files[0];
  let fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
      prepareJson = JSON.parse(fileLoadedEvent.target.result);
      let keys = Object.keys(prepareJson);
      if (prepareJson["default"]) {
        document.getElementById("colourCode0").value = prepareJson["default"];}
      for (let i = 1; i < keys.length; i++) {
          let key = keys[i];
          addColour(key,prepareJson[key]);
      }
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
  } catch(e) {removeAllColour();
  }
}
function removeAllColour(){    
  var colourNameList1 = document.getElementsByClassName("colourLI");
  for (var i = colourNameList1.length;i--;) {
    colourNameList1[i].remove();}
}
function addNewColour(){
  var colourNameList2 = document.getElementsByClassName("colourName");
  addColour(`Speaker${colourNameList2.length}`,"FFFFFF");
}
function colourListTxt(i,colourName,colourCode){
  return `<li id="colour${i}" class="colourLI list-group-item">
  <div class="input-group col-12">
    <input type="text" id="colourName${i}" class="colourName form-control" placeholder="Name" aria-describedby="inputGroupPrepend" value="${colourName}" required>
    &nbsp;&nbsp;
    <div class="input-group-prepend"><span class="input-group-text" id="inputGroupPrepend">#</span></div>
    <input type="text" id="colourCode${i}" class="colourCode form-control" value="${colourCode}" aria-describedby="inputGroupPrepend" pattern="^[A-Fa-f0-9]{6}$" required>
    <label id="colourPickerBtn${i}" class="form-control input-group-text col-1" for="colorPicker${i}"><span class="material-icons">color_lens</span></label>
    &nbsp;&nbsp;
    <input id="colorPicker${i}" value="#ffffff" class="colorPicker" type="color">
    &nbsp;&nbsp;
    <span id="colourPreview${i}" class="colourPreview form-control" style="color:#${colourCode};">Preview 預覽</span>
    &nbsp;&nbsp;
    <a class="btn btn-danger" onclick="removeColour(${i})" href="#" role="button"><span class="material-icons">delete</span></a>&nbsp;
  </div>
</li>`
}
function addColour(colourName,colourCode) {
  var colourNameList3 = document.getElementsByClassName("colourName");
  var colourCodeList = document.getElementsByClassName("colourCode");
  var ctxt = ""
  for (var i = 1; i < colourNameList3.length; i++) {
    ctxt += colourListTxt(i,colourNameList3[i].value,colourCodeList[i].value)
  }
  ctxt += colourListTxt(colourNameList3.length,colourName,colourCode)
  document.getElementById("colourList").innerHTML = ctxt;
  for (var i = 1; i < colourNameList3.length; i++) {
  colorPweview(i); }
}
function colorPweview(id) {console.log(id)
  $(`#colourCode${id}`).on( "change", function() {
    var cValue = $( this ).val();
    if (cValue.match(/[A-Fa-f0-9]{6}/)) {
      $(`#colourPreview${id}`).css("color",`#${cValue.toUpperCase()}`);
    }
  });
  $(`#colorPicker${id}`).on( "change", function() {
    var cValue = $( this ).val().split('#').join('');
    $(`#colourPreview${id}`).css("color",`#${cValue.toUpperCase()}`);
    $(`#colourCode${id}`).val(`${cValue}`);
  });
}
function colorPweviewR(id) {
  $(`#colourCode${id}`).off("change");
  $(`#colourPicker${id}`).off("change");
}

function removeColour(id) {document.getElementById(`colour${id}`).remove();colorPweviewR(id);}
function saveJSON() {
  let colourJson = {};
  var colourNameList4 = document.getElementsByClassName("colourName");
  var colourCodeList = document.getElementsByClassName("colourCode");
  colourJson["default"] = document.getElementById("colourCode0").value
  for (var i = 1; i < colourNameList4.length; i++) {
    colourJson[colourNameList4[i].value] = colourCodeList[i].value;}
  let blob = new Blob([JSON.stringify(colourJson)], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "colour.json");
}
// step 4
function backColourSettingStep() {
  updateDIV("StepPreview","StepColourSetting");
  updatePageSelect('backPreviewSbvVStep()',"previewStep()");
}
function previewStep() {
  let output = '<table class="table table-dark"><thead><tr><th scope="col" data-translate="_timeSbv">Time(sbv)</th><th scope="col" data-translate="_timeXml">Time(xml)</th><th scope="col" data-translate="_subtitle">Subtitle</th></tr></thead><tbody>'
  var sbvJsonData = sbvJson(document.getElementById("sbvRPreview").value)
  var colourJsonData = colourJson();
  var previewJsonData = sbvJsonColour(sbvJsonData, colourJsonData);
  var colourIDJson = {};
  for (var i = 0; i < Object.keys(colourJsonData).length; i++) { 
    colourIDJson[colourJsonData[Object.keys(colourJsonData)[i]]["id"]] = colourJsonData[Object.keys(colourJsonData)[i]]["code"]
  }
  for (var i = 0; i < Object.keys(previewJsonData).length; i++) { 
    if (previewJsonData[i]["time"]) {
      if (previewJsonData[i]["time"]["d"] < 0) {var error = "bg-danger"} else {var error = ""}
      output += `<tr class="${error}" ><th scope="row">${previewJsonData[i]["time"]["sbv"]}</th><td>t="${previewJsonData[i]["time"]["t"]}" d="${previewJsonData[i]["time"]["d"]}"</td><td>`
    }
    for (var ii = 0; ii < previewJsonData[i]["subtitle"].length; ii++) {
      output += `<span style="color:${colourIDJson[previewJsonData[i]["subtitle"][ii]["c"]]};">${previewJsonData[i]["subtitle"][ii]["d"].split('\n').join('<br>')}</span>`
    }
    output += "</td></tr>"
  }
  output += "</tbody></table>";
  $("#preview").html(output);
  updateDIV("StepColourSetting","StepPreview");
  updatePageSelect('backColourSettingStep()',"DownloadStep()");
}
// step 5 download
function backPreviewStep() {
  updateDIV("StepDownload","StepPreview");
  updatePageSelect('backColourSettingStep()',"DownloadStep()");
}
function DownloadStep() {
  let output = '<?xml version="1.0" encoding="utf-8"?>\n<timedtext format="3">\n<head>\n<wp id="0" ap="7" ah="50" av="100" />\n<ws id="0" ju="2" pd="0" sd="0" />\n'
  var sbvJsonData = sbvJson(document.getElementById("sbvRPreview").value)
  var colourJsonData = colourJson();
  var previewJsonData = sbvJsonColour(sbvJsonData, colourJsonData);
  var colourIDJson = {};
  for (var i = 0; i < Object.keys(colourJsonData).length; i++) { 
    output += `<pen id="${colourJsonData[Object.keys(colourJsonData)[i]]["id"]}" sz="120" fc="${colourJsonData[Object.keys(colourJsonData)[i]]["code"].toUpperCase()}" fo="254" bo="0" et="3" ec="#000000" />\n`
  }
  for (var i = 0; i < Object.keys(previewJsonData).length; i++) { 
    if (previewJsonData[i]["time"]) {
      output += `<p t="${previewJsonData[i]["time"]["t"]}" d="${previewJsonData[i]["time"]["d"]}" p="0" wp="0" ws="0">`
    }
    for (var ii = 0; ii < previewJsonData[i]["subtitle"].length; ii++) {
      output += `\n<s p="${previewJsonData[i]["subtitle"][ii]["c"]}">${previewJsonData[i]["subtitle"][ii]["d"]}</s>`
    }
    output += "</p>\n"
  }
  output += "</body></timedtext>";
  $("#xmlPreview").val(output.split('<s p="0">\n</s>').join(""));
  $("#xmlPreview").css("display","inline");
  updateDIV("StepPreview","StepDownload");
  updatePageSelect('backPreviewStep()',"");
}
// step 5 upload
function backDownloadStep() {
  updateDIV("StepUpload","StepDownload");
  updatePageSelect('backPreviewStep()',"");
  $("#googleLogin").css("display","none");
}
function uploadStep() {
  $("#googleLogin").css("display","inline");
  $("#langUpload").val(localStorage.getItem('lang'))
  $("#uploadFormPost").attr("action",`https://script.google.com/macros/s/${scriptID}/exec`);
  var langdata = {};
  $.getJSON(`lang/lang_${localStorage.getItem('lang')}.json`, function(data) {langdata=data;});
  $.getJSON('lang/YoutubeLang.json', function(data) {
    var ytlanglist = [];var output="";
    ytlanglist = data["youtube#i18nLanguageList"]
    for (var i=0; i < ytlanglist.length;i++) {
      output+=`<option value="${ytlanglist[i]}">${langdata[ytlanglist[i]]}</option>`
    };
    document.getElementById("ytLang").innerHTML = output;
    $(`option[value="${localStorage.getItem("ytLang")}"]`).prop('selected', true);
  });
  updateDIV("StepDownload","StepUpload");
  updatePageSelect('backDownloadStep()',"");
  document.querySelector('#ytLang').addEventListener('change', (e) => {
    localStorage.setItem('ytLang', document.querySelector('#ytLang').value);
  })
  document.querySelector('#youtubeVideo').addEventListener('change', (e) => {
    var id =  videoID("youtubeVideo");
    if (id==false) {
      $("#youtubePreview").css(".display", "none")
      document.getElementById("uploadBtn").classList.add("disabled");
      $("#uploadBtn").attr("onclick","")
      return false
    }
    $("#youtubeVideo").removeClass('is-invalid')
    $("#youtubeVideo").addClass('is-valid')
    $("#youtubeVideoId").val(id)
    $("#youtubePreview").attr("src", `https://www.youtube.com/embed/${id}`)
    $("#youtubePreview").css(".display", "inline")
    $("#uploadBtn").attr("onclick","upload()")
    $("#uploadBtn").removeClass('disabled')
  });
  
}
// doenload/upload action
function download() {
  let blob = new Blob([document.getElementById("xmlPreview").value], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "subtitle.xml");
}
function upload() {
  $("#uploading").css("display","inline")
  document.getElementById("uploadFormPost").submit();
  $("#youtubePreview").css("display","none");
  $("#uploadFormOutput").css("height",500)
  updateDIV("uploadForm","uploadFormOutput")
  updatePageSelect('backUploadStep()',"");
}
function backUploadStep() {
  updateDIV("uploadFormOutput","uploadForm");
  $("#youtubePreview").css("display","inline")
  updatePageSelect('backPreviewStep()',"");
  $("#uploadSuccess").css("display","none")
  $("#uploadFail").css("display","none")
  $(".uploadStaus").css("display","none")
}

function returnApp() {
  updateDIV("loadingIcon","app");
  $("#googleLogin").css("display","none");
  document.getElementById("StepStart").style.display = "inline";
  [].forEach.call(document.querySelectorAll('.step'), function (el) {
    el.style.display = 'none';
  });
}
// error
function showerror(msg) {
  updateDIV("app","error");
  document.getElementById('errormsg').innerHTML = msg;
  [].forEach.call(document.querySelectorAll('.step'), function (el) {
    el.style.display = 'none';
  });
} 