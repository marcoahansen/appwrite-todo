import { useState } from "react";

import { ID } from "appwrite";

import { databases } from "../appwrite/appwriteConfig";

import { Button, Paper, TextField, Container } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
export default function Todoform() {
  const [todo, setTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = databases.createDocument(
      "6333058761d7d4556063",
      "63330d48a035ff0cc404",
      ID.unique(),
      {
        todo,
      }
    );
    promise.then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    setTodo("");
  };
  return (
    <Container maxWidth="lg">
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, display: "flex" }}
      >
        <TextField
          required
          fullWidth
          id="Todo"
          label="What to do?"
          name="todo"
          autoComplete="todo"
          autoFocus
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button sx={{ marginLeft: "2%" }} type="submit" variant="contained">
          <NoteAddIcon />
        </Button>
      </Paper>
    </Container>
  );
}
