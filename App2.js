
console.log("app.js rad 2");
let songs =
  JSON.parse(
    localStorage.getItem(
      "musikrace_songs"
    )
  ) || [];
  let teams =
  JSON.parse(
    localStorage.getItem(
      "musikrace_teams"
    )
  ) || [];

let currentSong =
  null;

const screen =
  document.getElementById("screen");
  
  window.onload = function(){

  const params =
    new URLSearchParams(
      window.location.search
    );

  const song =
    params.get("song");

  if(
    song !== null
  ){

    joinGame(
      Number(song)
    );

  }
  else{

    openLibrary();

  }

};
  
  

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

  <span>
  🎵 ${song.title}
  ${song.artist ? " – " + song.artist : ""}
</span>

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

	
	<span
  onclick="
    event.stopPropagation();
    deleteSong(${i});
  "
  style="
    cursor:pointer;
    font-size:20px;
  "
>
  🗑️
</span>

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

function newSong(){

  const title =
    prompt(
      "Låtens namn?"
    );

  if(!title){
    return;
  }
  const artist =
  prompt(
    "Artist?"
  ) || "";

  songs.push({

  title,

  artist,

  questions: [],

  finalTask: "",
  finalTaskImage: "",

  played: false

});

saveData();

editSong(
  songs.length - 1
);

}
/*
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
				alert("openSong körs");
			
			  let html = `
			    <div class="card">
			
			      <h2>
			        🎵
			        ${song.title}
			      </h2>
				  <button
  onclick="
    addQuestion(
      ${quizIndex},
      ${songIndex}
    )
  "
>
  ➕ Lägg till fråga
</button>
			
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
*/
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
    window.currentPenalty < 5
  ){
    window.currentPenalty = 5;
  }

  document
    .getElementById(
      "penaltyValue"
    )
	.textContent =
  window.currentPenalty + " sek";
  songs[
  window.currentSongIndex
].questions[
  window.currentQuestionIndex
].penalty =
  window.currentPenalty;

saveData();
}
function addQuestion(
  songIndex
){

  songs[
    songIndex
  ].questions.push({

    question: "",

    answer: "",

    image: "",

    penalty: 10

  });

  saveData();

openQuestion2(
  songIndex,
  songs[songIndex].questions.length - 1
);

}
function openQuestion(

  songIndex,
  questionIndex
){
	console.log("openQuestion");

  const song =
    songs[songIndex];

  const q =
    song.questions[
      questionIndex
    ];

  let html = `

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
	  ${
  song.questions.length > 1
    ? `
      <div
        style="
          background:#f5f5f5;
          padding:10px;
          border-radius:8px;
          margin:15px 0;
          font-size:14px;
        "
      >
<b>🎵 Frågor i låten</b><br><br>

${
  renderQuestionList(
    song,
    songIndex,
    questionIndex
  )
}
      </div>
    `
    : ""
}

${renderQuestionEditor(
  song,
  q,
  songIndex,
  questionIndex
)}

    </div>

  `;

  window.currentPenalty =
    q.penalty || 10;
screen.innerHTML =
  html;
}

function openQuestion2(

  songIndex,
  questionIndex
){
	console.log("openQuestion2");

  const song =
    songs[songIndex];
	window.currentSongIndex =
  songIndex;
	window.currentQuestionIndex =
  questionIndex;
	

const q =
  song.questions[
    questionIndex
  ] || {
    penalty: 10
  };

  let html = `

    <div class="card">

      <h2>
        🎵 ${song.title}
      </h2>

	  
	  ${renderQuestionList(
  song,
  songIndex,
  questionIndex
)}
<button
  class="secondary"
  onclick="
    openLibrary()
  "
>
  ⬅ Till låtarkivet
</button>
    </div>

  `;

  window.currentPenalty =
    q.penalty || 10;

  screen.innerHTML =
    html;

}

function goToQuestion(
  songIndex,
  questionIndex
){

  saveQuestionData(
    songIndex,
    window.currentQuestionIndex
  );

  openQuestion2(
    songIndex,
    questionIndex
  );

}

