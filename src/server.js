 const express = require("express")
 const server = express()

 //pegar o banco de dados
 const db = require("./database/db")

 //configurar pasta pública
 server.use(express.static("public"))

 //habilitar o uso do req.body na nossa aplicação
 server.use(express.urlencoded({extended: true }))

 //utilizando template engine
 const nunjucks = require("nunjucks")
 nunjucks.configure("src/views", {
     express: server,
     noCache: true
 })


 //configurar caminhos da minha aplicação
 //Página inicial:
 server.get("/", (req, res) => { //req: requisição | res: presposta
    return res.render("index.html")
 })


 //Página de criação de ponto de coleta
 server.get("/create-point", (req, res) => {

   //req.query: Query Strings da nossa url 
    return res.render("create-point.html")
 })

 server.post("/savepoint", (req, res) => {

   //inserir os dados no banco de dados
   const query = `
   INSERT INTO places(
       image,
       name,
       address,
       address2,
       state,
       city,
       items
   ) VALUES(?,?,?,?,?,?,?);`

//req.body: é o corpo do nosso formulário
const values = [
   req.body.image,
   req.body.name,
   req.body.address,
   req.body.address2,
   req.body.state,
   req.body.city,
   req.body.items
]

function afterInsertData(err) {
   if (err) {
       console.log(err)
       return res.send("Erro no cadastro !")
   }
   console.log("Cadastrado com sucesso")
   
   return res.render("create-point.html", {saved: true})
}

db.run(query, values, afterInsertData)
   
})

 //Página de pontos de coleta encontrados
 server.get("/search-results", (req, res) => {

   const search = req.query.search
    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
      if (err) {
          return console.log(err)
      }

      //verifica quantos pontos foram encontrados
      const total = rows.length

      //mostrar a página html com os dados do banco de dados
      return res.render("search-results.html", {places: rows, total})     
  })

 })
 
 //Ligar o servidor
 server.listen(3000)