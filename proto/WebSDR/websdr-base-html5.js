
// WebSDR JavaScript part
// Copyright 2007-2013, Pieter-Tjerk de Boer, pa3fwm@websdr.org
// Naturally, distributing this file by the original WebSDR server software to WebSDR clients is permitted.


// variables governing what the user listens to:
var lo=-2.7,hi=-0.3;   // edges of passband, in kHz w.r.t. the carrier
var mode="LSB";            // 1 if AM, 0 otherwise (SSB/CW); or text "AM", "FM" etc
var band=0;            // id of the band we're listening to
var freq=bandinfo[0].vfo;  // frequency (of the carrier) in kHz
var memories = [ ];


// variables governing what the user sees:
var Views={ allbands:0, othersslow:1, oneband:2, blind:3 };
var view=Views.blind;
var nwaterfalls=0;
var waterslowness=4;
var waterheight=100;
var watermode=1;
var scaleheight=44;
//var scaleheight=14;


// information about the available "virtual" bands:
// contains: effsamplerate, effcenterfreq, zoom, start, minzoom, maxzoom, samplerate, centerfreq, vfo, scaleimgs, realband
var bi = new Array();
// number of bands:
var nvbands=nbands;


// references to objects on the screen:
var scaleobj;
var scaleobjs = new Array();
var scaleimgs0 = new Array();
var scaleimgs1 = new Array();
var passbandobj;
var edgelowerobj;
var edgeupperobj;
var carrierobj;
var smeterobj;
var numericalsmeterobj;
var smeterpeakobj;
var numericalsmeterpeakobj;
var waterfallapplet = new Array();
var soundapplet = null;

// timers:
var interval_updatesmeter;
var interval_ajax3;


// misc
var serveravailable=-1;  // -1 means yet to be tested, 0 and 1 mean false and true
var smeterpeaktimer=2;
var smeterpeak=0;    
var allloadeddone=false;
var waitingforwaterfalls=0;  // number of waterfallapplets that are still in the process of starting
var band_fetchdxtimer=new Array();
var hidedx=0;
var usejavawaterfall=1;
var usejavasound=1;
var isTouchDev = false;


// derived quantities:
var khzperpixel=bandinfo[band].samplerate/1024;
var passbandobjstart=0;    // position (in pixels) of start of passband on frequency axis, w.r.t. location of carrier
var passbandobjwidth=0;    // width of passband in pixels
var centerfreq=bandinfo[band].centerfreq;




function debug(a)
{
//   console.debug(a);
}


// from http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}


function send_soundsettings_to_server()
{
  var m=mode;
  if (m=="USB") m=0;
  else if (m=="LSB") m=0;
  else if (m=="CW") m=0;
  else if (m=="AM") m=1;
  else if (m=="FM") m=4;
  try {
     soundapplet.setparam(
         "f="+freq
        +"&band="+band
        +"&lo="+lo
        +"&hi="+hi
        +"&mode="+m
        +"&name="+encodeURIComponent(document.usernameform.username.value) 
        );
  } catch (e) {};
}


function setsquelch(a)
{
   a=Number(a);
   soundapplet.setparam("squelch="+a);
}

function setautonotch(a)
{
   a=Number(a);
   soundapplet.setparam("autonotch="+a);
}

function setmute(a)
{
   a=Number(a);
   soundapplet.setparam("mute="+a);
}


function draw_passband()
{
   passbandobjstart=Math.round((lo-0.045)/khzperpixel);
   passbandobjwidth=Math.round((hi+0.045)/khzperpixel)-passbandobjstart;
   if (passbandobjwidth == 0) passbandobjwidth = 1;
   passbandobj.style.width=passbandobjwidth+"px";
   if (!scaleobj) return;

   var x=(freq-centerfreq)/khzperpixel+512;
   var maxx = parseInt(scaleobj.style.width);
   if (isTouchDev && x > maxx) x = maxx;
   var y=scaleobj.offsetTop+15;
   passbandobj.style.top=y+"px";
   edgelowerobj.style.top=y+"px";
   edgeupperobj.style.top=y+"px";
   carrierobj.style.top=y+"px";
   carrierobj.style.left=x+"px";
   x=x+passbandobjstart;
   passbandobj.style.left=x+"px";
   edgelowerobj.style.left=(x-11)+"px";
   edgeupperobj.style.left=(x+passbandobjwidth)+"px";
}


function iscw()
{
   return hi-lo < 1.0;
}

function nominalfreq()
{
   if (iscw()) return freq+(hi+lo)/2;
   return freq;
}

function freq2x(f,b)
{
   return (f-bi[b].effcenterfreq)*1024/bi[b].effsamplerate+512;
}

function setwaterfall(b,f)
// adjust waterfall so passband is visible
{
   if (waitingforwaterfalls>0) return;
   var x = freq2x(f,b);
   if (x<0 || x>=1024) wfset_freq(b, bi[b].zoom, f);
}


function dx(freq,mode,text)
// called by updates fetched from the server
{
   dxs.push( { freq:freq, mode:mode, text:text } );
}

function setfreqm(b,f,mo)
{
   setband(b);
   set_mode(mo);
   if (iscw()) f-=(hi+lo)/2;
   setfreq(f);
}


function showdx(b)
{
   var s='';
   if (!hidedx) {
      var mems=memories.slice();
      for (i=0;i<mems.length;i++) mems[i].nr=i;
      mems.sort(function(a,b){return a.nomfreq-b.nomfreq});
      for (i=0;i<dxs.length;i++) {
         var x = freq2x(dxs[i].freq,b);
         var nextx;
         if (x>1024) break;
         if (i<dxs.length-1) nextx=freq2x(dxs[i+1].freq,b);
         else nextx=1024;
         if (nextx>=1024) nextx=1280;
         if (x<0) continue;
         var fr=dxs[i].freq;
         var mo=dxs[i].mode;
         s+='<div title="" class="statinfo2" style="max-width:'+(nextx-x)+'px;left:'+(x-6)+'px;top:'+(44-scaleheight)+'px;">';
         s+='<div class="statinfo1"><div class="statinfo0" onclick="setfreqm(b,'+fr+','+"'"+mo+"'"+');">'+dxs[i].text+'<\/div><\/div><\/div>';
         s+='<div title="" class="statinfol" style="width:1px;height:44px;position:absolute;left:'+x+'px;top:-'+scaleheight+'px;"><\/div>';
      }
      for (i=0;i<mems.length;i++) if (mems[i].band==b) {
         var x=freq2x(mems[i].nomfreq,b);
         var nextx;
         if (x>1024) break;
         if (i<mems.length-1) nextx=freq2x(mems[i+1].nomfreq,b);
         else nextx=1024;
         if (nextx>=1024) nextx=1280;
         if (x<0) continue;
         var fr=mems[i].freq;
         var mo=mems[i].mode;
         s+='<div title="" class="statinfo2l" style="max-width:'+(nextx-x)+'px;left:'+(x-6)+'px;top:'+(64-scaleheight)+'px;">';
         var l=mems[i].label;
         if (!l || l=='') l='mem '+mems[i].nr;
//         s+='<div class="statinfo1l"><div class="statinfo0l" onclick="setfreqm(b,'+fr+','+"'"+mo+"'"+');">'+mems[i].label+'<\/div><\/div><\/div>';
         s+='<div class="statinfo1l"><div class="statinfo0l" onclick="setfreqm(b,'+fr+','+"'"+mo+"'"+');">'+l+'<\/div><\/div><\/div>';
         s+='<div title="" class="statinfoll" style="width:1px;height:64px;position:absolute;left:'+x+'px;top:-'+scaleheight+'px;"><\/div>';
      }
   }
   document.getElementById('blackbar'+band2id(b)).innerHTML=s;
   if (s!='') {
      document.getElementById('blackbar'+band2id(b)).style.height='64px';
   } else {
      document.getElementById('blackbar'+band2id(b)).style.height='30px';
   }
}

