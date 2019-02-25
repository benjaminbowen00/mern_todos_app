const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function(){
  console.log("MongoDB database connection established successfully")
});

todoRoutes.route('/').get(function(req, res){
  Todo.find(function(err, todos){
    if(err){
      console.log(err);
    }
    else{
      res.json(todos)
    }
  })
});

// todoRoutes.route('/add').post(function(req, res){
//   let todo = new Todo(req.body);
//   todo.save()
//       .then(todo => {
//         res.status(200).json({'todo': 'todo added successfully'});
//       })
//       .catch(err => {
//         res.status(400).send('adding new todo failed');
//       });
// });

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});



todoRoutes.route('/update/:id').post(function(req, res){
  Todo.findById(req.params.id, function(err, todo){
    if(!todo){
      res.status(404).send('data is not found');
    }
    else{
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo.save().then(todo => {
        res.json('Todo updated');
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
    }
  });
});

todoRoutes.route('/delete/:id').delete(function(req, res){
  Todo.findByIdAndRemove(req.params.id, function(err,todo){
    if(!todo){
      res.status(404).send('data is not found');
    }
    else {
      const response = {
          message: "Todo successfully deleted",
          id: todo._id
      };
      return res.status(200).send(response);
    }
  })
})

// router.delete('/todos/:id', (req, res, next) => {
//   Todo.findOneAndDelete({"_id": req.params.id})
//     .then(data => res.json(data))
//     .catch(next)
// })

// // The "todo" in this callback function represents the document that was found.
// // It allows you to pass a reference back to the client in case they need a reference for some reason.
// Todo.findByIdAndRemove(req.params.todoId, (err, todo) => {
//     // As always, handle any potential errors:
//     if (err) return res.status(500).send(err);
//     // We'll create a simple object to send back with a message and the id of the document that was removed
//     // You can really do this however you want, though.
//     const response = {
//         message: "Todo successfully deleted",
//         id: todo._id
//     };
//     return res.status(200).send(response);
// });

// router.delete('/comments/:commentId', (req, res) => {
//   const { commentId } = req.params;
//   if (!commentId) {
//     return res.json({ success: false, error: 'No comment id provided' });
//   }
//   Comment.remove({ _id: commentId }, (error, comment) => {
//     if (error) return res.json({ success: false, error });
//     return res.json({ success: true });
//   });
// });

todoRoutes.route('/:id').get(function(req, res){
  let id = req.params.id;
  Todo.findById(id, function(err, todo){
    if(err){
      console.log(err);
    }
    else{res.json(todo);}
  })
})



app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
