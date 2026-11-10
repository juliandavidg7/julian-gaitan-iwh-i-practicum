require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = "2-72697683";

// ROUTE 1: Render homepage with Custom Object records
app.get("/", async (req, res) => {
  const customObjectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,breed,age`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(customObjectsUrl, { headers });
    const data = resp.data.results;
    res.render("homepage", {
      title: "Pets | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching custom objects");
  }
});

// ROUTE 2: Render the form to create a new record
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// ROUTE 3: Handle form submission and create new record in HubSpot
app.post("/update-cobj", async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
    },
  };

  const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createUrl, newRecord, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating custom object record");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
