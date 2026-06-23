
const SUPABASE_URL =
  "https://coxfhjiycetfgxjoqvci.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_c_DJ4suyrcFCf-Q2iP4NzQ__KAP5did";
  let supabase = null;

if(
  window.supabase
){

  supabase =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

}
let songs =
  JSON.parse(
    localStorage.getItem(
      "musikrace_songs"
    )
  ) || [];
  let teams = [];

let currentSong =
  null;

const screen =
  document.getElementById("screen");
  
  if(
  location.pathname ===
  "/join"
){

  renderJoin();

}
else{

  renderHome();

}

function renderHome() {

  screen.innerHTML = `

    <div class="card">

      <h2>
        🎸 Musikrace
      </h2>

      <button
        onclick="openLibrary()"
      >
        📚 Mina låtar
      </button>

      <button
        onclick="startGame()"
      >
        🎮 Starta spel
      </button>

    </div>

  `;

}

function newQuiz() {

  const name =
    prompt(
      "Vad ska quizet heta?"
    );

  if (!name) {
    return;
  }

  quizzes.push({
  name: name,
  songs: []
});

saveData();

renderHome();
}

function deleteQuiz(index) {

  if (
    !confirm(
      "Ta bort quizet?"
    )
  ) {
    return;
  }

  quizzes.splice(index, 1);
  saveData();

  renderHome();
}

function openQuiz(index) {

  const quiz =
    quizzes[index];

  let html = `
    <div class="card">

      <h2>
        ${quiz.name}
      </h2>

      <button
        onclick="
          newSong(${index})
        ">
        ➕ Ny låt
      </button>

      <button
        class="secondary"
        onclick="
          renderHome()
        ">
        ⬅ Tillbaka
      </button>

    </div>
  `;

  quiz.songs.forEach(
    (song, songIndex) => {

		html += `
  <div class="songRow">

    <h3>
      🎵 ${song.title}
    </h3>

    <div>
      ${song.questions.length}
      frågor
    </div>

    <button
      onclick="
        openSong(
          ${index},
          ${songIndex}
        )
      "
    >
      Öppna
    </button>

    <button
      onclick="
        renameSong(
          ${index},
          ${songIndex}
        )
      "
    >
      ✏️ Byt namn
    </button>

    <button
      class="danger"
      onclick="
        deleteSong(
          ${index},
          ${songIndex}
        )
      "
    >
      🗑️ Ta bort
    </button>

    <button
      onclick="
        moveSongUp(
          ${index},
          ${songIndex}
        )
      "
    >
      ⬆️
    </button>

    <button
      onclick="
        moveSongDown(
          ${index},
          ${songIndex}
        )
      "
    >
      ⬇️
    </button>

  </div>
`;

  });

  screen.innerHTML = html;
}

function newSong(
  quizIndex
) {

  const title =
    prompt(
      "Låtens namn?"
    );

  if (!title) {
    return;
  }

  const count =
    Number(
      prompt(
        "Antal frågor?"
      )
    );

  if (!count) {
    return;
  }

  const finalTask =
    prompt(
      "Slutuppdrag?"
    );

  const questions = [];

  for (
    let i = 0;
    i < count;
    i++
  ) {

    questions.push({
      question: "",
      answer: "",
      image: "",
      penalty: 10
    });

  }

  quizzes[
    quizIndex
  ].
  songs.push({

  title,

  useFinalTask:
    true,

  finalTask:
    finalTask || "",

  questions,

  played: false

});
saveData();
  openQuiz(
    quizIndex
  );
}

