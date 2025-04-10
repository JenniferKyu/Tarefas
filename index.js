const express = require("express")
const bp= require("body-parser")
const cors= require("cors")
const app = express()
const sqlite3= require("sqlite3")
const path=require("path")

app.use(bp.json())
app.use(bp.urlencoded())
app.use(cors())
app.use(express.static(path.join(__dirname,'public')))

const db= new sqlite3.Database("./db.sqlite")

app.listen(8080, ()=>{
    console.log("O servidor está aberto na porta 8080")
})


db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS Tarefas( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tarefa VARCHAR(50) NOT NULL,
        categoria VARCHAR(50)
        )`)
})

//CREATE TABLE IS NOT EXISTS cria uma tabela, SE ela nao existir
//INTEGER é de numero inteiro
//PRIMARY KEY é usado pra relacionar dado entre tabela
//AUTOINCREMENT para adicionar um id a um novo item criado automaticamente
//VARCHAR para limitar a quantidade de escrita no espaço input
//NOT NULL para nao aceitar envio vazio

app.get("/tarefas", (req, res)=>{
    db.all(`SELECT * FROM Tarefas`, [],(err,rows)=>{
        res.json(rows)
    })
})
//err é usado pra tratar erros
//rows sao linhas

app.post("/tarefa", (req, res)=>{
    db.run(`INSERT INTO Tarefas (tarefa,categoria) VALUES (?,?)`, [req.body.tarefa, req.body.categoria])

})

app.delete("/tarefa/:id", (req,res)=>{
    db.run(`DELETE FROM Tarefas WHERE  id ==(?)`, [req.params.id])
})

app.get("/home",(req,res)=>{
    res.sendFile("index.html",{root:__dirname})
})
//resposta enviada do arquivo, sendo index.html (o arquivo), root identifica o servidor da pasta raiz, dirname sendo o diretorio da pasta atual
