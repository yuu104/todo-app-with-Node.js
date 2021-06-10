'use strict';
(() => {


  const express = require('express');
  const app = express();
  const mysql = require('mysql');
  const ejs = require('ejs');
  const port = process.env.PORT || 5000;

  const databaseName = 'heroku_ab8c7c0b754d4e6'
  const con = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b1da43c7e2a04d',
    password: 'bd43d989',
    database: 'heroku_ab8c7c0b754d4e6'
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
      /*
      con.query('create database if not exists ??:', databaseName),
      con.query('use ??', databaseName),
      con.query('create table if not exists doTasks(id int(11) PRI auto_increment, task text, priority text, isDone text)'),
      con.query('create table if not exists contPlan(id int(11) PRI auto_increment, estimate text, measure text'),
      */
      'SELECT * FROM doTasks WHERE isDone="no" ORDER BY priority',
      (error_d, results_d) => {
        con.query(
          'SELECT * FROM doTasks WHERE isDone="yes"',
          (error_c, results_c) => {
            con.query(
              'SELECT * FROM contPlan',
              (error_p, results_p) => {
                con.query(
                  'SELECT COUNT(*), COUNT(isDone="no" OR NULL), COUNT(isDone="yes" OR NULL) FROM doTasks', 
                  (error_count, results_count) => {
                    res.render('make.ejs', 
                    {
                      doItems: results_d,
                      compedItems: results_c,
                      contPlans: results_p,
                      countTotal: results_count[0]['COUNT(*)'],
                      countTask: results_count[0]['COUNT(isDone="no" OR NULL)'],
                      countComped: results_count[0]['COUNT(isDone="yes" OR NULL)']
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });

  app.post('/create', (req, res) => {
    con.query( 
      'INSERT INTO doTasks(task, priority, isDone) VALUES (?, ?, "no")',
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

  app.post('/comped/:id', (req, res) => {
    con.query(
      'UPDATE doTasks SET isDone="yes" WHERE id=?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
  });

  app.post('/reCreate/:id', (req, res) => {
    con.query(
      'UPDATE doTasks SET isDone="no" WHERE id=?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
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

  app.post('/planing', (req, res) => {
    con.query(
      'INSERT INTO contPlan(estimate, measure) VALUES(?, ?)',
      [req.body.estimate, req.body.measure],
      (error, results) => {
        res.redirect('/');
      }
    );
  });

  app.post('/contPlanDelete/:id', (req, res) => {
    con.query(
      'DELETE FROM contPlan WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
  });











  app.listen(port, () => {
    console.log('Start server port:3000');
  });
































})();