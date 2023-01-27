//init data


let send=document.getElementById('addButton');
let content=document.getElementById('newTodo');
let list=document.getElementById('list');

send.addEventListener('click',function(e){
    let str=content.value;
    // console.log(str);
    let xhr=new XMLHttpRequest();
    xhr.open('post',"/addTodo");
    xhr.setRequestHeader('Content-type',"application/json");
    let todo=JSON.stringify({"content":str});
    xhr.send(todo);
    xhr.onload=function(){
        let originData=JSON.parse(xhr.responseText);
        // console.log(originData);
        if (originData.message == false){
            alert(originData.message);
            return;
        }
        let data=originData.result;
        let str='';
        for (item in data){
            str+='<li>'+data[item].content+" "+'<input type="button" class="btn btn-primary" value="刪除" data-id="'+item+'"/>'+'</li>'
        }
        list.innerHTML=str;

        
    }
    
});

list.addEventListener('click',function(e){
    if (e.target.nodeName !== 'INPUT'){
        return;
    }
    let id = e.target.dataset.id;
    let xhr=new XMLHttpRequest();
    xhr.open('post','/removeTodo');
    xhr.setRequestHeader('Content-type',
    'application/json');
    var removeTodo= JSON.stringify({"id":id});
    xhr.send(removeTodo);
    xhr.onload=function(){
        let originData=JSON.parse(xhr.responseText);
        let data=originData.result;
        let str='';
        for (item in data){
            str+='<li>'+data[item].content+" "+'<input type="button" class="btn btn-primary" value="刪除" data-id="'+item+'"/>'+'</li>'
        }
        list.innerHTML=str;
    }
})