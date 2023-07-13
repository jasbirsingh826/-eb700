const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;
exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students) {
        dataCollection.students = [
          ...dataCollection.students,
          {
            ...studentData,
            studentNum: dataCollection.students.length + 1,
            TA: studentData.TA ? true : false,
            course: Number(studentData.course),
          },
        ];
        resolve();
      }
      reject();
    });
  }
exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, studentsData) => {
            if (err) {
                reject("Unable to read students.json");
            } else {
                fs.readFile('./data/courses.json', 'utf8', (err, coursesData) => {
                    if (err) {
                        reject("Unable to read courses.json");
                    } else {
                        dataCollection = new Data(JSON.parse(studentsData), JSON.parse(coursesData));
                        resolve();
                    }
                });
            }
        });
    });
}

exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No results returned");
        }
    });
}

exports.getTAs = function() {
    return new Promise((resolve, reject) => {
        const TAs = dataCollection.students.filter(student => student.TA === true);
        if (TAs.length > 0) {
            resolve(TAs);
        } else {
            reject("No results returned");
        }
    });
}

exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("No results returned");
        }
    });
}
module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
      let result = dataCollection.students.filter(student => student.course === course);
      if (result.length > 0) resolve(result);
      else reject("No results returned");
    });
  }
  
  module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
      let result = dataCollection.students.find(student => student.studentNum === num);
      if (result) resolve(result);
      else reject("No results returned");
    });
  }
  