
var b
function show_hide()
{
    if (b==0) 
    {   
        document.getElementById("kekw3").style.display="none";
        document.getElementById("kekw").style.display="none";
        document.getElementById("kekw2").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";
        return b=1;
    }
    else
    {   
        document.getElementById("kekw3").style.display="none";
        document.getElementById("kekw").style.display="inline";
        document.getElementById("kekw2").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";

        return b=0;
    }
}

var c
function show_hide2()
{
    if (c==0) 
    {   
        document.getElementById("kekw3").style.display="none";
        document.getElementById("kekw2").style.display="none";
        document.getElementById("kekw").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";
        return c=1;
    }
    else
    {   
        document.getElementById("kekw3").style.display="none";
        document.getElementById("kekw2").style.display="inline";
        document.getElementById("kekw").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";
        return c=0;
    }
}

var a
function show_hide3()
{
    if (a==0) 
    {   
        document.getElementById("kekw3").style.display="none";
        document.getElementById("kekw2").style.display="none";
        document.getElementById("kekw").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";
        return a=1;
    }
    else
    {   
        document.getElementById("kekw3").style.display="inline";
        document.getElementById("kekw2").style.display="none";
        document.getElementById("kekw").style.display="none";
        document.getElementById("7tv").style.display="none";
        document.getElementById("stats").style.display="none";
        document.getElementById("moderation").style.display="none";
        return a=0;
    }
}