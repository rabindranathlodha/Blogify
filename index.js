const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');

const userRoute = require('./routes/user');
const { checkForAuthCookie } = require('./middlewares/authentication');


const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkForAuthCookie('token'));

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
    .then((e) => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', (req, res) => {
    res.render("home",{
        user: req.user,
    });
});

app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));