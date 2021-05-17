let input=document.querySelector(".input_box");
let ul=document.querySelector(".task-list");
input.addEventListener("keydown",function(e){
   // console.log("some key is pressed");
   if(e.key == "Enter"){
       let task=input.value;
       console.log(task);
       //To create any HTML tag
       let li=document.createElement("li");
       li.innerText=task;

       li.addEventListener("dblclick",function(e){
        //console.log("e",e);
        li.remove();
    })
       li.setAttribute("class","task"); //this will add every li with a class "task" there.
       ul.appendChild(li);
       input.value="";
       }
})
