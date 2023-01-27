let express = require('express');
let app = express();
let engine = require('ejs-locals');
let bodyParser = require('body-parser');


let admin = require("firebase-admin");

let serviceAccount = require("./formaltodolist-firebase-adminsdk-sn28v-6fac965c82.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://formaltodolist-default-rtdb.firebaseio.com/"
});

let fireData=admin.database();
// console.log(fireData);


app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//路由
app.get('/',function(req,res){
   fireData.ref('todos').once('value',function(snapshot){
      let data=snapshot.val();
      res.render('index',{"todolist":data})
   })
   
 
    
})

//新增邏輯

app.post('/addTodo',function(req,res){
   let content=req.body.content;
   let contentRef=fireData.ref('todos').push();
   contentRef.set({"content":content})
   .then(function(){
      fireData.ref('todos').once('value',function
      (snapshot){
         res.send(
            {
               "success":true,
               "result": snapshot.val(),
               "message":"資料讀取成功"
            }
            
            
           );
      })
   })
})

//刪除邏輯
app.post('/removeTodo',function(req,res){
   let _id=req.body.id;
   fireData.ref('todos').child(_id).remove()
   .then(function(){
      fireData.ref('todos').once('value',function
      (snapshot){
         res.send(
            {
               "success":true,
               "result":snapshot.val(),
               "message":"資料刪除成功"
            }
         )
      })
   })
})

// 監聽 port
let port = process.env.PORT || 5000;
app.listen(port);