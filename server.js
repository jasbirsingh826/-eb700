// WEB700 – Assignment 04
// I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
// of this assignment has been copied manually or electronically from any other source
// (including 3rd party web sites) or distributed to other students.
// Cyclic link : https://raspberry-ostrich-vest.cyclic.app/
// Name: Jasbir Singh Student ID:116277229 Date: 12 July 2023

var express = require("express");
const path = require('path');
// const exh = require('express-handlebars');
const collegeData = require("./modules/collegeData");
var app = express();
var HTTP_PORT = 3000;

var exphbs = require("express-handlebars");

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs"
  })
);

app.set("view engine", ".hbs");
app.use(express.urlencoded({ extended: true }));
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});



app.get("/students", (req, res) => {
    const { course} = req.query;
    collegeData.getAllStudents().then(students => {
        if(course) {
            let filStudents = students.filter(val => val.course === Number(course));
            if (filStudents.length > 0) {
                res.status(200).json(filStudents);
            } else {
                res.status(200).send({message:"no results"});
            }
        } else {
            res.render("students", { students: students });
        }
    }).catch(err => {
        res.status("students", {message:"no results"});
    })
});
app.get("/student/:num", (req, res) => {
    const { num} = req.params;
    collegeData.getStudentByNum(Number(num)).then(student => {
        res.status(200).json(student);
    }).catch(err => {
        res.status(500).send({message:"no results"});
    })
});

app.get("/students/edit/:num", (req, res) => {
    const { num } = req.params;
    collegeData.getStudentByNum(Number(num)).then(student => {
        res.render("editStudent", { student: student });
    }).catch(err => {
        res.status(500).send({message:"no results"});
    })
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(tas => {
        res.status(200).json(tas);
    }).catch(err => {
        res.status(500).send({message:"no results"});
    })
});
app.get("/", (req, res) => {
    res.render('home');
});
app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get("/course/:id", (req, res) => {
    const courseId = Number(req.params.id);
    collegeData.getCourseById(courseId).then(course => {
        res.render("course", { course: course });
    }).catch(err => {
        res.render("course", { message: "no results" });
    })
});

app.get("/courses/edit/:id", (req, res) => {
    const courseId = Number(req.params.id);
    collegeData.getCourseById(courseId).then(course => {
        res.render("editCourse", { course: course });
    }).catch(err => {
        res.render("course", { message: "no results" });
    })
});


app.get("/students/add", (req, res) => {
    res.render('addStudent');
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
    .then(() => res.redirect('/students'))
    .catch(err => {
        res.render(500).send({message:"no results"});
    })
});

app.post("/students/edit/:num", (req, res) => {
    const { num } = req.params;
    collegeData.updateStudent(num, req.body)
    .then(() => res.redirect('/students'))
    .catch(err => {
        res.render(500).send({message:"An error occurred while updating the student."});
    })
});

app.post("/courses/edit/:id", (req, res) => {
    const courseId = Number(req.params.id);
    collegeData.updateCourse(courseId, req.body)
    .then(() => res.redirect('/courses'))
    .catch(err => {
        res.render(500).send({message:"An error occurred while updating the course."});
    })
});

app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).sendFile(filePath);
});

collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
}).catch(err => {
    console.error(err);
});