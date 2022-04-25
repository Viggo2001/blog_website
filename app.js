const express = require('express');
const mongoose = require('mongoose');
const Blogs = require('./models/blogs');

const app = express();

const url = 'mongodb+srv://tom123:Graphic4@mynewcluster.coxgo.mongodb.net/blog-cluster?retryWrites=true&w=majority';

mongoose.connect(url)
    .then((result) => { app.listen(2000); })
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'myViews');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.post('/blogs/post', (req, res) => {
    const newBlog = new Blogs(req.body);

    newBlog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => console.log(err));
});

app.get('/blogs', (req, res) => {

    Blogs.find()
        .then((result) => {
            res.render('index', { title: 'Blogs', blogs: result });
        })
        .catch((err) => console.log(err));

});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create' });
});

app.get('/blogs/details/:id', (req, res) => {
    const id = req.params.id;

    Blogs.findById(id)
        .then((result) => {
            res.render('details', { title: 'Details', blog: result });
        })
        .catch((err) => console.log(err));
});

app.delete('/blogs/details/:id', (req, res) => {
    const id = req.params.id;

    Blogs.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => console.log(err));
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
