const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');

const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


const { checkForAuthCookie } = require('./middlewares/authentication');


const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkForAuthCookie('token'));
app.use(express.static(path.resolve('./public')));

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
    .then((e) => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));