function openSong(
  quizIndex,
  songIndex
) {

  const song =
    quizzes[
      quizIndex
    ].songs[
      songIndex
    ];

  let html = `
    <div class="card">

      <h2>
        🎵
        ${song.title}
      </h2>

      <p>
        ${song.finalTask}
      </p>

      <button
        class="secondary"
        onclick="
          openQuiz(
            ${quizIndex}
          )
        ">
        ⬅ Tillbaka
      </button>

    </div>
  `;

  song.questions.forEach(
    (q, i) => {

    const done =
      q.question
      ? "🟢"
      : "⚪";

	  html += `
<div
  class="questionRow"
  onclick="
    openQuestion(
      ${quizIndex},
      ${songIndex},
      ${i}
    )
  "
>

  ${done}
  Fråga ${i + 1}

</div>
`;

  });

  screen.innerHTML =
    html;
}
function changePenalty(
  amount
) {

  if(
    !window.currentPenalty
  ){
    window.currentPenalty = 10;
  }

  window.currentPenalty +=
    amount;

  if(
    window.currentPenalty < 1
  ){
    window.currentPenalty = 1;
  }

  document
    .getElementById(
      "penaltyValue"
    )
    .textContent =
      window.currentPenalty;
}

function openQuestion(
  songIndex,
  questionIndex
){

  const song =
    songs[songIndex];

  const q =
    song.questions[
      questionIndex
    ];

  screen.innerHTML = `

    <div class="card">

      <h2>
        🎵 ${song.title}
      </h2>

      <h3>
        Fråga
        ${questionIndex + 1}
        av
        ${song.questions.length}
      </h3>

      <label>
        Frågetext
      </label>

      <input
        id="questionText"
        value="${q.question}"
      >

      <label>
        Rätt svar
      </label>

      <input
        id="answerText"
        value="${q.answer}"
      >

      <label>
        Bild
      </label>

      <input
        id="imageFile"
        type="file"
        accept="image/*"
      >

      <div id="preview">

        ${
          q.image
            ? `
            <img
              src="${q.image}"
              style="
                width:200px;
                margin-top:15px;
                border-radius:12px;
              "
            >
            `
            : ""
        }

      </div>

      <label>
        Strafftid vid fel
      </label>

      <div
        style="
          display:flex;
          gap:20px;
          justify-content:center;
          align-items:center;
          margin-bottom:20px;
        "
      >

        <button
          type="button"
          onclick="
            changePenalty(-1)
          "
        >
          −
        </button>

        <span
          id="penaltyValue"
          style="
            font-size:30px;
            min-width:50px;
            text-align:center;
          "
        >
          ${q.penalty || 10}
        </span>

        <button
          type="button"
          onclick="
            changePenalty(1)
          "
        >
          +
        </button>

      </div>

      <button
        onclick="
          saveQuestion(
            ${songIndex},
            ${questionIndex}
          )
        "
      >
        💾 Spara
      </button>

      <button
        class="secondary"
        onclick="
          openSong(
            ${songIndex}
          )
        "
      >
        ⬅ Tillbaka
      </button>

    </div>

  `;

  window.currentPenalty =
    q.penalty || 10;
}
function saveQuestion(
  songIndex,
  questionIndex
){

  const q =
    songs[songIndex]
      .questions[
        questionIndex
      ];

  q.question =
    document
      .getElementById(
        "questionText"
      )
      .value
      .trim();

  q.answer =
    document
      .getElementById(
        "answerText"
      )
      .value
      .trim()
      .toLowerCase();

  q.penalty =
    window.currentPenalty;

  const file =
    document
      .getElementById(
        "imageFile"
      )
      .files[0];

  if(file){

    const reader =
      new FileReader();

    reader.onload =
      function(e){

        q.image =
          e.target.result;

        saveData();

        openSong(
          songIndex
        );

      };

    reader.readAsDataURL(
      file
    );

  }
  else{

    saveData();

    openSong(
      songIndex
    );

  }
}
function saveData(){

  localStorage.setItem(
    "musikrace_songs",
    JSON.stringify(
      songs
    )
  );

}
function renameSong(
  quizIndex,
  songIndex
){

  const song =
    quizzes[quizIndex]
      .songs[songIndex];

  const name =
    prompt(
      "Nytt namn på låten:",
      song.title
    );

  if(!name){
    return;
  }

  song.title =
    name;

  saveData();

  openQuiz(
    quizIndex
  );
}
function deleteSong(
  songIndex
){

  if(
    !confirm(
      "Ta bort låten?"
    )
  ){
    return;
  }

  songs.splice(
    songIndex,
    1
  );

  saveData();

  openLibrary();
}
function moveSongUp(
  quizIndex,
  songIndex
){

  if(
    songIndex === 0
  ){
    return;
  }

  const songs =
    quizzes[quizIndex]
      .songs;

  [
    songs[songIndex - 1],
    songs[songIndex]
  ] =
  [
    songs[songIndex],
    songs[songIndex - 1]
  ];

  saveData();

  openQuiz(
    quizIndex
  );
}
function moveSongDown(
  quizIndex,
  songIndex
){

  const songs =
    quizzes[quizIndex]
      .songs;

  if(
    songIndex ===
    songs.length - 1
  ){
    return;
  }

  [
    songs[songIndex],
    songs[songIndex + 1]
  ] =
  [
    songs[songIndex + 1],
    songs[songIndex]
  ];

  saveData();

  openQuiz(
    quizIndex
  );
}
function openLibrary(){

  let html = `

    <div class="card">

      <h2>
        📚 Mina låtar
      </h2>

      <button
        onclick="newSong()"
      >
        ➕ Ny låt
      </button>

      <button
        class="secondary"
        onclick="renderHome()"
      >
        ⬅ Tillbaka
      </button>

    </div>

  `;

  songs.forEach(
    (song, i) => {

      html += `

        <div class="songRow">

          <h3>
            🎵 ${song.title}
          </h3>

          <div>
            ${song.questions.length}
            frågor
          </div>

          <button
            onclick="
              openSong(${i})
            "
          >
            Öppna
          </button>

          <button
            onclick="
              renameSong(${i})
            "
          >
            ✏️
          </button>

          <button
            class="danger"
            onclick="
              deleteSong(${i})
            "
          >
            🗑️
          </button>

        </div>

      `;

    }
  );

  screen.innerHTML =
    html;
}

