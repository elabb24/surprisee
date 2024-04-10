//Initial References

//Display start screen first
window.onload = () => {
  coverScreen.classList.remove("hide");
  container.classList.add("hide");
  buka.classList.add("hide");
};

function changeContent(page) {
  var contentDiv = document.getElementById("content");
  var testingDiv = document.getElementById("testing");
  var mulaiDiv = document.getElementById("mulai");

  switch (page) {
    case "puzzle":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
        <div class="cover-screen">
            <p id="result"></p>
            <p id="buka"></p>
            <button id="start-button">Start Game</button>
            <button id="buka-button"></button>
        </div>
        <div id="moves"></div>
    <div class="slider-game">
      <div class="container"></div>
      <div class="original-image">
        <a>hehe selesain ya!! jujur aku 3x nyoba baru berhasil AHAHAHHA</a>
      </div>
    </div>`;
      setTimeout(function () {
        startButton.addEventListener("click", function () {
          container.classList.remove("hide");
          coverScreen.classList.add("hide");
          buka.classList.add("hide");
          container.innerHTML = "";
          imagesArr = [];
          randomImages();
          gridGenerator();
          movesCount = 0;
          moves.innerText = `Moves: ${movesCount}`;
        });
      }, 0);
      const startButton = document.getElementById("start-button");
      const moves = document.getElementById("moves");
      const container = document.querySelector(".container");
      const coverScreen = document.querySelector(".cover-screen");
      const result = document.getElementById("result");
      const buka = document.getElementById("buka");
      const bukaButton = document.getElementById("buka-button");
      let currentElement = "";
      let movesCount,
        imagesArr = [];
      const isTouchDevice = () => {
        try {
          //We try to create TouchEvent (it would fail for desktops ad throw error)
          document.createEvent("TouchEvent");
          return true;
        } catch (e) {
          return false;
        }
      };
      //Random number for image
      const randomNumber = () => Math.floor(Math.random() * 8) + 1;

      //Get row and column value from data-position
      const getCoords = (element) => {
        const [row, col] = element.getAttribute("data-position").split("_");
        return [parseInt(row), parseInt(col)];
      };

      //row1, col1 are image co-ordinates while row2 amd col2 are blank image co-ordinates
      const checkAdjacent = (row1, row2, col1, col2) => {
        if (row1 == row2) {
          //left/right
          if (col2 == col1 - 1 || col2 == col1 + 1) {
            return true;
          }
        } else if (col1 == col2) {
          //up/down
          if (row2 == row1 - 1 || row2 == row1 + 1) {
            return true;
          }
        }
        return false;
      };

      //Fill array with random value for images
      const randomImages = () => {
        while (imagesArr.length < 8) {
          let randomVal = randomNumber();
          if (!imagesArr.includes(randomVal)) {
            imagesArr.push(randomVal);
          }
        }
        imagesArr.push(9);
      };

      //Click the image
      const selectImage = (e) => {
        e.preventDefault();
        //Set currentElement
        currentElement = e.target;
        //target(blank image)
        let targetElement = document.querySelector(".target");
        let currentParent = currentElement.parentElement;
        let targetParent = targetElement.parentElement;

        //get row and col values for both elements
        const [row1, col1] = getCoords(currentParent);
        const [row2, col2] = getCoords(targetParent);

        if (checkAdjacent(row1, row2, col1, col2)) {
          //Swap
          currentElement.remove();
          targetElement.remove();
          //Get image index(to be used later for manipulating array)
          let currentIndex = parseInt(
            currentElement.getAttribute("data-index")
          );
          let targetIndex = parseInt(targetElement.getAttribute("data-index"));
          //Swap Index
          let tempIndex = currentElement.getAttribute("data-index");
          currentElement.setAttribute(
            "data-index",
            targetElement.getAttribute("data-index")
          );
          targetElement.setAttribute("data-index", tempIndex);
          //Swap Images
          currentParent.appendChild(targetElement);
          targetParent.appendChild(currentElement);
          //Get the positions of the current and target elements in the grid
          let currentPos = getCoords(currentParent);
          let targetPos = getCoords(targetParent);

          //Calculate the indices of the current and target elements in the imagesArr array
          let currentArrIndex = currentPos[0] * 3 + currentPos[1];
          let targetArrIndex = targetPos[0] * 3 + targetPos[1];
          //Array swaps
          [imagesArr[currentArrIndex], imagesArr[targetArrIndex]] = [
            imagesArr[targetArrIndex],
            imagesArr[currentArrIndex],
          ];

          //Win condition
          if (imagesArr.every((value, i) => value === i + 1)) {
            setTimeout(() => {
              //When games ends display the cover screen again
              container.classList.add("hide");
              coverScreen.classList.remove("hide");
              result.innerText = `YIPIII Happy Birthday BEE!!!`;
              buka.classList.remove("hide");
              startButton.classList.add("hide");
              bukaButton.innerText = "Click ME!";
              bukaButton.addEventListener("click", function () {
                window.open(
                  "https://drive.google.com/file/d/1aytLR9yh469u7hJJytrJPRhASVDRTo6l/view?usp=drivesdk"
                );
              });
            }, 1000);
          }
          //Increment a display move
          movesCount += 1;
          moves.innerText = `Moves: ${movesCount}`;
          if (movesCount === 50) {
            const originalDiv = document.querySelector(".original-image");
            const newDiv = document.createElement("div");
            newDiv.style.clear = "both";
            newDiv.innerHTML = "<p>Susah yaa? hehehe</p>";
            originalDiv.appendChild(newDiv);
          }

          if (movesCount === 70) {
            const originalDiv = document.querySelector(".original-image");
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `
              <p>Btw ini bisa aja gabisa diselesain WKWKWK karna algoritmanya kurang baguss jadi aku munculin tombol ulang ya</p>
              <br>
              <button id="shuffle-button">Ulang</button>
            `;
            originalDiv.appendChild(newDiv);

            document
              .getElementById("shuffle-button")
              .addEventListener("click", function () {
                changeContent("puzzle");
              });
          }
        }
      };

      //Generate Grid
      const gridGenerator = () => {
        let count = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let div = document.createElement("div");
            div.setAttribute("data-position", `${i}_${j}`);
            div.addEventListener("click", selectImage);
            div.classList.add("image-container");
            div.innerHTML = `<img src="image_part_00${
              imagesArr[count]
            }.jpg" class="image ${
              imagesArr[count] == 9 ? "target" : ""
            }" data-index="${count + 1}"/>`;
            count += 1;
            container.appendChild(div);
          }
        }
      };
      break;
    case "pertanyaan":
      testingDiv.style.display = "none";
      mulaiDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
        <div class="pertanyaan">
            <a>Kita cek dulu yaa</a>
            <br>
            <a>Emangnya siapa yang ultah tanggal 11 April?</a>
            <br>
            <input id="name-input" type="text" placeholder="Enter name here">
            <button id="name-button">Submit</button>
        </div>
      </div>
      </div>`;
      document
        .getElementById("name-button")
        .addEventListener("click", function () {
          var nameInput = document.getElementById("name-input").value;
          if (nameInput.toLowerCase() === "fina apriani putri") {
            changeContent("pertanyaan2");
          } else if (nameInput.toLowerCase() === "fina") {
            alert("fina siapa?");
            location.reload();
          } else if (nameInput.toLowerCase() === "fina apriani") {
            alert("ayo dikit lagi bener!");
            location.reload();
          } else {
            alert("tetot >:");
            location.reload();
          }
        });
      break;
    case "pertanyaan2":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
        <div class="pertanyaan">
            <a>Hmm masih belum yakin, pas kapan kita pertama kali ngobrol yang abis itu aku mulai ngechat? xixi</a>
            <br>
            <input id="tempat-input" type="text" placeholder="event!">
            <button id="tempat-button">Submit</button>
            </div>
      </div>
      
        `;
      document
        .getElementById("tempat-button")
        .addEventListener("click", function () {
          var tempatInput = document.getElementById("tempat-input").value;
          if (tempatInput.toLowerCase() === "inaugurasi") {
            changeContent("pertanyaan3");
          } else {
            alert("tetot >:");
            location.reload();
          }
        });
      break;
    case "pertanyaan3":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
            <div class="pertanyaan">
                <a>Hehe abis ngobrol itu seorang iqbal mencoba mendekati cewek lagi ahahha, OKE NEXT</a>
                <br>
                <a>Penyakit apa yang pertama kali aku curhat ke kamuu?</a>
                <input id="penyakit-input" type="text" placeholder="">
                <button id="penyakit-button">Submit</button>
                </div>
      </div>
            `;
      document
        .getElementById("penyakit-button")
        .addEventListener("click", function () {
          var penyakitInput = document.getElementById("penyakit-input").value;
          if (penyakitInput.toLowerCase() === "diare") {
            changeContent("pertanyaan4");
          } else {
            alert("tetot >:");
            location.reload();
          }
        });
      break;
    case "pertanyaan4":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
        <div id="border">
            <div class="pertanyaan">
                <a>AHAHAHA BENER, padahal waktu itu udah gaada bahasan lagii tapi aku masih pengen ngechat aja jadi aku curhat deh hihi. LANJUT!</a>
                <br>
                <h2>This or That!</h3>
                <br>
                <h3>Siapa yang lebih setrong?</h3>
                <img src="i1.jpg" alt="Image 1" onclick="changeContent('pertanyaan5')" style="max-width: 240px; max-height:500px;">
                <img src="f1.png" alt="Image 2" onclick="changeContent('salah1')" style="max-width: 240px; max-height:500px;">
            </div>
        </div>
      </div>`;
      break;
    case "salah1":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
              <div class="pertanyaan">
                  <h2>Woooo enak aja, salah!</h2>
                  <button onclick="changeContent('pertanyaan4')">Coba Lagi</button>
            </div>
            </div>
      </div>`;
      break;
    case "pertanyaan5":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
              <div class="pertanyaan">
              <a>WKWKWKK good, next!</a>
              <br>
                  <a>Siapa yang lebih manja?</a>
                  <img src="f2.jpg" alt="Image 1" onclick="changeContent('pertanyaan6')" style="max-width: 240px; max-height:500px;">
                  <img src="i2.jpg" alt="Image 2" onclick="changeContent('salah2')"  style="max-width: 240px; max-height:500px;">
              </div>
              </div>
      </div>`;
      break;
    case "salah2":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
                <div class="pertanyaan">
                    <h2>Karna aku yang buat jadi salah ya HEHEHE suka suka aku!</h2>
                    <button onclick="changeContent('pertanyaan5')">Coba Lagi</button>
              </div>
              </div>
      </div>`;
      break;
    case "pertanyaan6":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
                <div class="pertanyaan">
                <a>hehehe luv you, sesi terakhir nihh tebak tempat</a>
                <br>
                    <a>Dimanakah inii?</a>
                    <br>
                    <img src="tempat1.jpg" style="max-width: 240px; max-height:500px;">
                    <br>
                    <input id="tempat1-input" type="text" placeholder="tempat">
                    <button id="tempat1-button">Submit</button>
                </div>
                </div>
      </div>`;
      document
        .getElementById("tempat1-button")
        .addEventListener("click", function () {
          var tempat1Input = document.getElementById("tempat1-input").value;
          if (tempat1Input.toLowerCase() === "mie ayam mba santi") {
            changeContent("pertanyaan7");
          } else {
            alert("tetot >: pst, clue ada di drive!");
            location.reload();
          }
        });
      break;
    case "pertanyaan7":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
                <div class="pertanyaan">
                    <a>GOOD JOB! next!!</a>
                    <br>
                    <a>Ada kejadian apa sebelum sampe kesinii?</a>
                    <br>
                    <img src="tempat2.jpg" style="max-width: 240px; max-height:500px;">
                    <br>
                    <input id="kejadian-input" type="text" placeholder="kejadian">
                    <button id="kejadian-button">Submit</button>
                </div>
                </div>
      </div>`;
      document
        .getElementById("kejadian-button")
        .addEventListener("click", function () {
          var kejadianInput = document.getElementById("kejadian-input").value;
          if (kejadianInput.toLowerCase() === "nyasar") {
            changeContent("puzle");
          } else {
            alert("tetot >:");
            location.reload();
          }
        });
      break;
    case "puzle":
      testingDiv.style.display = "none";
      contentDiv.innerHTML = `
      <div id="mulai">
      <div id="border">
                <div class="pertanyaan">
                  <video width="320" height="240" controls>
                    <source src="video.mp4" type="video/mp4">
                    </video>
                    <br>
                    <a>NYASAR GARA-GARA GATAU TEMPAT AHAHAHA. OKEEE UDAH YA MAIN PERTANYAAN-PERTANYAANNYA, SEKARANG KITA MAIN YANG LEBIH SUSAH!</a>
                    <br>
                    <button id="puzzle-button">Kita main puzzle!</button>
                </div>
                </div>
      </div>`;
      document
        .getElementById("puzzle-button")
        .addEventListener("click", function () {
          changeContent("puzzle");
        });
      break;
  }
}