function fetchdx(b)
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Your browser does not support AJAX!"); return false; } } }
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
        if (xmlHttp.responseText!="") {
          eval(xmlHttp.responseText);
          showdx(b);
        }
      }
    }
  var url="/~~fetchdx?min="+(bi[b].effcenterfreq-bi[b].effsamplerate/2)+"&max="+(bi[b].effcenterfreq+bi[b].effsamplerate/2);
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}


function setscaleimgs(b,id)
{
   var e=bi[b];
   var st=e.start/(1<<(e.maxzoom-e.zoom));
   scaleimgs0[id].src = e.scaleimgs[e.zoom][st>>10];
   if (e.scaleimgs[e.zoom][1+(st>>10)]) scaleimgs1[id].src = e.scaleimgs[e.zoom][1+(st>>10)];
   else scaleimgs1[id].src=scaleimgs0[id].src;
   scaleimgs0[id].style.left = (-(st%1024))+"px";
   scaleimgs1[id].style.left = (1024-(st%1024))+"px";
}


// this function is called from java when the scrollwheel is moved to change the zoom
function zoomchange(id,zoom,start)
{
   var b=id2band(id);
   var e=bi[b];
   var oldzoom=e.zoom;
   e.effsamplerate = e.samplerate/(1<<zoom);
   e.effcenterfreq = e.centerfreq - e.samplerate/2 + (start*(e.samplerate/(1<<e.maxzoom))/1024) + e.effsamplerate/2;
   e.zoom=zoom;
   e.start=start;
   setscaleimgs(b,id);
   if (b==band) {
      khzperpixel = bi[band].effsamplerate/1024;
      centerfreq = bi[band].effcenterfreq;
      updbw();
   }
   if (!hidedx) {
      clearTimeout(band_fetchdxtimer[b]);
      if (zoom!=oldzoom) {
         dxs=[]; document.getElementById('blackbar'+id).innerHTML=""; 
         if (bi[b].effsamplerate<660) fetchdx(b);
      } else {
         if (bi[b].effsamplerate<660) {
            showdx(b);
            band_fetchdxtimer[b] = setTimeout('dxs=[]; fetchdx('+b+');',400);
         }
      }
   }
}


var dont_update_textual_frequency=false;

function setfreq(f)
{
   freq=f;
   document.getElementById("javawarning").style.display = 'none'; document.getElementById("javawarning").style.display = 'block';  // utter nonsense, but forces IE8 to update the screen :(
   send_soundsettings_to_server();
   if (view!=Views.blind) draw_passband();
   if (dont_update_textual_frequency) return;
   var nomfreq=nominalfreq();
   if (freq.toFixed) document.freqform.frequency.value=nomfreq.toFixed(2);
   else document.freqform.frequency.value=nomfreq+" kHz";
}

function setfreqb(f)
// sets frequency but also autoselects band
{
   if (iscw()) f-=(hi+lo)/2;
   var e=bi[band];
   if (f>e.centerfreq-e.samplerate/2-4 && f<e.centerfreq+e.samplerate/2+4) {
      // new frequency is in the current band
      setwaterfall(band,f);
      setfreq(f);
      return;
   }
   // new frequency is not in the current band: then search through all bands until we find the right one (if any)
   for (i=0;i<nvbands;i++) {
      e=bi[i];
      c=e.centerfreq;
      w=e.samplerate/2+4;
      if (f>c-w && f<c+w) {
         e.vfo=f;
         setband(i);
         return;
      } 
   }
}

function setfreqif(str)
// called when frequency is entered textually
{
   f=parseFloat(str);
   if (f<=0) return;
   dont_update_textual_frequency=true;
   setfreqb(f);
   dont_update_textual_frequency=false;
   document.freqform.frequency.value=str;
}



function setmf(m, l, h)   // "set mode and filter"
{
   mode=m.toUpperCase();
   lo=l;
   hi=h;
   updbw();
}

function setmode(m)       // ...without changing filter
{
   mode=m.toUpperCase;
}

function set_mode(m)      // ...with appropriate filter
{
   switch (m.toUpperCase()) {
      case "USB": setmf("usb", 0.3,  2.7); break;
      case "LSB": setmf("lsb", -2.7, -0.3); break;
      case "AM":  setmf("am", -4,  4); break;
      case "CW":  setmf("cw", -0.95,  -0.55); break;
      case "FM":  setmf("fm", -8,  8); break;
   }
}


function mem_recall(i)
{
   setband(memories[i].band);
   mode=memories[i].mode;
   lo=memories[i].lo;
   hi=memories[i].hi;
   updbw();
   setfreq(memories[i].freq);
   setwaterfall(band,memories[i].freq);
}

