const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: "cricketTeam.db",
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/player/");
    });
  } catch (e) {
    console.log(`DB Error is ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjToRespondObj = (obj) => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT * FROM cricket_team ORDER BY player_id`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(
    playerArray.map((eachPlayer) => convertDbObjToRespondObj(eachPlayer))
  );
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerAddQuery = `
    INSERT INTO 
        cricket_team (playerName, jerseyName, role)
    VALUES
       (
           '${playerName}',
           '${jerseyNumber}',
           '${role}',
       );`;
  const postResponse = await db.run(playerAddQuery);
  const playerId = postResponse.lastID;
  response.send({ playerId: playerId });
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerIDQuery = `
  SELECT 
    * 
  FROM 
    cricket_team 
  WHERE 
    player_id = ${playerId}`;
  const player = await db.get(getPlayerIDQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putPlayerQuery = `
    UPDATE
        cricket_team
    SET
        player_name = '${player_name}',
        jersey_number = ${jersey_number},
        role = '${role}',
    WHERE 
        player_id = ${playerId};
   `;
  await db.run(putPlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM 
        cricket_team
    WHERE 
        player_id = ${player_id}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
