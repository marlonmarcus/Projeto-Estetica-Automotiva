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

db.get(
    `
    SELECT * FROM agendamentos
    WHERE data = ?
    AND horario = ?
    `,
    [data, horario],
    (err, row) => {
        if (err) {
            console.error(err);
            return res.send("Erro ao verificar horário."); 
        }
        if (row) {
            return res.send("Este horário já está sendo utilizado, escolha outro horário.");
        }
    
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
        }
    );        
});

        

// MOSTRANDO OS DADOS DO AGENDAMENTO
app.get("/agendamentos", (req, res) => {

    db.all(
        "SELECT * FROM agendamentos",
        [],
        (err, rows) => {

            console.log("ERRO:", err);
            console.log("ROWS:", rows);

            if (err) {
                return res.send("Erro ao buscar agendamentos.");
            }

            let html = `
            <!DOCTYPE html>
            <html lang="pt-BR">

            <head>
                <meta charset="UTF-8">
                <title>Agendamentos</title>

                <link rel="stylesheet" href="/admin.css">
            </head>

            <body>
            <h1>Agendamentos</h1>

            <table border="1" cellpadding="10">
            
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Serviço</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Ações</th>
                </tr>
            `

            rows.forEach(agendamento => {

                html += `
              <tr>
                <td>${agendamento.id}</td>
                <td>${agendamento.nome}</td>
                <td>${agendamento.telefone}</td>
                <td>${agendamento.servico}</td>
                <td>${agendamento.data}</td>
                <td>${agendamento.horario}</td>
                <td>
                    <a class="editar" href="/editar/${agendamento.id}">Editar</a>
                 
                    <a class="excluir" href="/excluir/${agendamento.id}"
                    onclick="return confirm('Deseja excluir permanentemente esse agendamento?')">Excluir</a>
                </td> 
            </tr>
            `
});


app.get("/excluir/:id",(req,res) => {
    const id = req.params.id;
    
    db.run(
            "DELETE FROM agendamentos WHERE id = ?",
            [id],
            (err) => {

                if (err) {
                    console.error(err);
                    return res.send("Erro ao excluir.");
                }

                res.redirect("/agendamentos");

            }
        );

});

app.get("/editar/:id", (req, res) => {

    const id = req.params.id;
    db.get(
        "SELECT * FROM agendamentos WHERE id = ?",
        [id],
        (err, row) => {

            if (err) {
                console.error(err);
                return res.send("Erro ao buscar agendamento.");
            }

            let html = `
                <h1>Editar Agendamento</h1>

                <form action="/atualizar/${row.id}" method="POST">

                    <label>Nome:</label>
                    <input type="text" name="nome" value="${row.nome}">

                    <br><br>

                    <label>Telefone:</label>
                    <input type="text" name="telefone" value="${row.telefone}">

                    <br><br>

                    <label>Email:</label>
                    <input type="text" name="email" value="${row.email}">

                    <br><br>

                    <label>Serviço:</label>

                    <select name="servico">

                        <option value="simples"
                            ${row.servico === "simples" ? "selected" : ""}>
                            Lavagem Simples
                        </option>

                        <option value="completa"
                            ${row.servico === "completa" ? "selected" : ""}>
                            Lavagem Completa
                        </option>

                        <option value="motor"
                            ${row.servico === "motor" ? "selected" : ""}>
                            Lavagem de Motor
                        </option>

                    </select>

                    <br><br>

                    <label>Data:</label>

                    <input
                        type="date"
                        name="data"
                        value="${row.data}"
                    >

                    <br><br>

                    <label>Horário:</label>

                    <input
                        type="time"
                        name="horario"
                        value="${row.horario}"
                    >

                    <br><br>

                    <button type="submit">
                        Salvar Alterações
                    </button>

                </form>
            `;

            res.send(html);

        }
    );

});

app.post("/atualizar/:id", (req, res) => {
    const id = req.params.id;

    const {
        nome,
        telefone,
        email,
        servico,
        data,
        horario
    } = req.body;

    db.run(
        `
        UPDATE agendamentos
        SET
            nome = ?,
            telefone = ?,
            email = ?,
            servico = ?,
            data = ?,
            horario = ?
        WHERE id = ?
        `,
        [
            nome,
            telefone,
            email,
            servico,
            data,
            horario,
            id
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.send("Erro ao atualizar agendamento.");
            }

            res.redirect("/agendamentos");

        }
    );

});



        html += `</table>`
            res.send(html);
        }
    );
});

//CONFIRMAÇÃO DO SERVIDOR RODANDO
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});