function mem_erase(i)
{
   var b=memories[i].band;
   memories.splice(i,1);
   mem_show();
   showdx(b);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_store(i)
{
   var nomf=nominalfreq();
   var l;
   try { l=memories[i].label;} catch(e){ l=''; };
   memories[i]={freq:freq, nomfreq:nomf, band:band, mode:mode, lo:lo, hi:hi, label:l };
   mem_show();
   showdx(memories[i].band);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_label(i,nw)
{
   memories[i].label=nw;
   showdx(memories[i].band);
   try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
}

function mem_show()
{
   var i;
   var s="";
   for (i=0;i<memories.length;i++) {
      var m="";
      m=memories[i].mode;
      s+='<tr>';
      s+='<td><input type="button" title="recall" value="recall" onclick="mem_recall('+i+')"><input type="button" title="erase" value="erase" onclick="mem_erase('+i+')"><input type="button" title="store" value="store" onclick="mem_store('+i+')"></td>';
      s+='<td>'+memories[i].nomfreq.toFixed(2)+' kHz '+m+'</td>';
      s+='<td><input title="label for this memory location" type="text" size=6 onchange="mem_label('+i+',this.value)" value="'+memories[i].label+'"></td>';
      s+='</tr>';
   }
   s+='<tr>';
   s+='<td><input type="button" disabled title="recall" value="recall" onclick="mem_recall('+i+')"><input type="button" disabled title="erase" value="erase" onclick="mem_erase('+i+')"><input type="button" title="store" value="store" onclick="mem_store('+i+')"></td>';
   s+='<td>(new)</td>';
   s+='</tr>';
   document.getElementById('memories').innerHTML='<table>'+s+'</table>';
}



function wfset_freq(b, zoom, f)
{
   // set waterfall for band 'b' to given zoomlevel and centerfrequency
   var id=band2id(b);
   var e=bi[b];
   var effsamplerate = e.samplerate/(1<<zoom);
   var start = ( f - e.centerfreq + e.samplerate/2 - effsamplerate/2 )*1024/(e.samplerate/(1<<e.maxzoom));
   waterfallapplet[id].setzoom(zoom, start);
}

function wfset(cmd)
{
   var b=band;
   var e=bi[b];
   var id=band2id(b);
   if (cmd==0) {
      // zoom in
      var x=(freq-centerfreq)/khzperpixel+512;
      waterfallapplet[id].setzoom(-2, x);
      return;
   }
   if (cmd==1) {
      // zoom out
      var x=(freq-centerfreq)/khzperpixel+512;
      waterfallapplet[id].setzoom(-1, x);
      return;
   }
   if (cmd==2) {
      // zoom in deep with current listening frequency centered
      wfset_freq(b, e.maxzoom, freq);
   }
   if (cmd==3) {
      // show entire current amateur/broadcast band in which current listening frequency is
      var i;
      for (i=0;i<freqbands.length;i++) {
         if ( freqbands[i].min<=freq && freqbands[i].max>=freq) break;
      }
      var min,max;
      if (i==freqbands.length) { min=freq-100; max=freq+100; }  // if not in any known band, set width to a couple of hundred kHz
      else { min=freqbands[i].min; max=freqbands[i].max; }
      var center = (max+min)/2;
      var width = max-min;
      var j=0;
      while (2*width<e.samplerate && j<e.maxzoom) { j++; width=width*2; }
      wfset_freq(b, j, center);
   }
   if (cmd==4) {
      // zoom fully out
      waterfallapplet[id].setzoom(0, 0);
   }
}


function setview(v)
{
   if ((v==Views.allbands && view==Views.othersslow) || (view==Views.allbands && v==Views.othersslow)) {
      // no need to restart the applets in this case
      view=v;   
      createCookie("view",view,3652);
      waterfallspeed(waterslowness);
      return;
   }

   if (view==Views.blind) {
      var els = document.getElementsByTagName('*');
      for (i=0; i<els.length; i++) {
         if (els[i].className=="hideblind") els[i].style.display="inline";
         if (els[i].className=="showblind") els[i].style.display="none";
      }
   }
   for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy();

   view=v;   
   createCookie("view",view,3652);

   document_waterfalls();  // (re)start the waterfall applets

   if (view==Views.blind) {
      var els = document.getElementsByTagName('*');
      for (i=0; i<els.length; i++) {
         if (els[i].className=="showblind") els[i].style.display="inline";
         if (els[i].className=="hideblind") els[i].style.display="none";
      }
      return;
   }

   sethidedx(hidedx);
}


function islsbband(b)
{
   // returns true if default SSB mode for this band should be LSB
   var e=bi[b];
   if (e.centerfreq>3500 && e.centerfreq<4000) return 1;
   if (e.centerfreq>1800 && e.centerfreq<2000) return 1;
   if (e.centerfreq>7000 && e.centerfreq<7400) return 1;
   return 0;
}

function setband(b)
{
   if (b<0 || b>=nvbands) return;
   bi[band].vfo=freq;
  
   debug("setband "+waitingforwaterfalls);

   if (islsbband(band)!=islsbband(b)) {
      // if needed, exchange LSB/USB 
      var tmp=hi;
      hi=-lo;
      lo=-tmp;
      if (mode=="USB") mode="LSB";
      else if (mode=="LSB") mode="USB";
   }

   band=b;
   var e=bi[b];
   if (nbands>1) document.freqform.group0[band].checked=true;
   if (view==Views.allbands || view==Views.othersslow) {
      scaleobj = scaleobjs[b];
   } else if (view==Views.oneband) {
      scaleobj = scaleobjs[0];
      setscaleimgs(b,0);
      if (waitingforwaterfalls==0) waterfallapplet[0].setband(b, e.maxzoom, e.zoom, e.start);
      if (!hidedx) {
         clearTimeout(band_fetchdxtimer[b]);
         dxs=[]; document.getElementById('blackbar0').innerHTML=""; 
         if (e.effsamplerate<660) fetchdx(b);
       }
   }
   setwaterfall(b,e.vfo);
   centerfreq = e.effcenterfreq;
   khzperpixel = e.effsamplerate/1024;
   setfreq(e.vfo);
   waterfallspeed(waterslowness);
}


function sethidedx(h)
{
   hidedx=h;
   if (view==Views.oneband) {
      if (hidedx) {
         dxs=[]; document.getElementById('blackbar0').innerHTML=""; 
         clearTimeout(band_fetchdxtimer[band]);
         document.getElementById('blackbar0').style.height='30px';
      } else {
         if (bi[band].effsamplerate<660) fetchdx(band);
      }
   } else {
      for (b=0;b<nvbands;b++) {
         if (hidedx) {
            dxs=[]; document.getElementById('blackbar'+band2id(b)).innerHTML=""; 
            clearTimeout(band_fetchdxtimer[b]);
            document.getElementById('blackbar'+band2id(b)).style.height='30px';
         } else {
            if (bi[b].effsamplerate<660) fetchdx(b);
         }
      }
   }
}


function test_serverbusy()
{
   serveravailable=soundapplet.getid();
   if (serveravailable==0) {
      document.body.innerHTML="Sorry, the WebSDR server is too busy right now; please try again later.\n";
      clearInterval(interval_updatesmeter);
      clearInterval(interval_ajax3);
   }
}



function updatesmeter()
{
   if (!allloadeddone) return;

   try {
      var s=soundapplet.smeter();
   } catch (e) { s=0; };
   var c=''+(s/100.0-127).toFixed(1);
   if (c.length<6) c='&nbsp;&nbsp;'+c;
   numericalsmeterobj.innerHTML = c;
   if (s>=0) smeterobj.style.width= s*0.0191667+"px";
   else smeterobj.style.width="0px";
   smeterpeaktimer--;
   if ((smeterpeak<s-0.1) || (smeterpeaktimer<=0)) {
      smeterpeak=s;
      smeterpeaktimer=10;
      if (smeterpeak>=0) smeterpeakobj.style.width= smeterpeak*0.0191667 +"px";
      else smeterpeakobj.style.width="0px";
      var c=''+(s/100.0-127).toFixed(1);
      if (c.length<6) c='&nbsp;&nbsp;'+c;
      numericalsmeterpeakobj.innerHTML = c;
   }

   if (serveravailable<0) test_serverbusy();
}


var uu_names=new Array();
var uu_bands=new Array();
var uu_freqs=new Array();
var others_colours=[ "#ff4040", "#ffa000", "#a0a000", "#80ff00", "#00ff00", "#00a0a0", "#0080ff", "#ff40ff"];

var dxs=[];

function uu(i, username, band, freq)
// called by updates fetched from the server
{
   uu_names[i]=username;
   uu_bands[i]=band;
   uu_freqs[i]=freq;
}

var uu_compactview=false;
function douu()
// draw the diagram that shows the other listeners
{
   s='';
   total=0;
   for (b=0;b<nbands;b++) {
      if (!uu_compactview) {
         s+="<p><div align='left' style='width:1024px; background-color:black;'><div class=others>";
         for (i=0;i<uu_names.length;i++) if (uu_bands[i]==b && uu_names[i]!="") {
            s+="<div id='user"+i+"' align='center' style='position:relative;left:"+
                 (uu_freqs[i]*1024-250)
                 +"px;width:500px; color:"+others_colours[i%8]+";'><b>"+uu_names[i]+"</b></div>";
            total++;
         }
         s+="<img src="+bi[b].scaleimgs[0][0]+"></div></div></p>";
      } else {
         s+="<p><div align='left' style='width:1024px;height:15px;position:relative; background-color:black;'>";
         for (i=0;i<uu_names.length;i++) if (uu_bands[i]==b && uu_names[i]!="") {
            s+="<div id='user"+i+"' style='position:absolute;top:1px;left:"+
                 (uu_freqs[i]*1024)
                 +"px;width:1px;height:13px; background-color:"+others_colours[i%8]+";'></div>";
            total++;
         }
         s+="</div><div><img src="+bi[b].scaleimgs[0][0]+"></div></p>";
      }
   }
   usersobj.innerHTML=s;
   numusersobj.innerHTML=total;
}

function setcompactview(c)
{
   uu_compactview=c;
   douu();
}


function ajaxFunction3()
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Your browser does not support AJAX!"); return false; } } }
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
        if (xmlHttp.responseText!="") {
          eval(xmlHttp.responseText);
          douu();
        }
      }
    }
  var url="http://localhost:8000/~~othersjj?chseq="+chseq;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}


