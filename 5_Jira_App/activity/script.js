let colorBtn=document.querySelectorAll(".filter_color");
let mainContainer=document.querySelector(".main-container");
let body=document.body 
// some refrences like body can directly be accesed by document.body like we have option tohet head and tail in LL
// because we want to add the new div a child of body. We can directly add to the body coz either ways we're making it absolute so no need to make it a child of main-conatiner
let plusBtn=document.querySelector(".fa-plus");
// coz we want to container to show up on clicking '+' so we need to add event listner to that only
let crossBtn=document.querySelector(".fa-times");
let crossState=false;
let taskArr=[];
// this if will check whether there exist some task in localstorage if yes then first make those task on the page on loading 
if(localStorage.getItem("allTask")){
    // parsing is important because the data we get from localstorage is in string format 
    taskArr=JSON.parse(localStorage.getItem("allTask"));
    for(let i=0;i<taskArr.length;i++){
        let {id,color,task}=taskArr[i];
        //false means that this task isn't being added from the UI.
        createTask(color,task,false,id);
    }
}


plusBtn.addEventListener("click",createModal);
crossBtn.addEventListener("click",getCrossState);
    
    function createModal(){
        let modal_container=document.querySelector(".modal_container");
        //if modal_container isn't present the DOM will return null
        if(modal_container == null){
            // To make a div (or any element)
            modal_container=document.createElement("div");
            // to give that element a class
            modal_container.setAttribute("class","modal_container");
            // to write the inner html inside of that div
            modal_container.innerHTML=`<div class="input_container">
                                        <textarea class="modal_input" 
                                        placeholder="Enter Your text"></textarea>
                                        </div>
                                        <div class="modal_filter_container">
                                        <div class="filter pink"></div>
                                        <div class="filter green"></div>
                                        <div class="filter blue"></div>
                                        <div class="filter black"></div>
                                        </div>`;
            body.appendChild(modal_container);
            //this will append the new child that we made directly to the body.
            handleModal(modal_container);
        }else{
            //erasing the text written in textarea after again clicking plusBtn
            let textarea=document.querySelector(".modal_input");
            textarea.value="";
        }
      
    }
    
    function handleModal(modal_container){
    let cColor="black";
    let modalFilters=document.querySelectorAll(".modal_filter_container .filter");
    //modalFilter[3].setAttribute("class","border"); - this remove prev att and then add new one
    modalFilters[3].classList.add("border"); // this append the new one. i.e., we're adding border property to the filter box
    //this will add default border on black  
    for(let i=0;i<modalFilters.length;i++){
        modalFilters[i].addEventListener("click",function(){
            //remove border from all elements
            modalFilters.forEach((filter)=>{
                filter.classList.remove("border");
            })
            //add border to current clicked filter box
            modalFilters[i].classList.add("border");
            cColor=modalFilters[i].classList[1];
            // get the color of the current clicked box
            // console.log("current color of task",cColor);
        })
    }
    let textArea=document.querySelector(".modal_input");
    textArea.addEventListener("keydown",function(e){
        if(e.key=="Enter"){
          //  console.log("Task",textArea.nodeValue,"color",cColor);
            //remove modal
            modal_container.remove();
            //create textbox
            //the flag value is true coz the task is added from the UI and not the local storage
            createTask(cColor,textArea.value,true);
        }
    })
    }
    function createTask(color,task,flag,id){
        let taskContainer=document.createElement("div");
        // if we get id passed in the function then create task with that id else make a new one
        let uidfn=new ShortUniqueId();
        let uid=id||uidfn();
        taskContainer.setAttribute("class","task_container");
        taskContainer.innerHTML=`<div class="task_filter ${color}"></div>
        <div class="task_desc_container">
            <h3 class="uid">${uid}</h3>
            <div class="task_desc" contenteditable="true">${task}</div>
        </div>
       </div >`;
        mainContainer.appendChild(taskContainer);
        // code to change the filter color of the task box
        let taskFilter=document.querySelector(".task_filter");
        if(flag == true){
                //taskArr will already have task added from the local storage
                let obj={"task":task,"id":uid,"color":color};
                taskArr.push(obj);
                // the objects needs to be stringify before adding to local storage
                let finalArr=JSON.stringify(taskArr);
                localStorage.setItem("allTask",finalArr); 
        }
        taskFilter.addEventListener("click",changeColor);
        taskContainer.addEventListener("click",removeTask);
        
    }
    function changeColor(e){
        //used to get the selector on which we have added the event listner 
        let taskFilter=e.currentTarget;
        let colors=["pink","blue","green","black"];
        let cColor=taskFilter.classList[1];
        // indexof is used to find the index of current color
        let idx=colors.indexOf(cColor);
        //with this, the newColorIdx would be rotating between the 4 available colors.
        let newColorIdx=(idx+1)%4;
        // remove the existing filter color
        taskFilter.classList.remove(cColor);
        // now add the new color, if we use set attribute here it will remove all other classes
        //on .task_filter, while .add will append the new class to the existing ones.
        taskFilter.classList.add(colors[newColorIdx]);
        

    }
    function getCrossState(e){
        let crossBtn=e.currentTarget;
        let crossBtnParent=crossBtn.parentNode;
        if(crossState == false){
            crossBtnParent.classList.add("active");
        }else{
            crossBtnParent.classList.remove("active");
        }
        crossState= !crossState;
    }
    function removeTask(e){
        let task_container=e.currentTarget;
        if(crossState){
            let uidElem=task_container.querySelector(".uid");
            let uid=uidElem.innerText;
            // to get the uid from the UI
            for(let i=0;i<taskArr.length;i++){
                // search of the id in the array obtained from localstorage
                let {id} = taskArr[i];
                //console.log(id,uid);
                if(id == uid){
                    //remove that one particular id
                    taskArr.splice(i,1);
                    // after deleting we have to again set the array to local storage
                    let finalArr=JSON.stringify(taskArr);
                    localStorage.setItem("allTask",finalArr);
                    task_container.remove();
                    break;
                }
            }
        }
    }
  