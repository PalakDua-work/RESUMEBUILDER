var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pdf = require('html-pdf');

const dynamicResume=require("./docs/dynamic-resume");
const staticResume=require("./docs/static-resume");
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use( express.static( "public" ) );


const options={
    
    "height":"10.5in",
    "width":"8in",
}
app.get('/',function(req,res) {
	res.render('home');
});
app.get('/resume-maker/:theme',function(req,res){
	console.log("theme:",req.params.theme);
	
	switch(req.params.theme){
		case '1':
		res.render('resume-maker',{theme:'darkblue'});
		break;
		case '2':
        res.render('resume-maker',{theme:'lightblue'});
        break;
        default:
        res.render('resume-maker',{theme:'darkblue'})

	}
});
app.post("/resume-maker",function(req,res){
	 const username=req.body.name;
	 const lowercase=username.toLowerCase();
	 const noSpaceName=lowercase.replace(' ','');
	 const shortname=noSpaceName.slice(0,10);
     console.log("shortname",shortname);
     var themeoptions={
     	leftTextColor:"rgb(255,255,255);",
      wholeBodyColor:"rgb(255,255,255);",
      leftBackgroundColor:"rgb(63,75,94);",
      rightTextcolor:"rgb(63,75,94);"
     };
     if(req.body.theme=="darkblue")
     {
    themeoptions={
     	leftTextColor:"rgb(255,255,255);",
     	wholeBodyColor:"rgb(255,255,255);",
     	leftBackgroundColor:"rgb(63,75,94);",
     	rightTextcolor:"rgb(63,75,94);"
     };
    pdf.create(dynamicResume(req.body,themeoptions),options).toFile(__dirname +"/docs/"+ shortname +"dynamic-resume.pdf" ,(error, response)=>{
  console.log(response.filename);
  res.sendFile(response.filename);
});
     }
 else if(req.body.theme=="lightblue"){
 	themeoptions={
     	leftTextColor:"rgb(0,0,0);",
     	wholeBodyColor:"rgb(255,255,255);",
     	leftBackgroundColor:"rgb(195,215,247);",
     	rightTextcolor:"rgb(63,75,94);"
     };
    pdf.create(dynamicResume(req.body,themeoptions),options).toFile(__dirname +"/docs/"+ shortname +"dynamic-resume.pdf" ,(error, response)=>{
  console.log(response.filename);
  res.sendFile(response.filename);
});

}
else{

    pdf.create(dynamicResume(req.body,themeoptions),options).toFile(__dirname +"/docs/"+ shortname +"dynamic-resume.pdf" ,(error, response)=>{
  console.log(response.filename);
  res.sendFile(response.filename);
});

}
  
});
app.get("/show-pdf",function(req,res){
   pdf.create(staticResume(),options).toFile(__dirname +"/docs/static-resume.pdf",(error, response)=>{
  console.log(response.filename);
  res.sendFile(response.filename);
    });
});
app.get("/download-pdf",function(req,res){
   const filePath=__dirname +"/docs/static-resume.pdf"
   res.download(filePath);
});

app.listen('3000', () => {
  console.log('Server listening on Port 3000');
});