function javatest()
{
   var javaversion;
   document.getElementById("javawarning").innerHTML='';
   try {
      javaversion = soundapplet.javaversion();
   } catch(err) {
      if (!usejavasound) return;
      document.getElementById("javawarning").innerHTML='<b><i><font color=red>It seems Java is not installed (or disabled) on your computer. You need to install and enable it for this website to work properly.</font></i></b>';
      javaversion="999";
      setTimeout('javatest()',1000); // in case loading java was simply taking too long
   }
   if (javaversion<"1.4.2") document.getElementById("javawarning").innerHTML='<b><i><font color=red>Your Java version is '+javaversion+', which is too old for the WebSDR. Please install version 1.4.2 or newer, e.g. from <a href="http://www.java.com">http://www.java.com</a> if you hear no sound.</font></i></b>';
}



function updbw()
{
   if (lo>hi) {
      if (document.onmousemove == useMouseXYloweredge || touchingLower) lo=hi;
      else hi=lo;
   }
//   var maxf=(mode=="FM") ? 15 : 3.9;
   var maxf=(mode=="FM") ? 15 : 6;
   if (lo<-maxf) lo=-maxf;
   if (hi>maxf) hi=maxf;
   var x6=document.getElementById('numericalbandwidth6');
   var x60=document.getElementById('numericalbandwidth60');
   x6.innerHTML=(hi-lo+0.091).toFixed(2);
   x60.innerHTML=(hi-lo+0.551).toFixed(2);
   setfreq(freq);
}


// from http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function id2band(id)
{
	if (view == Views.oneband) return band; else return id;
}

function band2id(b)
{
	if (view == Views.oneband) return 0; else return b;
}

function waterfallspeed(sp)
{
   waterslowness=sp;
   debug("waterfallspeed "+waitingforwaterfalls);
   if (waitingforwaterfalls>0) return;
   var done=0;
   if (view==Views.othersslow) {
      for (i=0;i<nwaterfalls;i++)
         if (i==band) waterfallapplet[i].setslow(sp);
         else waterfallapplet[i].setslow(100);
   } else {
      for (i=0;i<nwaterfalls;i++)
         waterfallapplet[i].setslow(sp);
   }
}

function waterfallheight(si)
{
   waterheight=si;
   debug("waterfallheight "+waitingforwaterfalls);
   if (waitingforwaterfalls>0) return;
   for (i=0;i<nwaterfalls;i++) {
      waterfallapplet[i].setSize(1024,si);
   }

   var y=scaleobj.offsetTop+15;
   passbandobj.style.top=y+"px";
   edgelowerobj.style.top=y+"px";
   edgeupperobj.style.top=y+"px";
   carrierobj.style.top=y+"px";
}

function waterfallmode(m)
{
   watermode=m;
   debug("waterfallmode "+waitingforwaterfalls);
   if (waitingforwaterfalls>0) return;
   for (i=0;i<nwaterfalls;i++) {
      waterfallapplet[i].setmode(m);
   }
}



function soundappletstarted()
{
   setTimeout('soundappletstarted2()',100);
}

function soundappletstarted2()
{
   allloadeddone=true;

//   soundapplet.setvolume(Math.pow(10,-5/10.));

   soundapplet.setvolume(Math.pow(10, document.getElementById('volumecontrol2').value /10.));

   if (bi[0]) {
      setfreqif(freq);
      updbw();
   }

   try { setmute(document.getElementById('mutecheckbox').checked) } catch(e){};
   try { setsquelch(document.getElementById('squelchcheckbox').checked) } catch(e){};
   try { setautonotch(document.getElementById('autonotchcheckbox').checked) } catch(e){};

   test_serverbusy();
}


function waterfallappletstarted(id)
{
   // this function is called when a waterfall applet becomes active
   debug("waterfallappletstarted "+waitingforwaterfalls+" id="+id);
   waitingforwaterfalls--;
   if (waitingforwaterfalls<0) waitingforwaterfalls=0; // shouldn't happen...
   if (waitingforwaterfalls!=0) return;
   setTimeout('allwaterfallappletsstarted()',100);
}

function allwaterfallappletsstarted() 
{
   var i;

/*
   // now all waterfall applets have started so we can initialize their settings
   var btns;
   btns=document.getElementsByName("group1"); for (i=0;btns[i];i++) if (btns[i].checked) waterfallspeed(btns[i].value);
   btns=document.getElementsByName("group2"); for (i=0;btns[i];i++) if (btns[i].checked) waterfallheight(btns[i].value);
   btns=document.getElementsByName("group3"); for (i=0;btns[i];i++) if (btns[i].checked) waterfallmode(btns[i].value);
   btns=null;
*/

   waterfallspeed(waterslowness);
   waterfallmode(watermode);

   for (i=0;i<nwaterfalls;i++) {
      var e=bi[i];
      waterfallapplet[i].setband(e.realband, e.maxzoom, e.zoom, e.start);
   }
   if (view==Views.oneband) {
      var e=bi[band];
      waterfallapplet[0].setband(band, e.maxzoom, e.zoom, e.start);
   }

   // and when the applets run, we can also be sure that the HTML elements for the frequency scale have been rendered:
   for (i=0;i<nwaterfalls;i++) {
     scaleobjs[i] = document.getElementById('clipscale'+i);
     scaleimgs0[i] = document.images["s0cale"+i];
     scaleimgs1[i] = document.images["s1cale"+i];
   }
   if (view==Views.oneband) {
      setscaleimgs(band,0);
      scaleobj = scaleobjs[0];
   } else {
      for (i=0;i<nwaterfalls;i++) setscaleimgs(i,i);
      scaleobj=scaleobjs[band];
   }
   draw_passband();
}


