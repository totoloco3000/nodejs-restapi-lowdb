import { getConnection } from "../database.js";

export const getTasks = (req, res) => {
  const tasks = getConnection().data.tasks;
  res.json(tasks);
};

export const createDni = async (req, res) => {
  const newDni = {
    dni: req.body.dni,
    data: req.body.data
  };

  try {
    const db = getConnection();
    db.data.register.push(newDni);
    await db.write();

    res.json(newDni);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getTask = (req, res) => {
  const taskFound = getConnection().data.tasks.find(
    (t) => t.id === req.params.id
  );
  if (!taskFound) res.sendStatus(404);
  res.json(taskFound);
};

export const updateTask = async (req, res) => {
  const { name, description } = req.body;

  try {
    const db = getConnection();
    const taskFound = db.data.tasks.find((t) => t.id === req.params.id);
    if (!taskFound) return res.sendStatus(404);

    taskFound.name = name;
    taskFound.description = description;

    db.data.tasks.map((t) => (t.id === req.params.id ? taskFound : t));

    await db.write();

    res.json(taskFound);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deleteTask = async (req, res) => {
  const db = getConnection();
  const taskFound = db.data.tasks.find((t) => t.id === req.params.id);
  if (!taskFound) res.sendStatus(404);

  const newDnis = db.data.tasks.filter((t) => t.id !== req.params.id);
  db.data.tasks = newDnis;
  await db.write();

  return res.json(taskFound);
};

export const count = async (req, res) => {
  const totalTasks = getConnection().data.tasks.length;
  res.json(totalTasks);
};
