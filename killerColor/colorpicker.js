/*

Author:Jasper Mishra

Date:16th December, 2011

The following file dynamically applies color to the swatches in colorpicker.html 
and creates rows of color values in different formats for the swatches. 
It also makes use of Ajax Request to dynamically insert an example snippet 
from external html file (snippet-a.html/snippet-b.html) and apply swatch colors 
to various elements in it. 


*/



document.observe("dom:loaded",function()
{
 var allInputTags=$("colorPickerSheet").getElementsByTagName("input");
  
  for(var i=0;i<allInputTags.length;i++)
  {
   allInputTags[i].observe("keyup",  setSwatches);
   
   allInputTags[i].value=Math.floor(Math.random()*101);
  }
  
  $("snippets").observe("change", injectSnippet);
   
  setSwatches();  
});


function throwError()
{
 
 var error=$(document.createElement("div"));
  
    error.addClassName("valuesError");
   
	error.innerHTML="Oops! One or more values were out of range or empty. Make sure 0< rgb <255 and 0< hsl <100. With an exception, Hue values can go till 359 but will be rectified automatically" ;
  
    $("tileInfo").appendChild(error);

    $("theSnippet").innerHTML="";	
	
	var allSwatches=document.getElementsByClassName("swatch");
	
	for(var i=0;i<allSwatches.length;i++)
	{  
	  allSwatches[i].style.backgroundImage="url(' "+"http://blog.martincrownover.com/wp-content/uploads/2009/03/aw_snap.jpg"+"')";
	  
	   allSwatches[i].style.backgroundSize="10em 7em";
    }	  
 	
}

 

 // Creates Color Objects for different shades of primary and secondary. 
 //Applies the Color Object values to the swatch and creates rows of information of these values. 
 