function openFinalTask2(
  songIndex
){

  const song =
    songs[songIndex];

  let html = `

    <div class="card">

      <h2>
        🎵 ${song.title}
      </h2>

      ${renderQuestionList(
        song,
        songIndex,
        -1
      )}

      ${renderFinalTaskEditor(
        song,
        songIndex
      )}
	  <button
  class="secondary"
  onclick="
    openLibrary()
  "
>
  ⬅ Till låtarkivet
</button>

    </div>

  `;

  screen.innerHTML =
    html;
	const imageInput =
  document.getElementById(
    "finalTaskImageFile"
  );

imageInput.onchange =
  function(){

    const file =
      this.files[0];

    if(!file){
      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      function(e){

        songs[songIndex]
          .finalTaskImage =
          e.target.result;

        saveData();

        openFinalTask2(
          songIndex
        );

      };

    reader.readAsDataURL(
      file
    );

  };

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

		openQuestion2(
  songIndex,
  questionIndex
);

      };

    reader.readAsDataURL(
      file
    );

  }
  else{

    saveData();

	openQuestion2(
  songIndex,
  questionIndex
);

  }
}

function saveQuestionData(
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

     

      };

    reader.readAsDataURL(
      file
    );

  }
  else{

    saveData();


  }
}
function saveData(){

  localStorage.setItem(
    "musikrace_songs",
    JSON.stringify(
      songs
    )
  );

  localStorage.setItem(
    "musikrace_teams",
    JSON.stringify(
      teams
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

function deleteQuestion(
  songIndex,
  questionIndex
){

  if(
    !confirm(
      "Ta bort frågan?"
    )
  ){
    return;
  }

  songs[
    songIndex
  ].questions.splice(
    questionIndex,
    1
  );

  saveData();

  openSong(
    songIndex
  );
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

<div
  style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
  "
>

  <h2
    style="
      margin:0;
    "
  >
    📚 Mina låtar (${songs.length})
  </h2>

<button
  class="smallButton"
  onclick="newSong()"
>
  ➕ Ny låt
</button>

</div>

	  

    </div>

  `;

  songs.forEach(
    (song, i) => {

      html += `

        <div
  class="songRow"
  onclick="
    songMenu(${i})
  "
>

<span>
  🎵 ${song.title}
${song.artist ? " – " + song.artist : ""}
</span>


		  

		  



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
	  

      <button
        onclick="
          addTeam()
        "
      >
        ➕ Lägg till lag
      </button>
	  <hr>
	  <h3>
  Poängställning
</h3>


  `;

  [...teams]
  .sort(
    (a, b) =>
      b.score - a.score
  )
  .forEach(
    team => {

    html += `

      <div class="songRow">

  ⭐ ${team.name} (${team.score})

  <button
    onclick="
      addPoint(
        '${team.name}'
      )
    "
  >
    ➕1
  </button>
  <button
  onclick="
    removePoint(
      '${team.name}'
    )
  "
>
  ➖1
</button>
<button
  onclick="
    deleteTeam(
      '${team.name}'
    )
  "
>
  🗑
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


function openSong (
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
	  
	  <button
  class="secondary"
  onclick="
    previewSong(
      ${songIndex}
    )
  "
>
  👁️ Förhandsgranska
</button>

<button
  onclick="
    editSong(
      ${songIndex}
    )
  "
>
  ✏️ Redigera
</button>

	  <button
  onclick="
    addQuestion(
      ${songIndex}
    )
  "
>
  ➕ Lägg till fråga
</button>



	  <label>

	  



  `;

  song.questions.forEach(
    (q, i) => {


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

          
          ${q.image ? "🖼️" : ""}
          Fråga ${i + 1}

        </div>

      `;

    }
  );
  html += `

  <h3
    style="
      background:orange;
      padding:12px;
      border-radius:12px;
      text-align:center;
    "
  >
    🏁 FÖR ATT VINNA LÅTEN
  </h3>

  <textarea
    id="finalTask"
	
    rows="6"
    style="
      width:100%;
      margin-top:15px;
    "
  >${
    song.finalTask || ""
  }</textarea>
  
  <label>
  Bild
</label>

<input
  id="finalTaskImageFile"
  type="file"
  accept="image/*"
>
${
  song.finalTaskImage
    ? `
      <img
        src="${song.finalTaskImage}"
        style="
          width:200px;
          margin-top:15px;
          border-radius:12px;
        "
      >
    `
    : ""
}

  <button
    class="danger"
    onclick="
      deleteSong(
        ${songIndex}
      )
    "
  >
    🗑️ Ta bort låten
  </button>

  <button
  class="secondary"
  onclick="
    saveFinalTask(
      ${songIndex}
    )
  "
>
  ⬅ Tillbaka
</button>

</div>

`;

  screen.innerHTML =
    html;
}

function editSong(
  songIndex
){

  openQuestion2(
    songIndex,
    0
  );

}


/*

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
*/

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
/*
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
*/
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
function addPoint(
  teamName
){

  const team =
    teams.find(
      t =>
        t.name ===
        teamName
    );

  if(team){

    team.score++;

saveData();

    startGame();

  }

}
function removePoint(
  teamName
){

  const team =
    teams.find(
      t =>
        t.name ===
        teamName
    );

  if(
    team &&
    team.score > 0
  ){

    team.score--;

saveData();

    startGame();

  }

}
function deleteTeam(
  teamName
){

  if(
    !confirm(
      `Ta bort ${teamName}?`
    )
  ){
    return;
  }

  teams =
    teams.filter(
      team =>
        team.name !==
        teamName
    );

  saveData();

  startGame();

}
function saveFinalTask(
  songIndex
){

  songs[
    songIndex
  ].finalTask =
    document
      .getElementById(
        "finalTaskText"
      )
      .value
      .trim();
	  
	  const file =
  document
    .getElementById(
      "finalTaskImageFile"
    )
    .files[0];

	if(file){

  const reader =
    new FileReader();

  reader.onload =
    function(e){

      songs[
        songIndex
      ].finalTaskImage =
        e.target.result;

      saveData();

      openLibrary();

    };

  reader.readAsDataURL(
    file
  );

}
else{

  saveData();

  openLibrary();

}
}

  /*
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
async function testSupabase(){

  const response =
    await fetch(
      "https://coxfhjiycetfgxjoqvci.supabase.co/rest/v1/teams",
      {
        headers: {
          apikey:
            SUPABASE_KEY
        }
      }
    );

  alert(
    response.status
  );

}
*/

function renderQuestionCard(
  songIndex,
  question,
  questionIndex
){

  return `

    <div
      class="questionCard"
	  onclick="
  openQuestion2(
    ${songIndex},
    ${questionIndex}
  )
"
    >

      <div style="flex:1;">

        <b>🎵 Fråga ${questionIndex + 1}</b>

        <br><br>

        ${question.question}

        <br><br>

        <i>Svar: ${question.answer}</i>

      </div>

      ${
        question.image
          ? `
            <img
              src="${question.image}"
              style="
                width:70px;
                border-radius:8px;
              "
            >
          `
          : ""
      }

    </div>

  `;

}

function renderFinalTaskCard(
  songIndex,
  song
){

  return `

    <div
      class="questionCard"
      onclick="
        openFinalTask2(
          ${songIndex}
        )
      "
    >

      <div style="flex:1;">

        <b>
          🏁 Slutuppdrag
        </b>

        <br><br>

        ${
          song.finalTask
            ? song.finalTask
            : "<i>Inget slutuppdrag ännu.</i>"
        }

      </div>

      ${
        song.finalTaskImage
          ? `
            <img
              src="${song.finalTaskImage}"
              style="
                width:70px;
                border-radius:8px;
              "
            >
          `
          : ""
      }

    </div>

  `;

}
function renderQuestionEditor(
  song,
  q,
  songIndex,
  questionIndex
){

  return `

      <label>
        Frågetext
      </label>

	  <input
  id="questionText"
  value="${q.question}"
  oninput="
    saveQuestionData(
      ${songIndex},
      ${questionIndex}
    )
  "
>

      <label>
        Rätt svar
      </label>

	  <input
  id="answerText"
  value="${q.answer}"
  oninput="
    saveQuestionData(
      ${songIndex},
      ${questionIndex}
    )
  "
>

      <label>
        Bild
      </label>

	  <input
  id="imageFile"
  type="file"
  accept="image/*"
  onchange="
    saveQuestion(
      ${songIndex},
      ${questionIndex}
    )
  "
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

	  <label
  style="
    font-size:18px;
    font-weight:bold;
  "
>
  ⏱️ Strafftid vid felsvar
</label>

<div
  style="
    display:flex;
    gap:8px;
    justify-content:flex-start;
    align-items:center;
    margin-bottom:8px;
  "
>

<button
  type="button"
  class="smallButton"
  onclick="changePenalty(-5)"
>
  −
</button>

		<span
  id="penaltyValue"
  style="
    font-size:20px;
    min-width:65px;
    text-align:center;
    font-weight:bold;
  "
>
  ${q.penalty || 10} sek
</span>

<button
  type="button"
  class="smallButton"
  onclick="changePenalty(5)"
>
  +
</button>

      </div>


	  <button
  class="danger deleteButton"
  style="
    font-size:13px;
    padding:6px 12px;
    margin-top:10px;
  "
  onclick="
    deleteQuestion(
      ${songIndex},
      ${questionIndex}
    )
  "
>
  🗑️ Ta bort fråga
</button>

	  

  `;

}
function renderFinalTaskEditor(
  song,
  songIndex
){

  return `

    <div
      style="
        background:#fff8dc;
        border-left:8px solid #f0c040;
        border-radius:10px;
        padding:20px;
        margin:20px 0;
      "
    >

      <h3>
        🏁 Redigerar slutuppdrag
      </h3>

      <label>
        Slutuppdrag
      </label>

	  <textarea
  id="finalTaskText"
  rows="6"
  oninput="
    songs[${songIndex}].finalTask =
      this.value;
    saveData();
  "
>${song.finalTask || ""}</textarea>
	  
	  <label>
  Bild
</label>

<input
  id="finalTaskImageFile"
  type="file"
  accept="image/*"
>

<div id="finalTaskPreview">

  ${
    song.finalTaskImage
      ? `
        <img
          src="${song.finalTaskImage}"
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
${
  song.finalTaskImage
    ? `
      <button
        class="danger"
        onclick="
          removeFinalTaskImage(
            ${songIndex}
          )
        "
      >
        🗑️ Ta bort bild
      </button>
    `
    : ""
}
	  

    </div>

  `;

}

function removeFinalTaskImage(
  songIndex
){

  songs[
    songIndex
  ].finalTaskImage = "";

  saveData();

  openFinalTask2(
    songIndex
  );

}
function renderQuestionList(
  song,
  songIndex,
  questionIndex
){

  let html = "";

  song.questions.forEach((question, i)=>{

	  if(i === questionIndex){

      html += `

        <div
          style="
		  background:#fff8dc;
border-left:8px solid #f0c040;
border-radius:10px;
padding:20px;
margin:20px 0;
box-shadow:0 2px 8px rgba(0,0,0,.15);
          "
        >

          <h3>
            ✏️ Redigerar fråga ${i + 1}
          </h3>

          ${renderQuestionEditor(
            song,
            question,
            songIndex,
            i
          )}

        </div>

      `;

    }
    else{

      html += renderQuestionCard(
        songIndex,
        question,
        i
      );

    }

  });
  
html += `
  <button
    onclick="
      addQuestion(
        ${songIndex}
      )
    "
  >
    ➕ Lägg till fråga
  </button>
`;
  
  if (questionIndex !== -1) {

  html += renderFinalTaskCard(
    songIndex,
    song
  );

}

  return html;

}

function previewSong(
  songIndex
){

  alert(
    "Förhandsgranskning kommer snart!"
  );

}

function songMenu(
  songIndex
){

  const song =
    songs[songIndex];

  let html = `

    <div class="card">

      <h2>
        🎵 ${song.title}
      </h2>

	  <button
onclick="
  startSong(
    ${songIndex}
  )
"
>
  ▶️ Starta låt
</button>

<button
  class="secondary"
  onclick="
    previewFinalTask(
      ${songIndex}
    )
  "
>
  🏁 Slutuppdrag
</button>

      <button
        class="secondary"
        onclick="
          openLibrary()
        "
      >
        ⬅️ Låtbibliotek
      </button>

      <button
        class="secondary"
        onclick="
          editSong(
            ${songIndex}
          )
        "
      >
        ✏️ Redigera
      </button>
      <button
        class="danger"
        onclick="
          deleteSong(
            ${songIndex}
          )
        "
      >
        🗑️ Ta bort låt
      </button>

    </div>

  `;

  screen.innerHTML =
    html;

}

function startSong(
  songIndex
){

  const song =
    songs[songIndex];

  screen.innerHTML = `

    <div class="card">

      <h2>
        🎵 ${song.title}
      </h2>

	  <h3>
  Anslut deltagare
</h3>

	  <p
  style="
    text-align:center;
    font-size:18px;
    margin:20px 0;
  "
>
  Låt deltagarna skanna QR-koden
  för att ansluta.
</p>

<canvas
  id="hostQRCode"
  width="220"
  height="220"
  style="
    display:block;
    margin:30px auto;
  "
></canvas>
<p
  style="
    text-align:center;
    font-size:18px;
    margin-top:20px;
    color:#666;
  "
>
  0 deltagare anslutna
</p>

<button
  onclick="
    beginGame(
      ${songIndex}
    )
  "
>
  ▶️ Börja
</button>

<button
  class="secondary"
  onclick="
    songMenu(
      ${songIndex}
    )
  "
>
  ❌ Avbryt
</button>

    </div>

  `;
const url =
  window.location.origin +
  window.location.pathname +
  "?song=" + songIndex;

QRCode.toCanvas(
  document.getElementById("hostQRCode"),
  url
);
}

function showFinalTask(
  songIndex
){

  const song =
    songs[songIndex];

  let html = `

    <div class="card">

	

<div
  style="
    text-align:center;
    margin-top:20px;
  "
>

  <div
    style="
      font-size:60px;
    "
  >
    🏁
  </div>

<h2
  style="
    font-size:38px;
    margin:10px 0 8px 0;
  "
>
  Slutuppdrag
</h2>

<div
  style="
    font-size:24px;
    font-style:italic;
    color:#666;
    margin-bottom:30px;
  "
>
  För att vinna matchen...
</div>



      <div
        style="
         background:#fff9e8;
          padding:20px;
          border-radius:12px;
          font-size:22px;
          text-align:center;
        "
      >
        ${song.finalTask || "Inget slutuppdrag finns."}
      </div>
	  
	  ${
  song.finalTaskImage
    ? `
      <img
        src="${song.finalTaskImage}"
        style="
          width:100%;
          max-width:400px;
          margin-top:20px;
          border-radius:12px;
        "
      >
    `
    : ""
}



    </div>

  `;

  screen.innerHTML =
    html;

}

function previewFinalTask(
  songIndex
){

  showFinalTask(
    songIndex
  );

  document
    .querySelector(".card")
    .innerHTML += `
      <button
        class="secondary"
        onclick="
          songMenu(${songIndex})
        "
        style="
          margin-top:20px;
        "
      >
        ⬅ Tillbaka
      </button>
    `;

}

function beginGame(
  songIndex
){

  const song =
    songs[songIndex];

  screen.innerHTML = `

    <div class="card">

      <h2>
        Fråga 1
      </h2>

      <p
        style="
          font-size:24px;
          text-align:center;
          margin:40px 0;
        "
      >
        ${song.questions[0].question}
      </p>

      <button
        class="secondary"
        onclick="
          startSong(
            ${songIndex}
          )
        "
      >
        ⬅️ Tillbaka
      </button>

    </div>

  `;

}

function joinGame(
  songIndex
){

 

  screen.innerHTML = `

    <div class="card">

      <h2>
        ✅ Du är ansluten
      </h2>

      <p
        style="
          text-align:center;
          font-size:18px;
          margin:25px 0;
        "
      >
        Är ni flera i laget?
      </p>

      <p
        style="
          text-align:center;
          color:#666;
        "
      >
        Låt en lagkamrat skanna
        QR-koden nedan så kan ni
        spela tillsammans.
      </p>

<canvas
  id="qrcode"
  width="220"
  height="220"
  style="
    display:block;
    margin:30px auto;
  "
></canvas>

	  <button
  onclick="
    showQuestion(
      ${songIndex},
      0
    )
  "
>
  🎵 Börja spela
</button>
    </div>

  `;
const url =
  window.location.origin +
  window.location.pathname +
  "?song=" + songIndex;

QRCode.toCanvas(
  document.getElementById("qrcode"),
  url
);
}

function showQuestion(
  songIndex,
  questionIndex
){
alert("showQuestion körs");
  const question =
    songs[songIndex]
      .questions[questionIndex];

  screen.innerHTML = `

<div
  class="card"
  id="questionCard"
>
<div id="questionContent">

      <p
        style="
          font-size:30px;
          text-align:center;
          margin:40px 0;
          font-weight:bold;
        "
      >
        ${question.question}
      </p>
	  ${question.image ? `
  <div
    style="
      text-align:center;
      margin:25px 0;
    "
  >
    <img
      src="${question.image}"
      style="
        max-width:100%;
        max-height:220px;
        border-radius:12px;
      "
    >
  </div>
` : ""}
	  <input
  id="answer"
  type="text"
  placeholder="Skriv ditt svar..."
  onkeydown="
  if(event.key==='Enter'){
    checkAnswer(
      ${songIndex},
      ${questionIndex}
    );
  }
"
  style="
    width:100%;
    padding:14px;
    font-size:20px;
    margin-top:20px;
    box-sizing:border-box;
  "
>
<div
  id="message"
  style="
    text-align:center;
    color:#c00;
    font-weight:bold;
    min-height:30px;
    margin-top:15px;
  "
></div>

<button
id="answerButton"
  style="
    margin-top:20px;
  "
  onclick="
    checkAnswer(
      ${songIndex},
      ${questionIndex}
    )
  "
>
  Svara
</button>


    </div>
	<div
  id="penaltyScreen"
  style="
    display:none;
    height:320px;
  "
></div>
<div
  id="successScreen"
  style="
    display:none;
    height:320px;
  "
></div>
	</div>

  `;
  document
  .getElementById(
    "answer"
  )
  .focus();

}

function checkAnswer(
  songIndex,
  questionIndex
){

  const answer =
    document
      .getElementById("answer")
      .value
      .trim()
      .toLowerCase();

  const correctAnswer =
    songs[songIndex]
      .questions[questionIndex]
      .answer
      .trim()
      .toLowerCase();

if(
  answer ==
  correctAnswer
){

  document
    .getElementById(
      "questionContent"
    )
    .style.display =
    "none";

  document
    .getElementById(
      "successScreen"
    )
    .style.display =
    "block";

  document
    .getElementById(
      "questionCard"
    )
    .style.background =
    "#dff7df";

  document
    .getElementById(
      "successScreen"
    )
    .innerHTML =
`
<div
  style="
    display:flex;
    justify-content:center;
    align-items:center;
    height:320px;
  "
>
  <svg
    width="180"
    height="180"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#28a745"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M20 6L9 17l-5-5"/>
  </svg>
</div>
`;

  if(
    navigator.vibrate
  ){
    navigator.vibrate(80);
  }

  setTimeout(
    function(){

      if(
        questionIndex <
        songs[songIndex].questions.length - 1
      ){

        showQuestion(
          songIndex,
          questionIndex + 1
        );

      }
      else{

        showFinalTask(
          songIndex
        );

      }

    },
    2000
  );

}
else{

  flashRed();

  document
    .getElementById(
      "questionContent"
    )
    .style.display =
    "none";

let seconds =
  songs[songIndex]
    .questions[questionIndex]
    .penalty || 10;
  
  const countdown =
  setInterval(
    function(){seconds--;
		if(
  seconds < 0
){

  clearInterval(
    countdown
  );
document
  .getElementById(
    "penaltyScreen"
  )
  .style.display =
  "none";
  
  document
  .getElementById(
    "questionCard"
  )
  .style.background =
  "";

document
  .getElementById(
    "questionContent"
  )
  .style.display =
  "block";
  
  document
  .getElementById(
    "answer"
  )
  .value = "";
  document
  .getElementById(
    "answer"
  )
  .disabled = false;
setTimeout(
  function(){

    document
      .getElementById(
        "answer"
      )
      .focus();

  },
  50
);
  
  document
  .getElementById(
    "answerButton"
  )
  .style.opacity =
  "1";
  return;

}
		document
  .getElementById(
    "countdown"
  )
  .textContent =
  seconds;

    },
    1000
  );

  document
    .getElementById(
      "penaltyScreen"
    )
    .style.display =
    "block";

  document
    .getElementById(
      "penaltyScreen"
    )
    .innerHTML =
    `
      <div
        style="
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          height:320px;
        "
      >

        <div
          style="
            font-size:24px;
            margin-bottom:20px;
          "
        >
          Nytt försök om...
        </div>

        <div style="font-size:60px;">
          ⏳
        </div>

        <div
          id="countdown"
          style="
            font-size:110px;
            font-weight:bold;
          "
        >
          ${seconds}
        </div>

      </div>
    `;

  document
    .getElementById(
      "answerButton"
    )
    .style.opacity = "0.4";

  document
    .getElementById(
      "answer"
    )
    .disabled = true;

}

}

function flashGreen(){

	document
  .getElementById(
    "questionCard"
  )
  .style.background =
  "#dff7df";
  
  document
  .getElementById(
    "questionCard"
  )
  .style.transform =
  "translateY(-20px)";

  setTimeout(
    function(){

		document
  .getElementById(
    "questionCard"
  )
  .style.background =
  "";

    },
    2000
  );

}

function flashRed(){

  document
    .getElementById(
      "questionCard"
    )
    .style.background =
    "#ffe3e3";

	

}