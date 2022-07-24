
var j
function openInfo()
{
    if (j==0)
    {
        document.getElementById("openInfo").style.display="none";
        document.getElementById("openInfo2").style.display="none";
        return j=1;
    }
    else
    {
        document.getElementById("openInfo").style.display="inline";
        document.getElementById("openInfo2").style.display="inline";
        return j=0;
    }
    
}