function setSwatches(event)
{ 

    $("tileInfo").innerHTML="";
	
	$("theSnippet").innerHTML="";
  
    var inputs=[parseInt($("red").value), parseInt($("green").value), parseInt($("blue").value), parseInt($("hue").value), parseInt($("saturation").value), parseInt($("lightness").value)];

    var errorexp=(inputs[0]<0||inputs[0]>255) || (inputs[1]<0||inputs[1]>255) || (inputs[2]<0||inputs[2]>255) || (inputs[2]<0||inputs[2]>359)|| (inputs[4]<0||inputs[4]>100) || (inputs[5]<0||inputs[5]>100);

	//loop that checks for empty or out of range values
	//if vlaue is NaN || value is out of range, then error message is displayed. 

    for(var i=0;i<inputs.length;i++)
    {
       if(isNaN(inputs[i])||errorexp)
       {
          throwError();
 	      return false;
       }   
     
   }
   
   var variantFormat="hsl";
  
   if(this.id!='undefined')     //the outer if condition is for the first time event that takes place through internal call. 
   { 
     if(this.id=="red"||this.id=="green"||this.id=="blue")
     {
      variantFormat="rgb";
     }
   }     
 
   var primary=new Color();
  
   if(variantFormat=="hsl")
   {
     primary.setHSL(inputs[3],inputs[4],inputs[5]);
   }
   else if(variantFormat=="rgb")
   {
     primary.setRGB(inputs[0],inputs[1],inputs[2]);
   }
   
   
   //Creating and setting Color Objects values for Primary swatches
   
   var lighterL=primary.l+((100-primary.l)/2);    //calculation for lighter shade of primary (primaryLight)
  
   var darkerL=primary.l/2;    //calculation of darker shade for darker shade of secondary (secondaryLight)
 
   var primaryLight=new Color();
 
   var primaryDark=new Color();
 
   primaryLight.setHSL(primary.h, primary.s, lighterL);
 
   primaryDark.setHSL(primary.h, primary.s, darkerL);
 
   setTextboxValues(primary.r, primary.g, primary.b, primary.h, primary.s, primary.l);
   
   
   
   //Creating and setting Color Objects values for Secondary swatches
 
   var secondary=new Color();
 
   secondary.setHSL(primary.h+180, primary.s, primary.l);
 
   lighterL=secondary.l+((100-secondary.l)/2);    //calculation for lighter shade of secondary (secondaryLight)
  
   darkerL=secondary.l/2;   //calculation for darker shade of secondary (secondaryDark)
 
   var secondaryLight=new Color();   
 
   var secondaryDark=new Color(); 
 
   secondaryLight.setHSL(secondary.h, secondary.s, lighterL);
 
   secondaryDark.setHSL(secondary.h, secondary.s, darkerL);

   var shadeObjects=[primaryLight, primary, primaryDark, secondaryLight, secondary, secondaryDark];
 
   var tileNumber=["p0","p1","p2","s0","s1","s2"];

   for(var i=0;i<shadeObjects.length;i++)
   {
    createTableRowAndSwatch(tileNumber[i], shadeObjects[i]);   
   }  
  
 }

  //Updates the textbox values for RGB and HSL
 
  function setTextboxValues(r,g,b,h,s,l)
  { 
    
   $("red").value=r;
   
   $("green").value=g;
   
   $("blue").value=b;
   
   $("hue").value=parseInt(h);
   
   $("saturation").value=parseInt(s);
   
   $("lightness").value=parseInt(l);
  }
  
 
 //set the color of the swatches and table rows that describes swatch's RGB, HSL and HEX shade values. 
 
 function createTableRowAndSwatch(number, shadeObject)
 { 
       var swatchId=number+"Swatch";
	
       $(swatchId).style.backgroundImage="none";  	
	     
       $(swatchId).style.backgroundColor="#"+shadeObject.hex;	  //sets the Swatch color 
	   
        var tileInfoContainer=$(document.createElement("div"));  //<div> that encloses inline elements for swatch row details
	
  	    tileInfoContainer.className="tileInfoContainer";
	
        $("tileInfo").appendChild(tileInfoContainer);
		
		
		   var tileNumber=document.createElement("div");  	  //<div> for tileNumber, for instance p2

           tileNumber.className="tileNumber";

           tileNumber.innerHTML=number; 

           tileInfoContainer.appendChild(tileNumber);
		   		  
   
           var tilergb=$(document.createElement("div"));    //<div> for rgb value, for instance rgb(255,217,163)		  

           tilergb.className="tilergb";
		   
		   tilergb.id=number+"rgbValue";

           tilergb.innerHTML="rgb ( "+shadeObject.r+", "+shadeObject.g+", "+shadeObject.b+" )";

           tileInfoContainer.appendChild(tilergb);

	       
		   
           var tilehsl=$(document.createElement("div")); //<div> for hsl value, for instance hsl(172,53,82)   	  
		   
		   tilehsl.className="tilehsl";
		   
		   tilehsl.id=number+"hslValue";
		   
		   tilehsl.innerHTML="hsl ( "+parseInt(shadeObject.h)+", "+parseInt(shadeObject.s)+", "+parseInt(shadeObject.l)+" )";
		   
		   tileInfoContainer.appendChild(tilehsl);
		   
		 
		   
		   var tilehex=$(document.createElement("div"));   //div for hex value, for instance #eaf7c5
		   
		   tilehex.className="tilehex";
		   
		   tilehex.id=number+"hexValue";
		   
		   tilehex.innerHTML="#"+shadeObject.hex;
		   
		   tileInfoContainer.appendChild(tilehex);
		  
   }	 
 
 function setPropertyOnAll(property, value, elements) 
 {
  // 1. loop over all given elements
   for (var i = 0; i < elements.length; i++) 
   {
     // 2. for each element, set the given style
     //    property to the given value

         elements[i].style[property] = value  ;
   }
}


 //Ajax Request that fetches DOM elements from either snippet-a.html or snippet-b.html as the case may be
 // and inserts contents into the body

 function injectSnippet(event)
 { 
   $("theSnippet").innerHTML="";
  
  if(this.value!="default")
  {
     new Ajax.Request(this.value, 
     {
         method:'post',
	
   	     onSuccess:insertSnippetContent,
	   
	     onFailure:ajaxFailure,
	
 	     onException:ajaxFailure
    });
  }	
}

 //1.Inserts snippet-a.html/snippet-b.html contents into the body
 //2.Loops over to find the color classes and assign them  swatch color values

 function insertSnippetContent(ajax, event)
 { 
  
  $("theSnippet").innerHTML=ajax.responseText;
   
   var property=["color", "borderColor", "backgroundColor"];
   
   var shadeStrings=["p0Swatch", "p1Swatch",  "p2Swatch", "s0Swatch", "s1Swatch", "s2Swatch" ];
   
   for(var i=0;i<property.length;i++)
   {
      for(var j=0;j<shadeStrings.length;j++)
	  {
	    var classname=property[i].replace("C","-c")+"-"+shadeStrings[j];   
  						
	     setPropertyOnAll(property[i], $(shadeStrings[j]).getStyle("background-color"), $("theSnippet").getElementsByClassName(classname)); 		
			
	  } 
	  
   }
   $("theSnippet").scrollIntoView(true);
	
 } 
 
 
 function ajaxFailure(ajax, exception) 
 {
  alert("Error making Ajax request:" + 
        "\n\nServer status:\n" + ajax.status + " " + ajax.statusText + 
        "\n\nServer response text:\n" + ajax.responseText);
		
   if (exception) 
   {
     throw exception;
   }
 }  
 
 
 
 

    