function html5orjava(item,usejava)
{
   if (item==0) {
      // waterfall
      if (usejavawaterfall==usejava) return;
      usejavawaterfall=usejava;
      var s=(usejavawaterfall?"y":"n")+(usejavasound?"y":"n");
      createCookie("usejava",s,3652);
      var i;
      try { for (i=0;i<nwaterfalls;i++) waterfallapplet[i].destroy(); } catch (e) {} ;
      document_waterfalls();
   }
   if (item==1) {
      // sound
      if (usejavasound==usejava) return;
      usejavasound=usejava;
      var s=(usejavawaterfall?"y":"n")+(usejavasound?"y":"n");
      createCookie("usejava",s,3652);
      try { soundapplet.destroy(); } catch (e) {};
      document_soundapplet();
//      document.getElementById('record_span').style= usejavasound ? "display: none" : "display: inline";
      document.getElementById('record_span').style.display= usejavasound ? "none" : "inline";
   }
}


function iOS_audio_start()
{
   // Safari on iOS only plays webaudio after it has been started by clicking a button, so this function must be called from a button's onclick handler
   if (!document.ct) document.ct= new webkitAudioContext();
   var s = document.ct.createBufferSource();
//   var s=document.ct.createOscillator(); s.frequency.setValueAtTime(400,0);
   s.connect(document.ct.destination);
   try { s.start(0); } catch(e) { s.noteOn(0); }
}

function html5orjavamenu()
{
   var s;
   var sup_socket = !!window.WebSocket && !!WebSocket.CLOSING;   // the CLOSING test excludes browsers with an old version of the websocket protocol, in particular Safari 5
   var sup_canvas = !!window.CanvasRenderingContext2D;
   var sup_webaudio = window.AudioContext || window.webkitAudioContext;
   var sup_mozaudio = typeof(Audio)==='function' && typeof(new Audio().mozSetup)=='function';
   var sup_java = navigator.javaEnabled();
   if (sup_webaudio) {
      if (sup_webaudio) {
         if (!document['ct']) document['ct']= new sup_webaudio;
         var cc;
         try {
            cc=document['ct'].createConvolver;
         } catch (e) {};
         if (!cc) {
            document['ct']=null; // firefox 23 supports webaudio, but not yet createConvolver(), making it unusable. Sigh.
            sup_webaudio=false;
         }
      }
   }
   sup_iOS = 0;   // global!
   try { 
      var n=navigator.userAgent.toLowerCase();
      if (n.indexOf('iphone')!=-1) sup_iOS=1;
      if (n.indexOf('ipad')!=-1) sup_iOS=1;
      if (n.indexOf('ipod')!=-1) sup_iOS=1;
      if (n.indexOf('ios')!=-1) sup_iOS=1;
   } catch (e) {};
   if (sup_iOS) isTouchDev=true;
   var usecookie= readCookie('usejava');
   if (!usecookie) {
      if (!sup_java && sup_socket && sup_canvas && (sup_webaudio || sup_mozaudio)) usecookie="nn";
      else usecookie="yy";
   }
   usejavawaterfall=(usecookie.substring(0,1)=='y');
   usejavasound=(usecookie.substring(1,2)=='y');
   s="<table>";
   s+='<tr><td style="text-align:right;">Waterfall:</td>';
   s+='<td><input type="radio" name="groupw" value="Java" onclick="html5orjava(0,1);"'+(usejavawaterfall?" checked":"")+'>Java</td>';
   s+='<td><input type="radio" name="groupw" value="HTML5" onclick="html5orjava(0,0);"'+(!usejavawaterfall?" checked":"")+'>HTML5</td>';
   if (sup_socket && sup_canvas) s+='<td style="color: green">seems supported by your browser</td>';
   else s+='<td style="color: red">seems NOT supported by your browser</td>';
   s+='</tr><tr><td style="text-align:right;">Sound:</td>';
   s+='<td><input type="radio" name="groupa" value="Java" onclick="html5orjava(1,1);"'+(usejavasound?" checked":"")+'>Java</td>';
   s+='<td><input type="radio" name="groupa" value="HTML5" onclick="html5orjava(1,0);"'+(!usejavasound?" checked":"")+'>HTML5</td>';
   if (sup_socket && (sup_webaudio)) s+='<td style="color: green">seems supported by your browser (as WebAudio)</td>';
   else if (sup_socket && (sup_mozaudio)) s+='<td style="color: green">seems supported by your browser (as Mozilla audio)</td>';
   else s+='<td style="color: red">seems NOT supported by your browser</td>';
   if (sup_iOS && sup_socket && sup_webaudio) s+='<td><input type="button" value="iOS audio start" onclick="iOS_audio_start()"></td>';
   s+='</tr>';
//   s+='<tr><input type="checkbox" value="" onclick="try {soundapplet.setdelay(this.checked?4000:500);}catch(e){}; "></tr>';
//   s+='<tr><input type="checkbox" value="" onclick="{soundapplet.setdelay1(this.checked?2000:500);} "></tr>';
   s+='</table>';
//   try { s+='Browser: '+navigator.userAgent; } catch (e) {};
   document.getElementById('html5choice').innerHTML = s;
//   document.getElementById('record_span').style= usejavasound ? "display: none" : "display: inline";
   document.getElementById('record_span').style.display = usejavasound ? "none" : "inline";
}


