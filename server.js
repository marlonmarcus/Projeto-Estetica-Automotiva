const express = require("express");

const path = require("path");

const db = require("./database");

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
    
    const { nome, telefone, email, servico, data, horario} = req.body;

        db.run(
            `INSERT INTO agendamentos
            (nome, telefone, email, servico, data, horario)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [nome, telefone, email, servico, data, horario],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.send("Erro ao salvar o agendamento, tente novamente.");
                }

                res.send("Agendamento salvo com sucesso!");
                }
                
        );
});


app.get("/agendamentos", (req, res) => {
    
    db.all(
        "SELECT * FROM agendamentos",
        [],
        (err, rows) => {
            
             if (err) {
                console.error(err);
                return res.send("Erro ao buscar agendamentos.");
             }
             res.json(rows);

        }
    );
});

//CONFIRMAÇÃO DO SERVIDOR RODANDO
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});