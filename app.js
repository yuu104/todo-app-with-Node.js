'use strict';
(() => {


  const express = require('express');
  const app = express();
  const mysql = require('mysql');
  const ejs = require('ejs');

  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zuvm8152',
    database: 'todo_app_node'
  });

  app.engine('ejs', ejs.renderFile);  


  con.connect((err) => {
    if(err) {
      console.log('error connecting:' + err.stack);
      return;
    }
    console.log('Connected');
  });

  app.use(express.static('public'));
  app.use(express.urlencoded({extended: false}));
  app.use(function(err, req, res, next) {
    res.send(err.message);
  });

  app.get('/', (req, res) => {
    con.query(
      'SELECT * FROM doTasks ORDER BY priority',
      (error_d, results_d) => {
        con.query(
          'SELECT * FROM compedTasks',
          (error_c, results_c) => {
            res.render('index.ejs', {doItems: results_d, compedItems: results_c});
          }
        );
      }
    );
  });

  app.post('/create', (req, res) => {
    con.query(
      'INSERT INTO doTasks(task, priority) VALUES (?, ?)',
      [req.body.taskName, req.body.priority],
      (error, results) => {
        res.redirect('/');
      }
    );
  });

  app.post('/delete/:id', (req, res) => {
    con.query(
      'DELETE FROM doTasks WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
  });

  app.post('/comped/:task/:id/:priority', (req, res) => {
    con.query(
      'INSERT INTO compedTasks(task, priority) VALUES (?, ?)',
      [req.params.task, req.params.priority],
      (error_c, results_c) => {
        con.query(
          'DELETE FROM doTasks WHERE id = ?',
          [req.params.id],
          (error_d, results_d) => {
            res.redirect('/');
          }
        );
      }
    );
  });

  app.post('/reCreate/:task/:id/:priority', (req, res) => {
    con.query(
      'INSERT INTO doTasks(task, priority) VALUES(?, ?)',
      [req.params.task, req.params.priority],
      (error_d, results_d) => {
        con.query(
          'DELETE FROM compedTasks WHERE id = ?',
          [req.params.id],
          (error_c, results_c) => {
            res.redirect('/');
          }
        );
      } 
    );
  });

  app.post('/renew/:id', (req, res) => {
    con.query(
      'UPDATE doTasks SET task=?, priority=? WHERE id=?',
      [req.body.editTaskName, req.body.editPriority, req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
  });











  app.listen(3000, () => {
    console.log('Start server port:3000');
  });
































})();