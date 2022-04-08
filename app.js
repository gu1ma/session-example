const express = require('express');
const app = express();
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

const PORT = 3000;

app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "secret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


app.use(express.urlencoded({extended:false}));

app.get('/', (_, res) => res.send('hello world'))

app.get('/login', (_, res) => res.sendFile(__dirname + '/src/views/login.html'));
app.post('/login', (req, res) => {
    const { user, pass } = req.body;

    if(user === 'usuario' && pass === 'senha') {
        req.session.usuario = 123456;

        return res.redirect('/home');
    }

    req.session.usuario = undefined;
    return res.redirect('/login');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})


//Rotas privadas protegidas por um middleware
app.use((req, res, next) => {
    //se não tiver usuário logado, redirecionamos para o login
    if(req.session.usuario === undefined) {
        console.log('redirect')
        return res.redirect('/login');
    }
    //se não, deixamos o usuário passar
    next();
})

app.get('/home', (req, res) => {
    res.send('aqui é a home, uma área privada, o usuário logado é: ' + req.session.usuario +  ' <a href="/logout">Logout</a>');
})

app.get('/dashboard', (_, res) => {
    res.send('aqui é o dashboard, uma área privada');
})

app.listen(PORT, console.log('server running...'));