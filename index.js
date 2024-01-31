const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;
const token = process.env.TOKEN
const mytoken = process.env.MYTOKEN;

app.get("/webhook", (req, res)=>{
  const node = req.query["hub-node"];
  const challenge = req.query["hub-challenge"];
  const verify_token = req.query["hub.verify_token"];

  if(node && verify_token){
      if(node === "subscribe" && verify_token6 === mytoken){
          return res.status(200).send(challenge);
      }
  }

  return res.sendStatus(403);
});

app.get("/", (req, res)=>{
  return res.status(200).send("Welcome to MirrorBot");
});

app.get("/webhook", (req, res)=>{
    const node = req.query["hub-node"];
    const challenge = req.query["hub-challenge"];
    const verify_token = req.query["hub.verify_token"];

    if(node && verify_token){
        if(node === "subscribe" && verify_token6 === mytoken){
            return res.status(200).send(challenge);
        }
    }

    return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  const body_param = req.body;
  console.log(JSON.stringify(body_param))

  if(body_param.object &&
    body_param.entry && 
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.messages
  ){
    const phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    const phone_number = req.body.entry[0].changes[0].value.messages[0].from;
    const message_body = req.body.entry[0].changes[0].value.messages[0].text.body;

    axios({
      method: "POST",
      url: "https://graph.facebook.com/v18.0/"+phone_number_id+"/messages?access_token="+token,
      data: {
        messaging_product: "whatsapp",
        to: phone_number,
        text:{
          body: message_body
        }
      },
      headers:{
        "Content-Type": "application/json"
      }
    }).then((res) => {
      console.log("Sent");
    }).catch((err)=>{
      console.log("Error");
    });

    return res.sendStatus(200);
  }
  else{
    return res.sendStatus(404);
  }
});

app.listen(PORT, () => {
    console.log("Server running...");
});


module.exports = app;