function bodyonload()
{
   var s;

   html5orjavamenu();

   if (document.referrer.match(/4chan.org/)) document.getElementById("chatboxspan").style.display="none";

   view= readCookie('view');
   if (view==null) view=Views.oneband;
   if (nvbands>=2) s='<input type="radio" name="group" value="all bands" onclick="setview(0);">all bands<input type="radio" name="group" value="others slow" onclick="setview(1);" >others slow<input type="radio" name="group" value="one band" onclick="setview(2);" >one band';
   else {
      s='<input type="radio" name="group" value="waterfall" onclick="setview(2);">waterfall';
      if (view==Views.othersslow || view==Views.allbands) view=Views.oneband;
   }
   s+='<input type="radio" name="group" value="blind" onclick="setview(3);" >blind';
   document.getElementById('viewformbuttons').innerHTML = s;
   if (nvbands>=2) document.viewform.group[view].checked=true;
   else document.viewform.group[view-2].checked=true;

   var x= readCookie('username');
   var p=document.getElementById("please2");
   if (!x && p) p.innerHTML="<b><i>Please type a name or callsign in the box at the <a href='#please'>top of the page</a> to identify your chat messages!</i></b>";

   uu_compactview=document.getElementById("compactviewcheckbox").checked;
   document.getElementById("mutecheckbox").checked=false;
   document.getElementById("squelchcheckbox").checked=false;
   document.getElementById("autonotchcheckbox").checked=false;

   try { memories=JSON.parse(localStorage.getItem('memories')); } catch (e) {};
   if (!memories) memories=[];
   else {
       // conversion from old data format - should be removed later
       var rew=false;
       for (i=0;i<memories.length;i++) {
          if (memories[i].mode==1) { memories[i].mode="AM"; rew=true; }
          if (memories[i].mode==4) { memories[i].mode="FM"; rew=true; }
          if (memories[i].mode==0) {
             rew=true;
             if (memories[i].hi-memories[i].lo<1) memories[i].mode="CW";
             else if (memories[i].hi+memories[i].lo>0) memories[i].mode="USB";
             else memories[i].mode="LSB";
          }
          if (!memories[i].nomfreq) memories[i].nomfreq=memories[i].freq + (memories[i].mode=="CW"?0.75:0);
       }
       if (rew) try { localStorage.setItem('memories',JSON.stringify(memories)); } catch (e) {};
   }

   passbandobj =document.getElementById('yellowbar');
   edgeupperobj = document.getElementById('edgeupper');
   edgelowerobj = document.getElementById('edgelower');
   edgeupperobj = document.getElementById('edgeupper');
   carrierobj = document.getElementById('carrier');
   smeterobj = document.getElementById('smeterbar');
   numericalsmeterobj=document.getElementById('numericalsmeter');
   smeterpeakobj = document.getElementById('smeterpeak');
   numericalsmeterpeakobj=document.getElementById('numericalsmeterpeak');
   smeterobj.style.top= smeterpeakobj.style.top;
   smeterobj.style.left= smeterpeakobj.style.left;

   i = document.createElement("input");
   i.setAttribute("type", "range");
   if (i.type=="range")
      document.getElementById('volumecontrol').innerHTML =
      'Volume:<input type="range" min="-20" max="6" id="volumecontrol2" name="volume" value="-5" step="1" onchange="soundapplet.setvolume(Math.pow(10,this.value/10.))">';
   else
      document.getElementById('volumecontrol').innerHTML =
      'Volume:<input type="range" min="-20" max="6" id="volumecontrol2" name="volume" value="-5" step="1" onkeyup="soundapplet.setvolume(Math.pow(10,this.value/10.))"> dB'
      +
      '<input type="text" size=1 name="dummytopreventsubmissiononenter" style="display:none" onclick="">';

   mem_show();

   bi=bandinfo;
   for (i=0;i<nbands;i++) {
      var e=bi[i];
      e.realband=i;
      e.effcenterfreq=e.centerfreq;
      e.effsamplerate=e.samplerate;
      e.zoom=0;
      e.start=0;
      e.minzoom=0;
   }

   document.freqform.frequency.value=freq;
   if (nbands>1) document.freqform.group0[0].checked=true;

   if ((!document.soundapplet || !navigator.javaEnabled()) && usejavasound) {
      document.getElementById("javawarning").innerHTML='<b><i><font color=red>It seems Java is not installed (or disabled) on your computer. You need to install and enable it for this website to work properly.</font></i></b>'
   }

   chatboxobj = document.getElementById('chatbox');
   statsobj = document.getElementById('stats');
   numusersobj = document.getElementById('numusers');
   usersobj = document.getElementById('users');

   setview(view);

   if (!islsbband(band) && hi<0) { var tmp=hi; hi=-lo; lo=-tmp; mode="USB"; }
   var tunefreq = (new RegExp("[?&]tune=([0-9.]*)").exec(window.location.href));
   var tunemode = (new RegExp("[?&]tune=[0-9.]*([^&#]*)").exec(window.location.href));
   if (tunefreq && tunemode) {
      setfreqif(tunefreq[1]);
      set_mode(tunemode[1]);
   } else if (ini_freq && ini_mode) {
      setfreqif(ini_freq);
      set_mode(ini_mode);
   }

   document_soundapplet();

   // interval_ajax3 = setInterval('ajaxFunction3()',1000);

   setTimeout('javatest()',2000);

   interval_updatesmeter = setInterval('updatesmeter()',100);

   if (isTouchDev) {
      registerTouchEvents("carrier", touchpassband, touchXYpassband);
      registerTouchEvents("yellowbar", touchpassband, touchXYpassband);
      registerTouchEvents("edgeupper", touchupper, touchXYupperedge);
      registerTouchEvents("edgelower", touchlower, touchXYloweredge);
   }
}

function registerTouchEvents(id, touchStart, touchMove) {
   var elem=document.getElementById(id);
   elem.addEventListener('touchstart', touchStart);
   elem.addEventListener('touchmove', touchMove);
   elem.addEventListener('touchend', touchEnd);
}

function setusernamecookie() {
   createCookie('username',document.usernameform.username.value,365*5);
   var p=document.getElementById("please");
   if (p) p.innerHTML="Your name or callsign: ";
   p=document.getElementById("please2");
   if (p) p.innerHTML="";
   send_soundsettings_to_server();
}

//----------------------------------------------------------------------------------------
// things related to interaction with the mouse (clicking & dragging on the frequency axes)

var dragging=false;
var dragorigX;
var dragorigval;
var touchingLower=false;

function getMouseXY(e)
{
   e = e || window.event;
   if (e.pageX || e.pageY) return {x:e.pageX, y:e.pageY};
   return {
     x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
     y:e.clientY + document.body.scrollTop  - document.body.clientTop
   };
// from: http://www.webreference.com/programming/javascript/mk/column2/
}


function useMouseXY(e)
{
   var pos=getMouseXY(e);
   setfreq((pos.x-scaleobj.offsetParent.offsetLeft-512)*khzperpixel+centerfreq-(hi+lo)/2);
   return cancelEvent(e);
}

function touchXY(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      setfreq((x-scaleobj.offsetParent.offsetLeft-512)*khzperpixel+centerfreq-(hi+lo)/2);
   }
}

function useMouseXYloweredge(e)
{
   var pos=getMouseXY(e);
   lo=dragorigval+(pos.x-dragorigX)*khzperpixel;
   updbw();
   return cancelEvent(e);
}

function touchXYloweredge(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      lo=dragorigval+(x-dragorigX)*khzperpixel;
      updbw();
   }
}

function useMouseXYupperedge(e)
{
   var pos=getMouseXY(e);
   hi=dragorigval+(pos.x-dragorigX)*khzperpixel;
   updbw();
   return cancelEvent(e);
}

function touchXYupperedge(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      hi=dragorigval+(x-dragorigX)*khzperpixel;
      updbw();
   }
}

function useMouseXYpassband(e)
{
   var pos=getMouseXY(e);
   setfreq(dragorigval+(pos.x-dragorigX)*khzperpixel);
   return cancelEvent(e);
}

function touchXYpassband(ev)
{
   ev.preventDefault();
   for (var i=0; i<ev.touches.length; i++) {
      var x = ev.touches[i].pageX;
      setfreq(dragorigval+(x-dragorigX)*khzperpixel);
   }
}

function mouseup(e)
{
   if (dragging) {
      dragging=false;
      document.onmousemove(e);
      document.onmousemove = null;
   }
}

function touchEnd(ev) {
   ev.preventDefault();
   if (dragging) {
      dragging=false;
      touchingLower=false;
   }
}

function imgmousedown(ev,bb)
{
   var b=id2band(bb);
   dragging=true;
   document.onmousemove = useMouseXY;
   if (view!=Views.oneband && band!=b) {
      if (view==Views.othersslow) waterfallspeed(waterslowness);
      setband(b);
      useMouseXY(ev);
   }
}

