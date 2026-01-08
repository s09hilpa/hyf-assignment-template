const houses = [
  { name: "Gryffindor", color: "red" },
  { name: "Hufflepuff", color: "Yellow" },
  { name: "Ravenclaw", color: "blue" },
  { name: "Slytherin", color: "green" },
];

const nameInput = document.getElementById("nameInput");
function getRandomHouse() {
  const randomIndex = Math.floor(Math.random() * houses.length);
  return houses[randomIndex];
}
const result = document.getElementById("result");

const generateBtn = document.getElementById("generateBtn");
generateBtn.addEventListener("click", () => {
  const name = nameInput.value;

  if (name === "") {
    result.textContent = "Please enter your name";
    return;
  }
  const house = getRandomHouse();
  result.textContent = `${name} belongs in ${house.name}!`;
  result.style.color = house.color;
});
const tryAgainBtn = document.getElementById("tryAgainBtn");
tryAgainBtn.addEventListener("click", () => {
  const name = nameInput.value;

  if (name === "") {
    result.textContent = "Please enter your name ";
    return;
  }

  const house = getRandomHouse();
  result.textContent = `${name} belongs in ${house.name}!`;
  result.style.color = house.color;
});
