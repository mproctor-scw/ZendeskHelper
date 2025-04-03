var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '400px' });

async function displayUserName() {
    try {
      const response = await client.get("currentUser.name");
      document.getElementById("name").innerText = response["currentUser.name"];
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  }

async function getMissionId(description) {
  let match = description.match(/"courseMissionId"\s*:\s*"([^"|]+)\|([^"]+)"/);

  if (match) {
    const missionId = match[1];
    const missionLanguage = match[2]
    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `Mission: ${missionId}`;
    nameSpan.classList.add("ellipsis")
    
    const languageSpan = document.createElement('span');
    languageSpan.textContent = `Language: ${missionLanguage}`;

    const link = document.createElement('a');
    link.textContent = "Play lab in explore";
    link.classList.add('btn');
    link.href = `https://internal.dev.nonprod.securecodewarrior.com/mission/${missionId}/${missionLanguage}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(languageSpan);
    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function getCodingLabId(description) {
  match = description.match(/"challengeId"\s*:\s*"([^"]+)"/);

  if (match) {
    const codingLabId = match[1];
    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `Coding Lab: ${codingLabId}`;

    const link = document.createElement('a');
    link.textContent = "Play lab in explore";
    link.classList.add('btn');
    link.href = `https://portal.securecodewarrior.com/#/explore/coding-lab/${codingLabId}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function getChallengeId(description) {
  match = description.match(/"revisionId"\s*:\s*"([a-f0-9]{24})"/);

  if (match) {
    console.log(match[1])
    const challengeId = match[1];
    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `Challenge: ${challengeId}`;

    const link = document.createElement('a');
    link.textContent = "View challenge in CMS";
    link.classList.add('btn');
    link.href = `https://cms.securecodewarrior.com/search?q=${challengeId}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function renderError(text) {
  const container = document.getElementById("content-container")
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = text;

  cardDiv.appendChild(nameSpan);
  container.appendChild(cardDiv);
}

async function loadTicketData() {
    try {
      const ticketData = await client.get(["ticket.customField:custom_field_id", "ticket.description"]);
      const description = ticketData["ticket.description"];

      if (description) {
        const foundMission = await getMissionId(description);
        const foundCodingLab = await getCodingLabId(description);
        const foundChallenge = await getChallengeId(description);

        const contentFound = foundMission || foundCodingLab || foundChallenge;
        
        if (!contentFound) {
          renderError("No content IDs found in ticket")
        }
      }
    } catch (error) {
      renderError("Error fetching ticket data")
      console.error("Error fetching ticket data:", error);
    }
}

displayUserName();
loadTicketData();