function imgtouch(ev) {
   ev.preventDefault();
   
   // recover waterfall instance number from event target
   // is there a better way to do this?
   var e = ev || window.event;
   var img;
   if (e.target) img = e.target; else
   if (e.srcElement) img = e.srcElement;
   if (img.nodeType == 3) img = img.parentNode;
   var bb=0;
   if (img.name) bb = img.name.substring(6,7); else	// name="sncale[bb]" from HTML below
   if (img.id) bb = img.id.substring(8,9);			// id="blackbar[bb]" from HTML below

   var b=id2band(bb);
   if (view!=Views.oneband && band!=b) {
      if (view==Views.othersslow) waterfallspeed(waterslowness);
      setband(b);
   }

   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      touchXY(ev);
   }
}

function mousedownlower(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYloweredge;
   dragorigX=pos.x;
   dragorigval=lo;
   return cancelEvent(ev);
}

function touchlower(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      touchingLower=true;
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=lo;
   }
}

function mousedownupper(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYupperedge;
   dragorigX=pos.x;
   dragorigval=hi;
   return cancelEvent(ev);
}

function touchupper(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=hi;
   }
}

function mousedownpassband(ev)
{
   var pos=getMouseXY(ev);
   dragging=true;
   document.onmousemove = useMouseXYpassband;
   dragorigX=pos.x;
   dragorigval=freq;
   return cancelEvent(ev);
}

function touchpassband(ev) {
   ev.preventDefault();
   if (ev.targetTouches.length == 1) {
      dragging=true;
      dragorigX=ev.targetTouches[0].pageX;
      dragorigval=freq;
   }
}


function docmousedown(ev)
{
   var fobj;
   if (!ev) fobj=event.srcElement;  // IE
   else fobj = ev.target;  // FF
   if (fobj.className == "scale" || fobj.className=="scaleabs") return cancelEvent(ev);
   return true;
}


var tprevwheel=0;
var prevdir=0;
var wheelstep=1000;
function mousewheel(ev)
{
   var fobj;
   // Win7/IE9 seems to have fixed the problem where 'ev' is null if not called directly, i.e. mousewheel(event)
   if (!ev) { 
      ev=window.event; fobj=event.srcElement;	// IE
   }
   else fobj = ev.target;	// FF or IE9

   // In IE and Win7/Chrome the wheel event is not automatically passed on to the applet.
   // This check will handle the mouse wheel event for any browser running on Windows (not just IE and Chrome)
   // and hopefully that will not be a problem.
   if (navigator.platform.substring(0,3)=="Win" && fobj.tagName=='APPLET' && fobj.name.substring(0,15)=="waterfallapplet") {
         var pos=getMouseXY(ev);
         var x=pos.x-fobj.offsetParent.offsetLeft;
         // scrollwheel while on the waterfallapplet; only needed in IE/Chrome because FF always passes these events on to the java applet
         if (ev.wheelDelta>0) document[fobj.name].setzoom(-2, x);
         else if (ev.wheelDelta<0) document[fobj.name].setzoom(-1, x);
         return cancelEvent(ev);
   }

   // this is needed for Mac/Safari and {Mac,Linux,Win7}/Chrome when positioned on the text of a dx label
   if (fobj.nodeType==3) fobj=fobj.parentNode;	// 3=TEXT_NODE, i.e. text inside of a <div>

   if (fobj.className == "scale" || fobj.className=="scaleabs" || fobj.className.substring(0,8) == "statinfo") {
      var delta = ev.detail ? ev.detail : ev.wheelDelta/-40;
      var t=new Date().getTime();
      var dt=t-tprevwheel;
      if (dt<10) dt=10;
      tprevwheel=t;
      prevdir=delta; 
      if (Math.abs(delta)<wheelstep && delta!=0) wheelstep=Math.abs(delta);
      delta/=wheelstep;
      if (prevdir*delta>0 && dt<500) delta*=(500./dt);
      setfreq(freq-delta/20);
      return cancelEvent(ev);
   }

   return true;
}

document.onmouseup = mouseup;
document.onmousedown = docmousedown;
window.onmousewheel = mousewheel;
document.onmousewheel = mousewheel;
if(document.addEventListener){window.addEventListener('DOMMouseScroll', mousewheel, false);}



//----------------------------------------------------------------------------------------
// functions that create part of the HTML GUI

function document_username() 
{
  var x= readCookie('username');
  if (x) {
    document.write('<a id="please">Your name or callsign: ');
    document.write('<input type="text" value="" name="username" onchange="setusernamecookie()" onclick=""></a>');
    document.usernameform.username.value=x;
  } else {
    document.write('<a id="please"><span id="please"><b><i>Please log in by typing your name or callsign here (it will be saved for later visits in a cookie):<\/i><\/b></span> ');
    document.write('<input type="text" value="" name="username" onchange="setusernamecookie()" onclick=""></a>');
  }
}


