var a
function announce()
{
    if (a==0) 
    {
        document.getElementById("announce").style.display="none";
        return a=1;
    }
    else
    {
        document.getElementById("announce").style.display="inline";
        return a=0;
    }
}

var a1
function restrict()
{
    if (a1==0) 
    {
        document.getElementById("restrict").style.display="none";
        return a1=1;
    }
    else
    {
        document.getElementById("restrict").style.display="inline";
        return a1=0;
    }
}

var a2
function unrestrict()
{
    if (a2==0) 
    {
        document.getElementById("unrestrict").style.display="none";
        return a2=1;
    }
    else
    {
        document.getElementById("unrestrict").style.display="inline";
        return a2=0;
    }
}