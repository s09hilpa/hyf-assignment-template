import { teas } from "./teas.js";

function teasByOrigin(teas) {
  return teas.reduce((group, tea) => {
    if (!group[tea.origin]) {
      group[tea.origin] = [];
    }

    group[tea.origin].push(tea.name);

    return group;
  }, {});
}

console.log(teasByOrigin(teas));