function document_waterfalls() 
{
  if (view==Views.allbands || view==Views.othersslow) nwaterfalls=nvbands;
  else if (view==Views.oneband) nwaterfalls=1;
  else { 
     nwaterfalls=0;
     document.getElementById('waterfalls').innerHTML="";
     return;
  }

  var i;
  var b;
  var s="";
  for (i=0;i<nwaterfalls;i++) {
    b = id2band(i);
    e=bi[b];
    j=e.realband;
    s+=
/*
      '<applet code="websdrwaterfall.class" align=top archive="websdr-1360526382.jar" width=1024 height='+waterheight+' name="waterfallapplet'+i+'" MAYSCRIPT>' +
      '<param name="rq" value="/~~waterstream'+j+'">' +
      '<param name="maxh" value="200">' +
      '<param name="maxzoom" value="' + bi[b].maxzoom + '">' +
      '<param name="id" value="'+i+'">' +
      '<\/applet>'+
*/
//      '<hr><canvas id="wfcanvas'+i+'" width="1024" height="100">test</canvas><hr><span id="debug3"></span> '+
      '<div id="wfdiv'+i+'"></div>'+
      '<div class="scale" style="overflow:hidden; width:1024px; height:'+scaleheight+'px; position:relative" title="click to tune" id="clipscale'+i+'" onmousedown="return false">' +
        '<img src="'+e.scaleimgs[0]+'" onmousedown="imgmousedown(event,'+i+')" class="scaleabs" style="top:0px" name="s0cale'+i+'">' +
        '<img src="'+e.scaleimgs[0]+'" onmousedown="imgmousedown(event,'+i+')" class="scaleabs" style="top:0px" name="s1cale'+i+'">' +
      '</div>' +
      '<div class="scale" style="width:1024px;height:30px;background-color:black;position:relative;" id="blackbar'+i+'" title="click to tune" onmousedown="imgmousedown(event,'+i+')"><\/div>' +
      '\n';
     waterfallapplet[i]={};
     waterfallapplet[i].div='wfdiv'+i;
     waterfallapplet[i].id=i;
     waterfallapplet[i].band=b;
     waterfallapplet[i].maxzoom=bi[b].maxzoom;
  }

  waitingforwaterfalls=nwaterfalls;     // this must be before the next line, to prevent a race
  debug("doc_w "+waitingforwaterfalls);
  document.getElementById('waterfalls').innerHTML=s;
//  document.getElementById('wfdiv0').innerHTML='<hr><canvas id="wfcanvas'+0+'" width="1024" height="100">test</canvas><hr><span id="debug3"></span> ';

  if (usejavawaterfall) {
     if (typeof prep_javawaterfalls =="function") prep_javawaterfalls();
     else {
       script = document.createElement('script');
       script.src = 'websdr-javawaterfall.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  } else {
     if (typeof prep_html5waterfalls =="function") prep_html5waterfalls();
     else {
       script = document.createElement('script');
       script.src = 'websdr-waterfall.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  }

  for (i=0;i<nwaterfalls;i++) {
    scaleobjs[i] = document.getElementById('clipscale'+i);
    scaleimgs0[i] = document.images["s0cale"+i];
    scaleimgs1[i] = document.images["s1cale"+i];
    if (isTouchDev) {
       registerTouchEvents('clipscale'+i, imgtouch, touchXY);
       registerTouchEvents('blackbar'+i, imgtouch, touchXY);
    }
  }

}


function document_bandbuttons() {
    if (nvbands>1) {
       document.write("<br>Band: ")
       var i;
       for (i=0;i<nbands;i++) document.write ("<input type=\"radio\" name=\"group0\" value=\""+bandinfo[i].name+"\" onclick=\"setband("+i+")\">"+bandinfo[i].name+"\n");
    }
}


function document_soundapplet() {
/*
  document.write(
     '<applet code="websdrsound.class" archive="websdr-1360526382.jar" width=400 height=100 name="soundapplet" MAYSCRIPT>' +
     '<param name="format" value="22">' +
     '<\/applet>' +
     '\n' );
*/
/*
     document.write('<span id="debug"></span> <span id="debug2"></span> <span id="smeter"></span>');
     script = document.createElement('script');
     script.src = 'websdr-sound.js';
     script.type = 'text/javascript';
     document.body.appendChild(script);
*/

  if (usejavasound) {
     if (typeof prep_javasound =="function") prep_javasound();
     else {
       script = document.createElement('script');
       script.src = 'websdr-javasound.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  } else {
     if (typeof prep_html5sound =="function") prep_html5sound();
     else {
       script = document.createElement('script');
       script.src = 'websdr-sound.js';
       script.type = 'text/javascript';
       document.body.appendChild(script);
     }
  }
}



//----------------------------------------------------------------------------------------
// recording

var rec_showtimer;
var rec_downloadurl;

function record_show()
{
   document.getElementById('reccontrol').innerHTML=Math.round(soundapplet.rec_length_kB())+" kB";
}

function record_start() { 
   document.getElementById('reccontrol').innerHTML=0+" kB";
   if (rec_downloadurl) { URL.revokeObjectURL(rec_downloadurl); rec_downloadurl=null; }
   rec_showtimer=setInterval('record_show()',250);
   soundapplet.rec_start(); 
}

function record_stop()
{
   clearInterval(rec_showtimer);
   var res = soundapplet.rec_finish();

   var wavhead = new ArrayBuffer(44);
   var dv=new DataView(wavhead);
   var i=0;
   var sr=Math.round(res.sr);
   dv.setUint8(i++,82);  dv.setUint8(i++,73); dv.setUint8(i++,70); dv.setUint8(i++,70); // RIFF  (is there really no less verbose way to initialize this thing?)
   dv.setUint32(i,res.len+44,true); i+=4;  // total length; WAV files are little-endian
   dv.setUint8(i++,87);  dv.setUint8(i++,65); dv.setUint8(i++,86); dv.setUint8(i++,69); // WAVE
   dv.setUint8(i++,102);  dv.setUint8(i++,109); dv.setUint8(i++,116); dv.setUint8(i++,32); // fmt
     dv.setUint32(i,16,true);   i+=4;   // length of fmt
     dv.setUint16(i,1,true);    i+=2;   // PCM
     dv.setUint16(i,1,true);    i+=2;   // mono
     dv.setUint32(i,sr,true);   i+=4;   // samplerate
     dv.setUint32(i,2*sr,true); i+=4;   // 2*samplerate
     dv.setUint16(i,2,true);    i+=2;   // bytes per sample
     dv.setUint16(i,16,true);   i+=2;   // bits per sample
   dv.setUint8(i++,100);  dv.setUint8(i++,97); dv.setUint8(i++,116); dv.setUint8(i++,97); // data
     dv.setUint32(i,res.len,true);  // length of data

   var wavdata = res.wavdata;
   wavdata.unshift(wavhead);

   var mimetype = 'application/binary';
   var bb = new Blob(wavdata, {type: mimetype});
   rec_downloadurl = window.URL.createObjectURL(bb);
   document.getElementById('reccontrol').innerHTML="<a href='"+rec_downloadurl+"' download='websdr-recording.wav'>download</a>";
}

function record_click()
{
   var bt=document.getElementById('recbutton');
   if (bt.innerHTML=="stop") {
      bt.innerHTML="start";
      record_stop();
   } else {
      bt.innerHTML="stop";
      record_start();
   }
}



//----------------------------------------------------------------------------------------
// things not directly related to the SDR: chatbox, logbook

function sendchat()
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Your browser does not support AJAX!"); return false; } } }
  var url="/~~chat";
  if (document.chatform.chat.value.match(/[Hh]itler/)) url="/~~blockme";
  if (document.chatform.chat.value.match(/[Ff][Uu][Cc][Kk]/)) url="/~~blockme";
  if (document.chatform.chat.value.match(/[Ss][Hh][Ii][Tt]/)) url="/~~blockme";
  var msg=encodeURIComponent(document.chatform.chat.value);
  if (document.usernameform.username.value.match(/Giger/)) url="/~~blockme";
  var ck= readCookie('ID');
//  if (!ck) url="/~~blockme";
  if (!ck) return false;
  url=url+"?name="+encodeURIComponent(document.usernameform.username.value)+"&msg="+encodeURIComponent(document.chatform.chat.value);
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
  document.chatform.chat.value="";
  return false;
}

function sendlogclear()
{
  document.logform.comment.value="";
}

function sendlog()
{
  var xmlHttp;
  try { xmlHttp=new XMLHttpRequest(); }
    catch (e) { try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
      catch (e) { try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { alert("Your browser does not support AJAX!"); return false; } } }
  var url="/~~loginsert";
  url=url
     +"?name="+encodeURIComponent(document.usernameform.username.value)
     +"&freq="+nominalfreq()
     +"&call="+encodeURIComponent(document.logform.call.value)
     +"&comment="+encodeURIComponent(document.logform.comment.value)
     ;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
  document.logform.call.value="";
  document.logform.comment.value="";
  xmlHttp.onreadystatechange=function()
    {
    if(xmlHttp.readyState==4)
      {
      document.logform.comment.value=xmlHttp.responseText;
      }
    }
  setTimeout("document.logform.comment.value=''",1000);
  return false;
}


