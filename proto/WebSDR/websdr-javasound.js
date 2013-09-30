

/**
 * @constructor
 */
function make_javasound()
{
   document.getElementById('soundappletdiv').innerHTML=
//     '<applet code="websdrsound.class" archive="websdr-1360526382.jar" width=400 height=100 name="javasoundapplet" MAYSCRIPT>' +
//     '<applet code="websdrsound.class" archive="websdr-1376256674.jar" width=400 height=100 name="javasoundapplet" MAYSCRIPT>' +
     '<applet code="websdrsound.class" archive="websdr-1376346640.jar" width=400 height=100 name="javasoundapplet" MAYSCRIPT>' +
     '<\/applet>' +
     '\n';

   var sa=document["javasoundapplet"];

   this['setparam'] = function(s) { sa.setparam(s); }
   this['smeter'] = function () { return sa.smeter; }
   this['getid'] = function () { return sa.getid(); }
   this['mute'] = function () { sa.mute(); }
   this['setvolume'] = function (v) { sa.setvolume(v); }
   this['destroy'] = function() { sa.destroy(); }
   this['javaversion'] = function() { sa.javaversion(); }
}


window["prep_javasound"] = function()
{
   window['soundapplet']=new make_javasound();
}

prep_javasound();
