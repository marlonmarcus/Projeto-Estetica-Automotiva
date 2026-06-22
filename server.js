const express = require("express");

const path = require("path");

const app = express();
app.use(express.urlencoded ({ extended: true}));

//FAZENDO APARECER O CSS
app.use(express.static("public"));

// FAZENDO COM QUE O CLIENTE RECEBA O HTML
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"public","index.html"));
});

// FAZENDO AGENDAMENTO
app.post("/agendar", (req, res)=>{
    console.log(req.body);

    res.send("Agendamento recebido com sucesso!");
});

//CONFIRMAÇÃO DO SERVIDOR RODANDO
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});