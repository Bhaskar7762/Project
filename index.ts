import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { Client } from "pg";

const app: Express = express();
const port: number = 3000;

const db: Client = new Client({
  user: "postgres",
  host: "localhost",
  database: "list",
  password: "08071998",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

interface Item {
  id: number;
  title: string;
}

let items: Item[] = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.query<Item>("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req: Request, res: Response) => {
  const item: string = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req: Request, res: Response) => {
  const item: string = req.body.updatedItemTitle;
  const id: number = parseInt(req.body.updatedItemId);

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req: Request, res: Response) => {
  const id: number = parseInt(req.body.deleteItemId);
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