function startGame(){

  let html = `

    <div class="card">

      <h2>
        🎮 Musikrace
      </h2>
	  <p>

  ${
    teams.filter(
      t =>
        t.connected
    ).length
  }

  lag anslutna

</p>

      <button
        onclick="
          addTeam()
        "
      >
        ➕ Lägg till lag
      </button>

  `;

  teams.forEach(
  (team, i) => {

    html += `

      <div
        class="songRow"
      >

        ${
          team.connected
            ? "✔"
            : "○"
        }

        ${team.name}

        <button
          onclick="
            connectTeam(
              ${i}
            )
          "
        >
          📱 Anslut
        </button>

      </div>

    `;

  }
);

  html += `

  <button
  onclick="
    endRound()
  "
>
  ▶ Avsluta omgång
</button>

<button
  onclick="
    chooseSong()
  "
>
  🎸 Välj nästa låt
</button>

      <button
        class="secondary"
        onclick="
          renderHome()
        "
      >
        ⬅ Tillbaka
      </button>

    </div>

  `;

  screen.innerHTML =
    html;
}
function newSong(){

  const title =
    prompt(
      "Låtens namn?"
    );

  if(!title){
    return;
  }

  const count =
    Number(
      prompt(
        "Antal frågor?"
      )
    );

  if(!count){
    return;
  }

  const finalTask =
    prompt(
      "Slutuppdrag?"
    );

  const questions = [];

  for(
    let i = 0;
    i < count;
    i++
  ){

    questions.push({

      question: "",
      answer: "",
      image: "",
      penalty: 10

    });

  }

  songs.push({

  title,

  useFinalTask:
    true,

  finalTask:
    finalTask || "",

  questions

});

  saveData();

  openLibrary();
}
function openSong(
  songIndex
){

  const song =
    songs[songIndex];

  let html = `

    <div class="card">

      <h2>
        🎵
        ${song.title}
      </h2>

      <div
        style="
          font-size:30px;
          text-align:center;
          margin:20px 0;
        "
      >
        ${
          song.questions
            .map(
              q =>
                q.question
                ? "🟢"
                : "⚪"
            )
            .join("")
        }
      </div>

	  <label>

  <input
    type="checkbox"
    id="useFinalTask"
    ${
      song.useFinalTask
        ? "checked"
        : ""
    }
  >

  Använd slutuppgift

</label>

<textarea
  id="finalTask"
  rows="3"
  style="
    width:100%;
    margin-top:15px;
  "
>${
  song.finalTask || ""
}</textarea>

<button
  onclick="
    saveSongSettings(
      ${songIndex}
    )
  "
>
  💾 Spara inställningar
</button>

      <button
        class="secondary"
        onclick="
          openLibrary()
        "
      >
        ⬅ Tillbaka
      </button>

    </div>

  `;

  song.questions.forEach(
    (q, i) => {

      const done =
        q.question
        ? "🟢"
        : "⚪";

      html += `

        <div
          class="questionRow"

          onclick="
            openQuestion(
              ${songIndex},
              ${i}
            )
          "
        >

          ${done}
          ${q.image ? "🖼️" : ""}
          Fråga ${i + 1}

        </div>

      `;

    }
  );

  screen.innerHTML =
    html;
}
function renameSong(
  songIndex
){

  const song =
    songs[songIndex];

  const name =
    prompt(
      "Nytt namn på låten:",
      song.title
    );

  if(!name){
    return;
  }

  song.title =
    name.trim();

  saveData();

  openLibrary();
}

