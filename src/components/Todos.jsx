import { useState, useEffect } from "react";

import {
  Typography,
  Grid,
  Paper,
  Button,
  Container,
  OutlinedInput,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import CheckIcon from "@mui/icons-material/Check";

import { databases, client } from "../appwrite/appwriteConfig";

export default function Todos() {
  const [todos, setTodos] = useState();
  const [load, setLoad] = useState(true);
  const [editToDo, setEditToDo] = useState("");
  const [todoText, setTodoText] = useState("");

  useEffect(() => {
    const getTodos = databases.listDocuments(
      "6333058761d7d4556063",
      "63330d48a035ff0cc404"
    );

    getTodos.then(
      (response) => {
        setTodos(response.documents);
        console.log(response.documents);
      },
      (error) => {
        console.log(error);
      }
    );
    setLoad(false);
  }, []);

  useEffect(() => {
    if (editToDo != null) {
      setTodoText(editToDo.todo);
    }
  }, [editToDo]);

  client.subscribe(
    "databases.6333058761d7d4556063.collections.63330d48a035ff0cc404.documents",
    (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        todos && setTodos([...todos, response.payload]);
      }
    }
  );

  const deleteTodo = (id) => {
    const deleting = databases.deleteDocument(
      "6333058761d7d4556063",
      "63330d48a035ff0cc404",
      id
    );
    deleting.then(
      (response) => {
        console.log(response);
        setTodos(todos.filter((todo) => todo.$id !== id));
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const submitEditTodo = (id, todo) => {
    console.log(id, todo);
    console.log(todos);

    const editing = databases.updateDocument(
      "6333058761d7d4556063",
      "63330d48a035ff0cc404",
      id,
      {
        todo: todoText,
      }
    );
    editing.then(
      (response) => {
        console.log(response);
        let updatedTodos = todos.map((todo) => {
          if (todo.$id === id) {
            todo.todo = todoText;
          }
          return todo;
        });
        console.log(updatedTodos);
        setTodos(updatedTodos);
      },
      (error) => {
        console.log(error);
      }
    );
    setEditToDo("");
  };

  return (
    <Container maxWidth="lg">
      <Grid item xs={12} mt={5}>
        <Typography variant="h6" color="inherit" noWrap mb={3}>
          Todos List
        </Typography>
        {load ? (
          <Paper mt={5} sx={{ p: 2, display: "flex" }}>
            {" "}
            loading ...
          </Paper>
        ) : (
          <>
            {todos &&
              todos.map((item) => (
                <Paper
                  key={item.$id}
                  id={item.$id}
                  mt={5}
                  sx={{
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {editToDo && item.$id === editToDo.$id ? (
                    <OutlinedInput
                      fullWidth
                      value={todoText || ""}
                      onChange={(e) => setTodoText(e.target.value)}
                    />
                  ) : (
                    <Typography
                      sx={{
                        p: 1.5,
                      }}
                    >
                      {item.todo}
                    </Typography>
                  )}

                  <Paper
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {editToDo && item.$id === editToDo.$id ? (
                      <Button
                        onClick={() => submitEditTodo(item.$id, item.todo)}
                      >
                        <CheckIcon />
                      </Button>
                    ) : (
                      <Button onClick={() => setEditToDo(item)}>
                        <ModeIcon />
                      </Button>
                    )}
                    <Button onClick={() => deleteTodo(item.$id)}>
                      <DeleteIcon />
                    </Button>
                  </Paper>
                </Paper>
              ))}
          </>
        )}
      </Grid>
    </Container>
  );
}