function chooseSong(){

  let html = `

    <div class="card">

      <h2>
        🎸 Välj nästa låt
      </h2>

  `;

  songs.forEach(
  (song, i) => {

    if(
      !song.played
    ){

      html += `

        <button
          onclick="
            startRound(
              ${i}
            )
          "
        >
          ▶
          ${song.title}
        </button>

      `;

    }

  }
);
const playedSongs =
  songs.filter(
    song =>
      song.played
  );

if(
  playedSongs.length
){

  html += `

    <hr>

    <h3>
      ✔ Redan spelade
    </h3>

  `;

  playedSongs.forEach(
    song => {

      html += `

        <p>
          ${song.title}
        </p>

      `;

    }
  );

}

html += `

      <button
        onclick="
          resetPlayedSongs()
        "
      >
        🔄 Nollställ spelade låtar
      </button>

      <button
        class="secondary"
        onclick="
          startGame()
        "
      >
        ⬅ Tillbaka
      </button>

    </div>

`;

  screen.innerHTML =
    html;
}
function startRound(
  songIndex
){

  currentSong =
    songIndex;

  songs[
    songIndex
  ].played =
    true;

  teams.forEach(
    team => {

      team.progress =
        0;

      team.finished =
        false;

      team.awarded =
        false;

    }
  );

  renderRace();
}
function renderRace(){
	
	console.log("renderRace körs");

  const song =
    songs[
      currentSong
    ];

  let html = `

    <div class="card">

      <h2>
        Rond pågår
      </h2>

  `;
  html += `

  <h3>
    🏆 Ställning
  </h3>

`;

teams.forEach(
  team => {

    html += `

      <p>

        ${team.name}
        ..........
        ${team.score}

      </p>

    `;

  }
);

  teams.forEach(
    (team, i) => {

      let boxes =
        "";

		for(
  let j = 0;
  j <
  song.questions.length;
  j++
){

  if(
    team.finished
  ){

    if(
      j ===
      song.questions.length - 1
    ){

      boxes +=
        "🏁";

    }
    else{

      boxes +=
        "🟩";

    }

  }
  else if(
    j <
    team.progress
  ){

    boxes +=
      "🟩";

  }
  else if(
    j ===
    team.progress
  ){

    boxes +=
      "🏃";

  }
  else{

    boxes +=
      "⬜";

  }

}

      html += `

        <p>

          ${team.name}

          ${boxes}

        </p>

        <button
          onclick="
            advanceTeam(
              ${i}
            )
          "
        >
          ➕
          ${team.name}
          rätt
        </button>

      `;

    }
  );
const finishedTeams =
  teams.filter(
    team =>
      team.finished
  );

if(
  finishedTeams.length
){

  html += `

    <h3>
      🏁 Slutruta nådd
    </h3>

  `;

  finishedTeams.forEach(
  team => {

    const i =
      teams.indexOf(
        team
      );

    html += `

      <p>

	  ${team.name}

${
  team.awarded
  ? "✅ Poäng utdelad"
  : `
      <button
        onclick="
          givePoint(
            ${i}
          )
        "
      >
        🏆 Ge poäng
      </button>
    `
}

      </p>

    `;

  }
);

}
  html += `

  <button
  onclick="
    endRound()
  "
>
  ▶ Avsluta omgång
</button>

<button
  onclick="
    chooseSong()
  "
>
  🎸 Välj nästa låt
</button>

    </div>

  `;

  screen.innerHTML =
    html;
}
function advanceTeam(
  teamIndex
){

  const song =
    songs[
      currentSong
    ];

  const team =
    teams[
      teamIndex
    ];

  if(
    team.progress <
    song.questions.length
  ){

    team.progress++;

    if(
      team.progress >=
      song.questions.length
    ){

      team.finished =
        true;

    }

  }

  renderRace();
}
function addTeam(){

  const name =
    prompt(
      "Lagnamn?"
    );

  if(!name){
    return;
  }

  teams.push({

  name:
    name.trim(),

  progress: 0,

  finished: false,

  score: 0,

  awarded: false,

  connected: false

});

  startGame();
}
function givePoint(
  teamIndex
){

  const team =
    teams[
      teamIndex
    ];

  if(
    team.awarded
  ){
    return;
  }

  team.score++;

  team.awarded =
    true;

  renderRace();
}
function endRound(){

  teams.forEach(
    team => {

      team.progress =
        0;

      team.finished =
        false;

      team.awarded =
        false;

    }
  );

  chooseSong();
}
function endRound(){

  teams.forEach(
    team => {

      team.progress =
        0;

      team.finished =
        false;

      team.awarded =
        false;

    }
  );

  chooseSong();
}
function saveSongSettings(
  songIndex
){

  const song =
    songs[songIndex];

  song.useFinalTask =
    document
      .getElementById(
        "useFinalTask"
      )
      .checked;

  song.finalTask =
    document
      .getElementById(
        "finalTask"
      )
      .value
      .trim();

  saveData();

  openSong(
    songIndex
  );
}
function resetPlayedSongs(){

  songs.forEach(
    song => {

      song.played =
        false;

    }
  );

  saveData();

  chooseSong();
}
function connectTeam(
  teamIndex
){

  teams[
    teamIndex
  ].connected =
    true;

  startGame();
}
function renderJoin(){

  screen.innerHTML = `

    <div class="card">

      <h2>
        🎸 Musikrace
      </h2>

      <p>
        Hitta på ett lagnamn
      </p>

      <input
        id="teamName"
        placeholder="
          Lagnamn
        "
      >

      <button
        onclick="
          joinGame()
        "
      >
        Anslut
      </button>

    </div>

  `;

}
function joinGame(){

  const input =
    document.getElementById(
      "teamName"
    );

  const name =
    input.value.trim();

  if(
    !name
  ){
    alert(
      "Ange ett lagnamn."
    );
    return;
  }

  screen.innerHTML = `

    <div class="card">

      <h2>
        ✔ Ansluten
      </h2>

      <p>

        Lag:

        <strong>
          ${name}
        </strong>

      </p>

      <p>
        Väntar på nästa låt...
      </p>

    </div>

  `;

}